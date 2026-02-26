const {
    UNSUBSCRIBED_STATUS,
    ensureSchema,
    getSql,
    parseUnsubscribeToken,
    redirect,
    validateUnsubscribeSignature
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
    const parsed = parseUnsubscribeToken(token);
    if (!parsed) {
        redirect(res, "/?newsletter=invalid-token#signup");
        return;
    }

    try {
        await ensureSchema();
        const sql = getSql();

        const rows = await sql`
            SELECT id, email_hash
            FROM newsletter_subscribers
            WHERE id = ${parsed.subscriberId}
            LIMIT 1;
        `;
        const subscriber = rows[0];
        if (!subscriber) {
            redirect(res, "/?newsletter=invalid-token#signup");
            return;
        }

        if (!validateUnsubscribeSignature(subscriber.id, subscriber.email_hash, parsed.signature)) {
            redirect(res, "/?newsletter=invalid-token#signup");
            return;
        }

        await sql`
            UPDATE newsletter_subscribers
            SET
                status = ${UNSUBSCRIBED_STATUS},
                verify_token_hash = NULL,
                unsubscribed_at = NOW()
            WHERE id = ${subscriber.id};
        `;

        redirect(res, "/?newsletter=unsubscribed#signup");
    } catch (error) {
        console.error("newsletter/unsubscribe error", error);
        redirect(res, "/?newsletter=invalid-token#signup");
    }
};
