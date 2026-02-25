const {
    ACTIVE_STATUS,
    PENDING_STATUS,
    UNSUBSCRIBED_STATUS,
    encryptEmail,
    ensureSchema,
    generateToken,
    getBaseUrl,
    getSql,
    hashEmail,
    hashIp,
    hashToken,
    hashUserAgent,
    isAllowedOrigin,
    isValidEmail,
    normalizeEmail,
    parseBody,
    recordAttemptAndCheckRateLimit,
    sendEmail,
    sendJson
} = require("../_lib/newsletter");

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        sendJson(res, 405, { error: "Method not allowed." });
        return;
    }

    if (!isAllowedOrigin(req)) {
        sendJson(res, 403, { error: "Blocked origin." });
        return;
    }

    const body = parseBody(req);
    if (body === null) {
        sendJson(res, 400, { error: "Invalid request body." });
        return;
    }

    const honeypotValue = String(body.website || body.company || "").trim();
    if (honeypotValue) {
        sendJson(res, 202, {
            ok: true,
            message: "Check your inbox to confirm your subscription."
        });
        return;
    }

    const email = normalizeEmail(body.email);
    if (!isValidEmail(email)) {
        sendJson(res, 400, { error: "Enter a valid email address." });
        return;
    }

    const source = String(body.source || "site").trim().slice(0, 120);
    const ipHash = hashIp(req);
    const userAgentHash = hashUserAgent(req);

    try {
        await ensureSchema();
        const rateLimited = await recordAttemptAndCheckRateLimit(ipHash, userAgentHash);
        if (rateLimited) {
            sendJson(res, 429, {
                error: "Too many signup attempts. Please wait before retrying."
            });
            return;
        }

        const sql = getSql();
        const emailHash = hashEmail(email);
        const emailCiphertext = encryptEmail(email);
        const token = generateToken();
        const tokenHash = hashToken(token);

        const existingRows = await sql`
            SELECT id, status
            FROM newsletter_subscribers
            WHERE email_hash = ${emailHash}
            LIMIT 1;
        `;
        const existing = existingRows[0];

        if (existing && existing.status === ACTIVE_STATUS) {
            sendJson(res, 200, {
                ok: true,
                message: "You are already subscribed to Daily Drops."
            });
            return;
        }

        if (existing && (existing.status === PENDING_STATUS || existing.status === UNSUBSCRIBED_STATUS)) {
            await sql`
                UPDATE newsletter_subscribers
                SET
                    email_ciphertext = ${emailCiphertext},
                    status = ${PENDING_STATUS},
                    verify_token_hash = ${tokenHash},
                    source = ${source},
                    consent_ip_hash = ${ipHash},
                    user_agent_hash = ${userAgentHash},
                    unsubscribed_at = NULL
                WHERE id = ${existing.id};
            `;
        } else {
            await sql`
                INSERT INTO newsletter_subscribers (
                    email_hash,
                    email_ciphertext,
                    status,
                    verify_token_hash,
                    source,
                    consent_ip_hash,
                    user_agent_hash
                )
                VALUES (
                    ${emailHash},
                    ${emailCiphertext},
                    ${PENDING_STATUS},
                    ${tokenHash},
                    ${source},
                    ${ipHash},
                    ${userAgentHash}
                );
            `;
        }

        const baseUrl = getBaseUrl(req);
        const confirmLink = `${baseUrl}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;

        await sendEmail({
            to: email,
            subject: "Confirm your Daily Drops subscription",
            html: `
                <div style="font-family: Arial, sans-serif; color: #0f1720; line-height: 1.6;">
                    <h2 style="margin: 0 0 12px;">Confirm your Daily Drops subscription</h2>
                    <p style="margin: 0 0 14px;">
                        Click the button below to confirm you want a daily newsletter from zachwright.xyz.
                    </p>
                    <p style="margin: 20px 0;">
                        <a href="${confirmLink}" style="display: inline-block; background: #0f7b7d; color: #ffffff; text-decoration: none; padding: 12px 16px; border-radius: 8px; font-weight: 700;">Confirm Subscription</a>
                    </p>
                    <p style="margin: 0 0 8px; color: #3a4a5d;">
                        If you did not request this, you can ignore this email.
                    </p>
                    <p style="margin: 0; color: #66778e; font-size: 13px;">
                        Daily Drops by zachwright.xyz
                    </p>
                </div>
            `,
            text: [
                "Confirm your Daily Drops subscription.",
                "",
                `Open this link to confirm: ${confirmLink}`,
                "",
                "If you did not request this, ignore this email."
            ].join("\n")
        });

        sendJson(res, 200, {
            ok: true,
            message: "Check your inbox to confirm your subscription."
        });
    } catch (error) {
        console.error("newsletter/signup error", error);
        sendJson(res, 500, {
            error: "Unable to process signup right now. Please retry shortly."
        });
    }
};
