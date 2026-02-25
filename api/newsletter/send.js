const {
    ACTIVE_STATUS,
    buildUnsubscribeToken,
    decryptEmail,
    ensureSchema,
    getBaseUrl,
    getSql,
    isAuthorizedCron,
    readLatestUpdate,
    sendEmail,
    sendJson
} = require("../_lib/newsletter");

function getQueryValue(req, key) {
    if (req.query && req.query[key] !== undefined) {
        return String(req.query[key]);
    }
    try {
        const url = new URL(req.url, "http://localhost");
        return String(url.searchParams.get(key) || "");
    } catch (_error) {
        return "";
    }
}

function isTruthy(value) {
    var normalized = String(value || "").trim().toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "yes";
}

module.exports = async function handler(req, res) {
    if (req.method !== "GET" && req.method !== "POST") {
        sendJson(res, 405, { error: "Method not allowed." });
        return;
    }

    if (!isAuthorizedCron(req)) {
        sendJson(res, 401, { error: "Unauthorized." });
        return;
    }

    const dryRun = isTruthy(getQueryValue(req, "dryRun"));
    const batchSizeEnv = Number(process.env.NEWSLETTER_BATCH_SIZE || "120");
    const batchSize = Number.isInteger(batchSizeEnv) ? Math.max(1, Math.min(batchSizeEnv, 400)) : 120;

    try {
        await ensureSchema();
        const latestUpdate = await readLatestUpdate();
        if (!latestUpdate) {
            sendJson(res, 500, { error: "No update found in updates/index.json." });
            return;
        }

        const sql = getSql();
        const subscribers = await sql`
            SELECT id, email_hash, email_ciphertext
            FROM newsletter_subscribers
            WHERE status = ${ACTIVE_STATUS}
              AND (last_sent_slug IS NULL OR last_sent_slug <> ${latestUpdate.slug})
            ORDER BY verified_at ASC NULLS LAST, created_at ASC
            LIMIT ${batchSize};
        `;

        const baseUrl = getBaseUrl(req);
        const updateUrl = `${baseUrl}/updates/${latestUpdate.slug}.html`;
        const sent = [];
        const failed = [];

        for (const subscriber of subscribers) {
            try {
                const email = decryptEmail(subscriber.email_ciphertext);
                const unsubscribeToken = buildUnsubscribeToken(subscriber.id, subscriber.email_hash);
                const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
                const subject = `Daily Drops: ${latestUpdate.title}`;

                if (!dryRun) {
                    await sendEmail({
                        to: email,
                        subject: subject,
                        html: `
                            <div style="font-family: Arial, sans-serif; color: #101928; line-height: 1.62;">
                                <p style="font-size: 12px; color: #5d7189; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 10px;">
                                    Daily Drops
                                </p>
                                <h2 style="margin: 0 0 12px;">${latestUpdate.title}</h2>
                                <p style="margin: 0 0 16px;">
                                    ${latestUpdate.preview || "Today’s update is live."}
                                </p>
                                <p style="margin: 0 0 18px;">
                                    <a href="${updateUrl}" style="display: inline-block; background: #0f7b7d; color: #ffffff; text-decoration: none; padding: 11px 15px; border-radius: 8px; font-weight: 700;">Read Update</a>
                                </p>
                                <p style="margin: 0; color: #63758b; font-size: 13px;">
                                    Unsubscribe: <a href="${unsubscribeUrl}">${unsubscribeUrl}</a>
                                </p>
                            </div>
                        `,
                        text: [
                            "Daily Drops",
                            "",
                            latestUpdate.title,
                            latestUpdate.preview || "Today’s update is live.",
                            "",
                            `Read: ${updateUrl}`,
                            "",
                            `Unsubscribe: ${unsubscribeUrl}`
                        ].join("\n")
                    });
                }

                sent.push({ id: subscriber.id });

                if (!dryRun) {
                    await sql`
                        UPDATE newsletter_subscribers
                        SET
                            last_sent_slug = ${latestUpdate.slug},
                            last_sent_at = NOW()
                        WHERE id = ${subscriber.id};
                    `;
                }
            } catch (sendError) {
                console.error("newsletter/send subscriber error", sendError);
                failed.push({ id: subscriber.id });
            }
        }

        sendJson(res, 200, {
            ok: true,
            dryRun: dryRun,
            update: latestUpdate.slug,
            attempted: subscribers.length,
            sent: sent.length,
            failed: failed.length
        });
    } catch (error) {
        console.error("newsletter/send error", error);
        sendJson(res, 500, { error: "Daily send failed." });
    }
};
