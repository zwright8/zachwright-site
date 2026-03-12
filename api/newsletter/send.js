const {
    ACTIVE_STATUS,
    CADENCE_DAILY,
    CADENCE_WEEKLY,
    buildUnsubscribeToken,
    decryptEmail,
    ensureSchema,
    getBaseUrl,
    getSql,
    isAuthorizedCron,
    isSupportedCadence,
    normalizeCadence,
    parseBody,
    readLatestUpdate,
    readUpdateBySlug,
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

function getCampaignMeta(cadence) {
    if (cadence === CADENCE_DAILY) {
        return {
            subjectPrefix: "Super Sonic Tsunami Daily Drop",
            previewFallback: "Your latest daily signal is live."
        };
    }
    return {
        subjectPrefix: "Super Sonic Tsunami Weekly Brief",
        previewFallback: "Your latest weekly insight is live."
    };
}

function resolveCadence(req, body, forcedCadence) {
    if (forcedCadence) {
        return forcedCadence;
    }

    const requestedCadence = String(
        getQueryValue(req, "cadence") ||
        (body && body.cadence ? body.cadence : "")
    ).trim().toLowerCase();

    if (!requestedCadence) {
        return normalizeCadence(process.env.NEWSLETTER_DEFAULT_SEND_CADENCE, CADENCE_DAILY);
    }
    if (!isSupportedCadence(requestedCadence)) {
        return "";
    }
    return requestedCadence;
}

async function runSendHandler(req, res, options) {
    const config = options || {};
    if (req.method !== "GET" && req.method !== "POST") {
        sendJson(res, 405, { error: "Method not allowed." });
        return;
    }

    if (!isAuthorizedCron(req)) {
        sendJson(res, 401, { error: "Unauthorized." });
        return;
    }

    const body = parseBody(req);
    if (body === null) {
        sendJson(res, 400, { error: "Invalid request body." });
        return;
    }

    const cadence = resolveCadence(req, body, config.forcedCadence);
    if (!cadence) {
        sendJson(res, 400, { error: "Invalid cadence. Use daily or weekly." });
        return;
    }

    const requestedSlug = String(
        getQueryValue(req, "slug") ||
        (body && body.slug ? body.slug : "")
    ).trim();
    const dryRun = isTruthy(getQueryValue(req, "dryRun")) || isTruthy(body && body.dryRun);
    const batchSizeEnv = Number(process.env.NEWSLETTER_BATCH_SIZE || "120");
    const batchSize = Number.isInteger(batchSizeEnv) ? Math.max(1, Math.min(batchSizeEnv, 400)) : 120;

    try {
        await ensureSchema();
        const targetUpdate = requestedSlug
            ? await readUpdateBySlug(requestedSlug)
            : await readLatestUpdate();
        if (!targetUpdate) {
            sendJson(res, 500, { error: "No valid update found in updates/index.json." });
            return;
        }

        const sql = getSql();
        const subscribers = await sql`
            SELECT id, email_hash, email_ciphertext
            FROM newsletter_subscribers
            WHERE status = ${ACTIVE_STATUS}
              AND cadence = ${cadence}
              AND (last_sent_slug IS NULL OR last_sent_slug <> ${targetUpdate.slug})
            ORDER BY verified_at ASC NULLS LAST, created_at ASC
            LIMIT ${batchSize};
        `;

        const campaign = getCampaignMeta(cadence);
        const baseUrl = getBaseUrl(req);
        const updateUrl = `${baseUrl}/updates/${targetUpdate.slug}.html`;
        const subject = `${campaign.subjectPrefix}: ${targetUpdate.title}`;
        const sent = [];
        const failed = [];

        for (const subscriber of subscribers) {
            try {
                const email = decryptEmail(subscriber.email_ciphertext);
                const unsubscribeToken = buildUnsubscribeToken(subscriber.id, subscriber.email_hash);
                const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;

                if (!dryRun) {
                    await sendEmail({
                        to: email,
                        subject: subject,
                        html: `
                            <div style="font-family: Arial, sans-serif; color: #101928; line-height: 1.62;">
                                <p style="font-size: 12px; color: #5d7189; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 10px;">
                                    Super Sonic Tsunami
                                </p>
                                <h2 style="margin: 0 0 12px;">${targetUpdate.title}</h2>
                                <p style="margin: 0 0 16px;">
                                    ${targetUpdate.preview || campaign.previewFallback}
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
                            "Super Sonic Tsunami",
                            "",
                            targetUpdate.title,
                            targetUpdate.preview || campaign.previewFallback,
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
                            last_sent_slug = ${targetUpdate.slug},
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
            cadence: cadence,
            update: targetUpdate.slug,
            attempted: subscribers.length,
            sent: sent.length,
            failed: failed.length
        });
    } catch (error) {
        console.error("newsletter/send error", error);
        sendJson(res, 500, { error: "Newsletter send failed." });
    }
}

async function handler(req, res) {
    return runSendHandler(req, res, {});
}

module.exports = handler;
module.exports.runSendHandler = runSendHandler;
module.exports.CADENCE_DAILY = CADENCE_DAILY;
module.exports.CADENCE_WEEKLY = CADENCE_WEEKLY;
