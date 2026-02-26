const {
    ACTIVE_STATUS,
    buildUnsubscribeToken,
    decryptEmail,
    ensureSchema,
    getBaseUrl,
    getSql,
    hashToken,
    redirect,
    sendEmail
} = require("../_lib/newsletter");

function getQueryToken(req) {
    if (req.query && req.query.token) {
        return String(req.query.token);
    }
    try {
        const url = new URL(req.url, "http://localhost");
        return String(url.searchParams.get("token") || "");
    } catch (_error) {
        return "";
    }
}

module.exports = async function handler(req, res) {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.end("Method not allowed.");
        return;
    }

    const token = getQueryToken(req);
    if (!token) {
        redirect(res, "/?newsletter=invalid-token#signup");
        return;
    }

    try {
        await ensureSchema();
        const sql = getSql();
        const tokenHash = hashToken(token);

        const rows = await sql`
            UPDATE newsletter_subscribers
            SET
                status = ${ACTIVE_STATUS},
                verify_token_hash = NULL,
                verified_at = COALESCE(verified_at, NOW()),
                unsubscribed_at = NULL
            WHERE verify_token_hash = ${tokenHash}
            RETURNING id, email_hash, email_ciphertext;
        `;

        if (!rows[0]) {
            redirect(res, "/?newsletter=invalid-token#signup");
            return;
        }

        const subscriber = rows[0];
        const baseUrl = getBaseUrl(req);

        try {
            const email = decryptEmail(subscriber.email_ciphertext);
            const unsubscribeToken = buildUnsubscribeToken(subscriber.id, subscriber.email_hash);
            const unsubscribeLink = `${baseUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
            await sendEmail({
                to: email,
                subject: "Super Sonic Tsunami subscription confirmed",
                html: `
                    <div style="font-family: Arial, sans-serif; color: #0f1720; line-height: 1.6;">
                        <h2 style="margin: 0 0 12px;">You are subscribed</h2>
                        <p style="margin: 0 0 14px;">
                            You will now receive Super Sonic Tsunami at this email.
                        </p>
                        <p style="margin: 0 0 14px;">
                            Unsubscribe any time:
                            <a href="${unsubscribeLink}">${unsubscribeLink}</a>
                        </p>
                    </div>
                `,
                text: [
                    "Your Super Sonic Tsunami subscription is now confirmed.",
                    "",
                    `Unsubscribe any time: ${unsubscribeLink}`
                ].join("\n")
            });
        } catch (mailError) {
            console.error("newsletter/confirm welcome mail error", mailError);
        }

        redirect(res, "/?newsletter=confirmed#signup");
    } catch (error) {
        console.error("newsletter/confirm error", error);
        redirect(res, "/?newsletter=invalid-token#signup");
    }
};
