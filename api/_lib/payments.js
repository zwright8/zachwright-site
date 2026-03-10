const crypto = require("node:crypto");
const { getSql } = require("./newsletter");

const STRIPE_API_BASE = "https://api.stripe.com/v1";
const TIER_LITE = "lite";
const TIER_PRO = "pro";
const TIER_AGENCY = "agency";

const FULFILLMENT_STALE_MINUTES = 10;
const FULFILLMENT_STALE_INTERVAL = `${FULFILLMENT_STALE_MINUTES} minutes`;

const LITE_BUNDLE_PATHS = [
    "deliverables/ai-operator-kit-prompts.md",
    "deliverables/ai-operator-kit-dashboard-template.md",
    "START-HERE.md",
    "VERSION.md",
    "LICENSE.md",
    "REFUND-POLICY.md"
];

const PRO_BUNDLE_ADDITIONAL_PATHS = [
    "deliverables/ai-operator-kit-sops.md",
    "deliverables/ai-operator-kit-automation-checklist.md",
    "deliverables/pro-bonus-workflows.md",
    "deliverables/pro-priority-update-pack.md",
    "lite-includes.md",
    "pro-includes.md"
];

const AGENCY_BUNDLE_ADDITIONAL_PATHS = [
    "deliverables/agency-team-ready-package.md",
    "deliverables/agency-implementation-playbook.md",
    "deliverables/agency-qa-scorecards.md",
    "deliverables/agency-capacity-planner-template.csv",
    "deliverables/agency-training-curriculum.md",
    "agency-includes.md"
];

let schemaReadyPromise = null;

function getStripeSecretKey() {
    const secretKey = String(process.env.STRIPE_SECRET_KEY || "").trim();
    if (!secretKey) {
        throw new Error("Missing STRIPE_SECRET_KEY.");
    }
    return secretKey;
}

function getWebhookSecret() {
    const secret = String(process.env.STRIPE_WEBHOOK_SECRET || "").trim();
    if (!secret) {
        throw new Error("Missing STRIPE_WEBHOOK_SECRET.");
    }
    return secret;
}

function getFulfillmentFromEmail() {
    const from =
        String(process.env.PAYMENTS_FROM_EMAIL || "").trim() ||
        String(process.env.NEWSLETTER_FROM_EMAIL || "").trim() ||
        String(process.env.RESEND_FROM_EMAIL || "").trim();
    if (!from) {
        throw new Error("Missing PAYMENTS_FROM_EMAIL (or NEWSLETTER_FROM_EMAIL / RESEND_FROM_EMAIL).");
    }
    return from;
}

function getResendApiKey() {
    const key = String(process.env.RESEND_API_KEY || "").trim();
    if (!key) {
        throw new Error("Missing RESEND_API_KEY.");
    }
    return key;
}

function normalizeString(value) {
    return String(value || "").trim();
}

function readMaybeBody(req) {
    if (Buffer.isBuffer(req.body)) {
        return req.body;
    }
    if (typeof req.body === "string") {
        return Buffer.from(req.body, "utf8");
    }
    if (req.body && typeof req.body === "object") {
        return Buffer.from(JSON.stringify(req.body), "utf8");
    }
    return null;
}

function readRawBody(req) {
    const existing = readMaybeBody(req);
    if (existing) {
        return Promise.resolve(existing);
    }

    return new Promise(function resolveRawBody(resolve, reject) {
        const chunks = [];
        req.on("data", function onData(chunk) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        req.on("end", function onEnd() {
            resolve(Buffer.concat(chunks));
        });
        req.on("error", reject);
    });
}

function parseStripeSignatureHeader(signatureHeader) {
    const header = normalizeString(signatureHeader);
    if (!header) {
        return null;
    }

    let timestamp = "";
    const signatures = [];

    for (const part of header.split(",")) {
        const trimmed = part.trim();
        if (!trimmed) {
            continue;
        }
        const index = trimmed.indexOf("=");
        if (index === -1) {
            continue;
        }
        const key = trimmed.slice(0, index).trim();
        const value = trimmed.slice(index + 1).trim();
        if (key === "t") {
            timestamp = value;
        }
        if (key === "v1" && value) {
            signatures.push(value);
        }
    }

    if (!timestamp || signatures.length === 0) {
        return null;
    }

    const timestampNumber = Number(timestamp);
    if (!Number.isFinite(timestampNumber)) {
        return null;
    }

    return {
        timestamp: timestampNumber,
        signatures
    };
}

function timingSafeEqualHex(leftHex, rightHex) {
    const left = Buffer.from(String(leftHex || ""), "utf8");
    const right = Buffer.from(String(rightHex || ""), "utf8");
    if (left.length === 0 || left.length !== right.length) {
        return false;
    }
    return crypto.timingSafeEqual(left, right);
}

function verifyStripeWebhookSignature(payloadBuffer, signatureHeader, webhookSecret, toleranceSeconds) {
    const parsed = parseStripeSignatureHeader(signatureHeader);
    if (!parsed) {
        throw new Error("Invalid Stripe signature header.");
    }

    const signedPayload = `${parsed.timestamp}.${payloadBuffer.toString("utf8")}`;
    const expected = crypto
        .createHmac("sha256", webhookSecret)
        .update(signedPayload)
        .digest("hex");

    const hasValidSignature = parsed.signatures.some(function isValid(signature) {
        return timingSafeEqualHex(expected, signature);
    });

    if (!hasValidSignature) {
        throw new Error("Stripe signature mismatch.");
    }

    const tolerance = Number.isFinite(toleranceSeconds) ? Number(toleranceSeconds) : 300;
    const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - parsed.timestamp);
    if (tolerance > 0 && ageSeconds > tolerance) {
        throw new Error("Stripe webhook timestamp is outside tolerance.");
    }
}

async function ensurePaymentsSchema() {
    if (schemaReadyPromise) {
        return schemaReadyPromise;
    }

    schemaReadyPromise = (async function runSchema() {
        const sql = getSql();
        await sql`
            CREATE TABLE IF NOT EXISTS payment_fulfillments (
                session_id TEXT PRIMARY KEY,
                fulfillment_status TEXT NOT NULL CHECK (fulfillment_status IN ('processing', 'awaiting_payment', 'fulfilled', 'failed')),
                tier TEXT,
                customer_email TEXT,
                customer_name TEXT,
                payment_status TEXT,
                amount_total_cents INT,
                currency TEXT,
                stripe_event_type TEXT,
                stripe_event_id TEXT,
                source TEXT,
                line_items_json JSONB,
                delivery_json JSONB,
                attempt_count INT NOT NULL DEFAULT 1,
                last_error TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                fulfilled_at TIMESTAMPTZ
            );
        `;

        await sql`
            CREATE INDEX IF NOT EXISTS payment_fulfillments_status_idx
            ON payment_fulfillments (fulfillment_status, updated_at DESC);
        `;
    })();

    try {
        await schemaReadyPromise;
    } catch (error) {
        schemaReadyPromise = null;
        throw error;
    }
}

function getAssetsRepoConfig() {
    const siteBaseUrl = normalizeString(process.env.SITE_BASE_URL || "https://zachwright.xyz").replace(/\/+$/, "");
    const localDeliverablesPath = normalizeString(process.env.AI_OPERATOR_KIT_DELIVERABLES_PATH || "/products/ai-operator-kit/files");
    const normalizedLocalPath = localDeliverablesPath.startsWith("/")
        ? localDeliverablesPath
        : `/${localDeliverablesPath}`;
    const defaultBaseUrl = `${siteBaseUrl}${normalizedLocalPath}`.replace(/\/+$/, "");

    const baseUrlOverride = normalizeString(process.env.AI_OPERATOR_KIT_DELIVERABLES_BASE_URL || "").replace(/\/+$/, "");
    const repo = normalizeString(process.env.AI_OPERATOR_KIT_ASSETS_REPO || "zwright8/zw-business-assets");
    const ref = normalizeString(process.env.AI_OPERATOR_KIT_ASSETS_REF || "main");
    const rootPath = normalizeString(process.env.AI_OPERATOR_KIT_ASSETS_ROOT || "products/ai-operator-kit").replace(/^\/+|\/+$/g, "");

    return {
        defaultBaseUrl,
        repo,
        ref,
        rootPath,
        baseUrlOverride
    };
}

function uniquePaths(paths) {
    const seen = new Set();
    const output = [];
    for (const path of paths) {
        const normalized = normalizeString(path).replace(/^\/+/, "");
        if (!normalized) {
            continue;
        }
        if (seen.has(normalized)) {
            continue;
        }
        seen.add(normalized);
        output.push(normalized);
    }
    return output;
}

function getBundlePathsForTier(tier) {
    const normalizedTier = normalizeString(tier).toLowerCase();
    if (normalizedTier === TIER_LITE) {
        return uniquePaths(LITE_BUNDLE_PATHS);
    }
    if (normalizedTier === TIER_PRO) {
        return uniquePaths(LITE_BUNDLE_PATHS.concat(PRO_BUNDLE_ADDITIONAL_PATHS));
    }
    if (normalizedTier === TIER_AGENCY) {
        return uniquePaths(
            LITE_BUNDLE_PATHS
                .concat(PRO_BUNDLE_ADDITIONAL_PATHS)
                .concat(AGENCY_BUNDLE_ADDITIONAL_PATHS)
        );
    }
    throw new Error(`Unsupported tier: ${tier}`);
}

function fileNameFromPath(filePath) {
    const normalized = normalizeString(filePath);
    const parts = normalized.split("/");
    return parts[parts.length - 1] || normalized;
}

function titleCaseTier(tier) {
    const normalized = normalizeString(tier).toLowerCase();
    if (normalized === TIER_LITE) {
        return "Lite";
    }
    if (normalized === TIER_PRO) {
        return "Pro";
    }
    if (normalized === TIER_AGENCY) {
        return "Agency";
    }
    return normalized || "Unknown";
}

function buildDeliverableLinks(tier) {
    const paths = getBundlePathsForTier(tier);
    const repoConfig = getAssetsRepoConfig();

    return paths.map(function toLink(path) {
        const encodedPath = path
            .split("/")
            .map(encodeURIComponent)
            .join("/");
        const fullRelativePath = `${repoConfig.rootPath}/${path}`;
        const baseUrl = repoConfig.baseUrlOverride || repoConfig.defaultBaseUrl;

        const downloadUrl = `${baseUrl}/${encodedPath}`;
        const viewUrl = repoConfig.baseUrlOverride
            ? `${repoConfig.baseUrlOverride}/${path}`
            : `https://github.com/${repoConfig.repo}/blob/${repoConfig.ref}/${fullRelativePath}`;

        return {
            path,
            name: fileNameFromPath(path),
            downloadUrl,
            viewUrl
        };
    });
}

function getTierFromConfiguredPriceId(priceId) {
    const normalized = normalizeString(priceId);
    if (!normalized) {
        return "";
    }

    if (normalized === normalizeString(process.env.STRIPE_PRICE_ID_AI_OPERATOR_KIT_LITE)) {
        return TIER_LITE;
    }
    if (normalized === normalizeString(process.env.STRIPE_PRICE_ID_AI_OPERATOR_KIT_PRO)) {
        return TIER_PRO;
    }
    if (normalized === normalizeString(process.env.STRIPE_PRICE_ID_AI_OPERATOR_KIT_AGENCY)) {
        return TIER_AGENCY;
    }
    return "";
}

function getTierFromAmountCents(amountCents) {
    const amount = Number(amountCents);
    if (!Number.isFinite(amount)) {
        return "";
    }
    if (amount === 2900) {
        return TIER_LITE;
    }
    if (amount === 7900) {
        return TIER_PRO;
    }
    if (amount === 14900) {
        return TIER_AGENCY;
    }
    return "";
}

function getTierFromLabel(label) {
    const normalized = normalizeString(label).toLowerCase();
    if (!normalized) {
        return "";
    }
    if (/\bagency\b/.test(normalized)) {
        return TIER_AGENCY;
    }
    if (/\bpro\b/.test(normalized)) {
        return TIER_PRO;
    }
    if (/\blite\b/.test(normalized)) {
        return TIER_LITE;
    }
    return "";
}

function getLineItemsFromSession(session) {
    const lineItems = session && session.line_items && Array.isArray(session.line_items.data)
        ? session.line_items.data
        : [];
    return lineItems;
}

function resolveTierFromSession(session) {
    const candidates = new Set();

    const metadata = session && session.metadata ? session.metadata : {};
    const metadataTier = getTierFromLabel(metadata.tier || metadata.plan || "");
    if (metadataTier) {
        candidates.add(metadataTier);
    }

    const lineItems = getLineItemsFromSession(session);
    for (const item of lineItems) {
        const price = item && item.price ? item.price : {};
        const product = price && price.product && typeof price.product === "object"
            ? price.product
            : {};

        const configuredTier = getTierFromConfiguredPriceId(price.id);
        if (configuredTier) {
            candidates.add(configuredTier);
        }

        const unitAmountTier = getTierFromAmountCents(price.unit_amount);
        if (unitAmountTier) {
            candidates.add(unitAmountTier);
        }

        const itemAmountTier = getTierFromAmountCents(item.amount_subtotal || item.amount_total);
        if (itemAmountTier) {
            candidates.add(itemAmountTier);
        }

        const productNameTier = getTierFromLabel(product.name || price.nickname || "");
        if (productNameTier) {
            candidates.add(productNameTier);
        }
    }

    const sessionAmountTier = getTierFromAmountCents(session && session.amount_subtotal);
    if (sessionAmountTier) {
        candidates.add(sessionAmountTier);
    }

    if (candidates.size === 1) {
        return Array.from(candidates)[0];
    }

    if (candidates.size === 0) {
        throw new Error("Unable to resolve purchased tier from Checkout Session.");
    }

    throw new Error(`Ambiguous purchased tier for Checkout Session: ${Array.from(candidates).join(", ")}`);
}

function getCustomerEmailFromSession(session) {
    const customerDetailsEmail = session && session.customer_details ? normalizeString(session.customer_details.email || "") : "";
    if (customerDetailsEmail) {
        return customerDetailsEmail.toLowerCase();
    }
    const customerEmail = session && session.customer && typeof session.customer === "object"
        ? normalizeString(session.customer.email || "")
        : "";
    return customerEmail.toLowerCase();
}

function getCustomerNameFromSession(session) {
    const customerDetailsName = session && session.customer_details ? normalizeString(session.customer_details.name || "") : "";
    if (customerDetailsName) {
        return customerDetailsName;
    }
    const customerName = session && session.customer && typeof session.customer === "object"
        ? normalizeString(session.customer.name || "")
        : "";
    return customerName;
}

function sanitizeErrorMessage(error) {
    const message = error && error.message ? String(error.message) : "Unknown fulfillment error.";
    return message.slice(0, 500);
}

function parseJsonColumn(value) {
    if (!value) {
        return null;
    }
    if (typeof value === "object") {
        return value;
    }
    try {
        return JSON.parse(String(value));
    } catch (_error) {
        return null;
    }
}

async function stripeGet(path, params) {
    const secretKey = getStripeSecretKey();
    const query = params && params.toString() ? `?${params.toString()}` : "";
    const url = `${STRIPE_API_BASE}${path}${query}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${secretKey}`
        }
    });

    const responseText = await response.text();
    let payload = null;
    try {
        payload = responseText ? JSON.parse(responseText) : null;
    } catch (_error) {
        payload = null;
    }

    if (!response.ok) {
        const stripeMessage =
            payload && payload.error && payload.error.message
                ? payload.error.message
                : responseText || response.statusText;
        throw new Error(`Stripe API error (${response.status}): ${stripeMessage}`);
    }

    return payload;
}

async function listCheckoutLineItems(sessionId) {
    const items = [];
    let startingAfter = "";

    while (true) {
        const params = new URLSearchParams();
        params.set("limit", "100");
        params.append("expand[]", "data.price");
        params.append("expand[]", "data.price.product");
        if (startingAfter) {
            params.set("starting_after", startingAfter);
        }

        const page = await stripeGet(`/checkout/sessions/${encodeURIComponent(sessionId)}/line_items`, params);
        const data = Array.isArray(page && page.data) ? page.data : [];
        items.push.apply(items, data);

        const hasMore = Boolean(page && page.has_more);
        if (!hasMore || data.length === 0) {
            break;
        }

        startingAfter = data[data.length - 1].id;
    }

    return items;
}

async function retrieveCheckoutSession(sessionId) {
    const params = new URLSearchParams();
    params.append("expand[]", "customer");
    params.append("expand[]", "line_items");
    params.append("expand[]", "line_items.data.price");
    params.append("expand[]", "line_items.data.price.product");

    const session = await stripeGet(`/checkout/sessions/${encodeURIComponent(sessionId)}`, params);
    const lineItems = await listCheckoutLineItems(sessionId);
    if (lineItems.length > 0) {
        session.line_items = { data: lineItems };
    }
    return session;
}

async function sendFulfillmentEmail(message) {
    const apiKey = getResendApiKey();
    const from = getFulfillmentFromEmail();

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from: from,
            to: [message.to],
            subject: message.subject,
            html: message.html,
            text: message.text
        })
    });

    if (!response.ok) {
        const details = await response.text();
        throw new Error(`Resend API error (${response.status}): ${details}`);
    }

    return response.json();
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function buildFulfillmentEmail(tier, customerName, sessionId, deliverables) {
    const tierLabel = titleCaseTier(tier);
    const safeName = customerName ? escapeHtml(customerName) : "there";

    const listHtml = deliverables
        .map(function renderDeliverable(deliverable) {
            return `<li style="margin: 0 0 8px;"><a href="${escapeHtml(deliverable.downloadUrl)}">${escapeHtml(deliverable.name)}</a></li>`;
        })
        .join("");

    const listText = deliverables
        .map(function renderTextLine(deliverable) {
            return `- ${deliverable.name}: ${deliverable.downloadUrl}`;
        })
        .join("\n");

    return {
        subject: `Your AI Operator Kit ${tierLabel} delivery`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #0f1720; line-height: 1.6;">
                <h2 style="margin: 0 0 12px;">Your AI Operator Kit ${escapeHtml(tierLabel)} is ready</h2>
                <p style="margin: 0 0 12px;">Hi ${safeName},</p>
                <p style="margin: 0 0 14px;">
                    Thanks for your purchase. Use the links below to access your deliverables immediately.
                </p>
                <ul style="padding-left: 18px; margin: 0 0 14px;">
                    ${listHtml}
                </ul>
                <p style="margin: 0 0 10px; color: #4a5568;">
                    Checkout session: <code>${escapeHtml(sessionId)}</code>
                </p>
                <p style="margin: 0; color: #66778e; font-size: 13px;">
                    If any link fails, reply to this email and we will resend your bundle.
                </p>
            </div>
        `,
        text: [
            `Your AI Operator Kit ${tierLabel} is ready.`,
            "",
            customerName ? `Hi ${customerName},` : "Hi,",
            "Thanks for your purchase. Use the links below to access your deliverables:",
            "",
            listText,
            "",
            `Checkout session: ${sessionId}`,
            "",
            "If any link fails, reply to this email and we will resend your bundle."
        ].join("\n")
    };
}

async function claimFulfillmentWork(sessionId) {
    const sql = getSql();
    const inserted = await sql`
        INSERT INTO payment_fulfillments (
            session_id,
            fulfillment_status,
            attempt_count,
            created_at,
            updated_at
        )
        VALUES (
            ${sessionId},
            'processing',
            1,
            NOW(),
            NOW()
        )
        ON CONFLICT (session_id) DO NOTHING
        RETURNING session_id;
    `;

    if (inserted.length > 0) {
        return { status: "claimed" };
    }

    const existingRows = await sql`
        SELECT
            session_id,
            fulfillment_status,
            updated_at,
            tier,
            customer_email,
            customer_name,
            payment_status,
            amount_total_cents,
            currency,
            delivery_json,
            fulfilled_at
        FROM payment_fulfillments
        WHERE session_id = ${sessionId}
        LIMIT 1;
    `;

    if (existingRows.length === 0) {
        return { status: "claimed" };
    }

    const existing = existingRows[0];
    if (existing.fulfillment_status === "fulfilled") {
        return {
            status: "already_fulfilled",
            row: existing
        };
    }

    const reclaimed = await sql`
        UPDATE payment_fulfillments
        SET
            fulfillment_status = 'processing',
            attempt_count = attempt_count + 1,
            updated_at = NOW()
        WHERE
            session_id = ${sessionId}
            AND (
                fulfillment_status IN ('awaiting_payment', 'failed')
                OR (
                    fulfillment_status = 'processing'
                    AND updated_at < NOW() - ${FULFILLMENT_STALE_INTERVAL}::INTERVAL
                )
            )
        RETURNING session_id;
    `;

    if (reclaimed.length > 0) {
        return { status: "claimed" };
    }

    return {
        status: "in_progress",
        row: existing
    };
}

async function markAwaitingPayment(session, tier, context, lineItems) {
    const sql = getSql();
    const sessionId = normalizeString(session && session.id);
    const customerEmail = getCustomerEmailFromSession(session);
    const customerName = getCustomerNameFromSession(session);

    await sql`
        UPDATE payment_fulfillments
        SET
            fulfillment_status = 'awaiting_payment',
            tier = ${tier || null},
            customer_email = ${customerEmail || null},
            customer_name = ${customerName || null},
            payment_status = ${normalizeString(session.payment_status || "") || null},
            amount_total_cents = ${Number.isFinite(Number(session.amount_total)) ? Number(session.amount_total) : null},
            currency = ${normalizeString(session.currency || "").toUpperCase() || null},
            stripe_event_type = ${normalizeString(context.eventType || "") || null},
            stripe_event_id = ${normalizeString(context.eventId || "") || null},
            source = ${normalizeString(context.source || "") || null},
            line_items_json = ${JSON.stringify(lineItems || [])}::jsonb,
            last_error = NULL,
            updated_at = NOW()
        WHERE session_id = ${sessionId};
    `;
}

async function markFulfilled(session, tier, context, lineItems, deliverables) {
    const sql = getSql();
    const sessionId = normalizeString(session && session.id);
    const customerEmail = getCustomerEmailFromSession(session);
    const customerName = getCustomerNameFromSession(session);

    await sql`
        UPDATE payment_fulfillments
        SET
            fulfillment_status = 'fulfilled',
            tier = ${tier || null},
            customer_email = ${customerEmail || null},
            customer_name = ${customerName || null},
            payment_status = ${normalizeString(session.payment_status || "") || null},
            amount_total_cents = ${Number.isFinite(Number(session.amount_total)) ? Number(session.amount_total) : null},
            currency = ${normalizeString(session.currency || "").toUpperCase() || null},
            stripe_event_type = ${normalizeString(context.eventType || "") || null},
            stripe_event_id = ${normalizeString(context.eventId || "") || null},
            source = ${normalizeString(context.source || "") || null},
            line_items_json = ${JSON.stringify(lineItems || [])}::jsonb,
            delivery_json = ${JSON.stringify(deliverables || [])}::jsonb,
            last_error = NULL,
            fulfilled_at = NOW(),
            updated_at = NOW()
        WHERE session_id = ${sessionId};
    `;
}

async function markFailed(sessionId, context, error, fallbackSessionData) {
    const sql = getSql();
    const paymentStatus = normalizeString((fallbackSessionData && fallbackSessionData.payment_status) || "") || null;
    const amountTotal = Number.isFinite(Number(fallbackSessionData && fallbackSessionData.amount_total))
        ? Number(fallbackSessionData.amount_total)
        : null;
    const currency = normalizeString((fallbackSessionData && fallbackSessionData.currency) || "").toUpperCase() || null;

    await sql`
        UPDATE payment_fulfillments
        SET
            fulfillment_status = 'failed',
            stripe_event_type = ${normalizeString(context.eventType || "") || null},
            stripe_event_id = ${normalizeString(context.eventId || "") || null},
            source = ${normalizeString(context.source || "") || null},
            payment_status = COALESCE(${paymentStatus}, payment_status),
            amount_total_cents = COALESCE(${amountTotal}, amount_total_cents),
            currency = COALESCE(${currency}, currency),
            last_error = ${sanitizeErrorMessage(error)},
            updated_at = NOW()
        WHERE session_id = ${sessionId};
    `;
}

function summarizeRow(row) {
    if (!row) {
        return null;
    }
    const delivery = parseJsonColumn(row.delivery_json);
    return {
        sessionId: row.session_id,
        status: row.fulfillment_status,
        tier: row.tier || "",
        customerEmail: row.customer_email || "",
        customerName: row.customer_name || "",
        paymentStatus: row.payment_status || "",
        amountTotalCents: Number.isFinite(Number(row.amount_total_cents)) ? Number(row.amount_total_cents) : null,
        currency: row.currency || "",
        deliverables: Array.isArray(delivery) ? delivery : [],
        fulfilledAt: row.fulfilled_at || null
    };
}

async function getFulfillmentRecord(sessionId) {
    await ensurePaymentsSchema();
    const sql = getSql();
    const rows = await sql`
        SELECT
            session_id,
            fulfillment_status,
            tier,
            customer_email,
            customer_name,
            payment_status,
            amount_total_cents,
            currency,
            delivery_json,
            fulfilled_at
        FROM payment_fulfillments
        WHERE session_id = ${sessionId}
        LIMIT 1;
    `;
    if (rows.length === 0) {
        return null;
    }
    return summarizeRow(rows[0]);
}

async function markAsyncPaymentFailed(sessionId, context) {
    await ensurePaymentsSchema();
    const sql = getSql();

    const inserted = await sql`
        INSERT INTO payment_fulfillments (
            session_id,
            fulfillment_status,
            attempt_count,
            created_at,
            updated_at,
            stripe_event_type,
            stripe_event_id,
            source,
            last_error
        )
        VALUES (
            ${sessionId},
            'failed',
            1,
            NOW(),
            NOW(),
            ${normalizeString(context.eventType || "") || null},
            ${normalizeString(context.eventId || "") || null},
            ${normalizeString(context.source || "") || null},
            'Stripe reported async payment failure.'
        )
        ON CONFLICT (session_id) DO NOTHING
        RETURNING session_id;
    `;

    if (inserted.length > 0) {
        return;
    }

    await sql`
        UPDATE payment_fulfillments
        SET
            fulfillment_status = CASE
                WHEN fulfillment_status = 'fulfilled' THEN fulfillment_status
                ELSE 'failed'
            END,
            stripe_event_type = ${normalizeString(context.eventType || "") || null},
            stripe_event_id = ${normalizeString(context.eventId || "") || null},
            source = ${normalizeString(context.source || "") || null},
            last_error = CASE
                WHEN fulfillment_status = 'fulfilled' THEN last_error
                ELSE 'Stripe reported async payment failure.'
            END,
            updated_at = NOW()
        WHERE session_id = ${sessionId};
    `;
}

async function fulfillCheckout(sessionId, context) {
    const normalizedSessionId = normalizeString(sessionId);
    if (!normalizedSessionId) {
        throw new Error("Missing checkout session id.");
    }
    if (!/^cs_[A-Za-z0-9_]+$/.test(normalizedSessionId)) {
        throw new Error("Invalid checkout session id.");
    }

    await ensurePaymentsSchema();
    const workflowContext = context || {};

    const claim = await claimFulfillmentWork(normalizedSessionId);
    if (claim.status === "already_fulfilled") {
        const summary = summarizeRow(claim.row);
        return {
            ok: true,
            sessionId: normalizedSessionId,
            status: "already_fulfilled",
            tier: summary && summary.tier ? summary.tier : "",
            deliverables: summary ? summary.deliverables : []
        };
    }
    if (claim.status === "in_progress") {
        return {
            ok: true,
            sessionId: normalizedSessionId,
            status: "in_progress"
        };
    }

    let session = null;
    try {
        session = await retrieveCheckoutSession(normalizedSessionId);
        const lineItems = getLineItemsFromSession(session);
        const tier = resolveTierFromSession(session);
        const paymentStatus = normalizeString(session.payment_status || "");

        if (paymentStatus === "unpaid") {
            await markAwaitingPayment(session, tier, workflowContext, lineItems);
            return {
                ok: true,
                sessionId: normalizedSessionId,
                status: "awaiting_payment",
                tier: tier
            };
        }

        const customerEmail = getCustomerEmailFromSession(session);
        if (!customerEmail) {
            throw new Error("Checkout Session has no customer email to deliver assets.");
        }

        const customerName = getCustomerNameFromSession(session);
        const deliverables = buildDeliverableLinks(tier);
        const email = buildFulfillmentEmail(tier, customerName, normalizedSessionId, deliverables);
        await sendFulfillmentEmail({
            to: customerEmail,
            subject: email.subject,
            html: email.html,
            text: email.text
        });

        await markFulfilled(session, tier, workflowContext, lineItems, deliverables);
        return {
            ok: true,
            sessionId: normalizedSessionId,
            status: "fulfilled",
            tier,
            deliverables
        };
    } catch (error) {
        try {
            await markFailed(normalizedSessionId, workflowContext, error, session);
        } catch (markError) {
            console.error("payments/fulfillment markFailed error", markError);
        }
        throw error;
    }
}

module.exports = {
    TIER_AGENCY,
    TIER_LITE,
    TIER_PRO,
    buildDeliverableLinks,
    ensurePaymentsSchema,
    fulfillCheckout,
    getFulfillmentRecord,
    getWebhookSecret,
    markAsyncPaymentFailed,
    readRawBody,
    verifyStripeWebhookSignature
};
