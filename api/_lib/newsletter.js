const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
const { neon } = require("@neondatabase/serverless");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PENDING_STATUS = "pending";
const ACTIVE_STATUS = "active";
const UNSUBSCRIBED_STATUS = "unsubscribed";

let sqlClient = null;
let schemaReadyPromise = null;
let encryptionKey = null;

function getSql() {
    if (sqlClient) {
        return sqlClient;
    }
    const connectionString =
        process.env.NEWSLETTER_DATABASE_URL ||
        process.env.DATABASE_URL ||
        process.env.POSTGRES_URL ||
        "";

    if (!connectionString) {
        throw new Error("Missing newsletter database connection string.");
    }
    sqlClient = neon(connectionString);
    return sqlClient;
}

async function ensureSchema() {
    if (schemaReadyPromise) {
        return schemaReadyPromise;
    }

    schemaReadyPromise = (async function runSchema() {
        const sql = getSql();
        await sql`
            CREATE TABLE IF NOT EXISTS newsletter_subscribers (
                id BIGSERIAL PRIMARY KEY,
                email_hash CHAR(64) NOT NULL UNIQUE,
                email_ciphertext TEXT NOT NULL,
                status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'unsubscribed')),
                verify_token_hash CHAR(64),
                source TEXT,
                consent_ip_hash CHAR(64),
                user_agent_hash CHAR(64),
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                verified_at TIMESTAMPTZ,
                unsubscribed_at TIMESTAMPTZ,
                last_sent_slug TEXT,
                last_sent_at TIMESTAMPTZ
            );
        `;

        await sql`
            CREATE UNIQUE INDEX IF NOT EXISTS newsletter_verify_token_idx
            ON newsletter_subscribers (verify_token_hash)
            WHERE verify_token_hash IS NOT NULL;
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS newsletter_signup_attempts (
                id BIGSERIAL PRIMARY KEY,
                ip_hash CHAR(64) NOT NULL,
                user_agent_hash CHAR(64),
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `;

        await sql`
            CREATE INDEX IF NOT EXISTS newsletter_signup_attempts_ip_created_idx
            ON newsletter_signup_attempts (ip_hash, created_at DESC);
        `;
    })();

    try {
        await schemaReadyPromise;
    } catch (error) {
        schemaReadyPromise = null;
        throw error;
    }
}

function setSecurityHeaders(res) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "same-origin");
    res.setHeader("Cache-Control", "no-store, max-age=0");
}

function sendJson(res, statusCode, payload) {
    setSecurityHeaders(res);
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(payload));
}

function redirect(res, location) {
    setSecurityHeaders(res);
    res.statusCode = 302;
    res.setHeader("Location", location);
    res.end();
}

function parseBody(req) {
    if (req.body && typeof req.body === "object") {
        return req.body;
    }
    if (typeof req.body === "string" && req.body.trim()) {
        try {
            return JSON.parse(req.body);
        } catch (_error) {
            return null;
        }
    }
    return {};
}

function getBaseUrl(req) {
    if (process.env.SITE_BASE_URL) {
        return process.env.SITE_BASE_URL.replace(/\/+$/, "");
    }
    const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
    const proto = String(req.headers["x-forwarded-proto"] || "https").split(",")[0].trim();
    if (!host) {
        return "https://zachwright.xyz";
    }
    return `${proto}://${host}`;
}

function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
}

function isValidEmail(email) {
    if (!email || email.length > 320) {
        return false;
    }
    return EMAIL_REGEX.test(email);
}

function getEncryptionKey() {
    if (encryptionKey) {
        return encryptionKey;
    }
    const rawKey = process.env.NEWSLETTER_ENCRYPTION_KEY || "";
    if (!rawKey) {
        throw new Error("Missing NEWSLETTER_ENCRYPTION_KEY.");
    }

    let parsedKey = null;
    if (/^[0-9a-fA-F]{64}$/.test(rawKey)) {
        parsedKey = Buffer.from(rawKey, "hex");
    } else {
        parsedKey = Buffer.from(rawKey, "base64");
    }

    if (!parsedKey || parsedKey.length !== 32) {
        throw new Error("NEWSLETTER_ENCRYPTION_KEY must be a 32-byte key (base64 or 64-char hex).");
    }

    encryptionKey = parsedKey;
    return encryptionKey;
}

function getHashSecret() {
    const secret = process.env.NEWSLETTER_HASH_SECRET || process.env.NEWSLETTER_ENCRYPTION_KEY || "";
    if (!secret) {
        throw new Error("Missing hash secret for newsletter.");
    }
    return secret;
}

function hmacHex(purpose, value) {
    return crypto
        .createHmac("sha256", `${purpose}:${getHashSecret()}`)
        .update(String(value))
        .digest("hex");
}

function hashEmail(email) {
    return hmacHex("email", normalizeEmail(email));
}

function hashToken(token) {
    return hmacHex("token", token);
}

function buildUnsubscribeToken(subscriberId, emailHash) {
    const id = String(subscriberId);
    const signature = hmacHex("unsubscribe", `${id}:${emailHash}`);
    return `${id}.${signature}`;
}

function parseUnsubscribeToken(rawToken) {
    const token = String(rawToken || "");
    const parts = token.split(".");
    if (parts.length !== 2) {
        return null;
    }
    const subscriberId = Number(parts[0]);
    if (!Number.isInteger(subscriberId) || subscriberId <= 0) {
        return null;
    }
    return {
        subscriberId,
        signature: parts[1]
    };
}

function validateUnsubscribeSignature(subscriberId, emailHash, receivedSignature) {
    const expected = hmacHex("unsubscribe", `${subscriberId}:${emailHash}`);
    const expectedBuffer = Buffer.from(expected, "utf8");
    const receivedBuffer = Buffer.from(String(receivedSignature || ""), "utf8");
    if (expectedBuffer.length !== receivedBuffer.length) {
        return false;
    }
    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

function generateToken() {
    return crypto.randomBytes(24).toString("hex");
}

function encryptEmail(email) {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const ciphertext = Buffer.concat([cipher.update(email, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, ciphertext]).toString("base64");
}

function decryptEmail(payload) {
    const blob = Buffer.from(String(payload || ""), "base64");
    if (blob.length < 29) {
        throw new Error("Invalid encrypted email payload.");
    }
    const iv = blob.subarray(0, 12);
    const authTag = blob.subarray(12, 28);
    const ciphertext = blob.subarray(28);
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return plaintext.toString("utf8");
}

function getClientIp(req) {
    const forwardedFor = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    if (forwardedFor) {
        return forwardedFor;
    }
    const realIp = String(req.headers["x-real-ip"] || "").trim();
    if (realIp) {
        return realIp;
    }
    return "unknown";
}

function hashIp(req) {
    return hmacHex("ip", getClientIp(req));
}

function hashUserAgent(req) {
    const userAgent = String(req.headers["user-agent"] || "unknown");
    return hmacHex("ua", userAgent);
}

async function recordAttemptAndCheckRateLimit(ipHash, userAgentHash) {
    const sql = getSql();
    await sql`
        INSERT INTO newsletter_signup_attempts (ip_hash, user_agent_hash)
        VALUES (${ipHash}, ${userAgentHash});
    `;

    const windowRows = await sql`
        SELECT COUNT(*)::INT AS count
        FROM newsletter_signup_attempts
        WHERE ip_hash = ${ipHash}
          AND created_at > NOW() - INTERVAL '15 minutes';
    `;
    const dayRows = await sql`
        SELECT COUNT(*)::INT AS count
        FROM newsletter_signup_attempts
        WHERE ip_hash = ${ipHash}
          AND created_at > NOW() - INTERVAL '24 hours';
    `;

    const recentCount = Number(windowRows[0] && windowRows[0].count ? windowRows[0].count : 0);
    const dailyCount = Number(dayRows[0] && dayRows[0].count ? dayRows[0].count : 0);

    if (recentCount > 12 || dailyCount > 120) {
        return true;
    }
    return false;
}

function isAllowedOrigin(req) {
    const origin = String(req.headers.origin || "").trim();
    if (!origin) {
        return true;
    }

    const configured = String(process.env.NEWSLETTER_ALLOWED_ORIGINS || "")
        .split(",")
        .map(function (value) {
            return value.trim();
        })
        .filter(Boolean);

    if (configured.length > 0) {
        return configured.includes(origin);
    }

    const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
    const proto = String(req.headers["x-forwarded-proto"] || "https").split(",")[0].trim();
    if (!host) {
        return true;
    }
    return origin === `${proto}://${host}`;
}

function getBearerToken(req) {
    const authHeader = String(req.headers.authorization || "").trim();
    if (!authHeader.startsWith("Bearer ")) {
        return "";
    }
    return authHeader.slice("Bearer ".length).trim();
}

function timingSafeEqualText(a, b) {
    const left = Buffer.from(String(a || ""), "utf8");
    const right = Buffer.from(String(b || ""), "utf8");
    if (left.length !== right.length || left.length === 0) {
        return false;
    }
    return crypto.timingSafeEqual(left, right);
}

function isAuthorizedCron(req) {
    const secret = process.env.CRON_SECRET || process.env.NEWSLETTER_CRON_SECRET || "";
    if (!secret) {
        return false;
    }
    const incoming = getBearerToken(req);
    return timingSafeEqualText(secret, incoming);
}

async function sendEmail(message) {
    const apiKey = process.env.RESEND_API_KEY || "";
    const from = process.env.NEWSLETTER_FROM_EMAIL || "";
    if (!apiKey) {
        throw new Error("Missing RESEND_API_KEY.");
    }
    if (!from) {
        throw new Error("Missing NEWSLETTER_FROM_EMAIL.");
    }

    const payload = {
        from: from,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text
    };

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const details = await response.text();
        throw new Error(`Resend API error (${response.status}): ${details}`);
    }

    return response.json();
}

async function readLatestUpdate() {
    const updatesPath = path.join(process.cwd(), "updates", "index.json");
    const file = await fs.readFile(updatesPath, "utf8");
    const parsed = JSON.parse(file);
    if (!Array.isArray(parsed) || parsed.length === 0) {
        return null;
    }
    const sorted = parsed.slice().sort(function (left, right) {
        return new Date(right.date).getTime() - new Date(left.date).getTime();
    });
    const latest = sorted[0];
    if (!latest || !latest.slug || !latest.title) {
        return null;
    }
    return {
        slug: String(latest.slug),
        title: String(latest.title),
        preview: String(latest.preview || ""),
        date: String(latest.date || "")
    };
}

module.exports = {
    ACTIVE_STATUS,
    PENDING_STATUS,
    UNSUBSCRIBED_STATUS,
    buildUnsubscribeToken,
    decryptEmail,
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
    isAuthorizedCron,
    isValidEmail,
    normalizeEmail,
    parseBody,
    parseUnsubscribeToken,
    readLatestUpdate,
    recordAttemptAndCheckRateLimit,
    redirect,
    sendEmail,
    sendJson,
    validateUnsubscribeSignature
};
