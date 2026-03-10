const { parseBody, sendJson } = require("../_lib/newsletter");
const { fulfillCheckout, getFulfillmentRecord } = require("../_lib/payments");

function extractSessionIdFromGet(req) {
    const url = new URL(String(req.url || "/"), "https://zachwright.xyz");
    return String(url.searchParams.get("session_id") || "").trim();
}

function extractSessionIdFromPost(req) {
    const body = parseBody(req);
    if (body === null || typeof body !== "object") {
        return "";
    }
    return String(body.session_id || body.sessionId || "").trim();
}

module.exports = async function handler(req, res) {
    if (req.method !== "GET" && req.method !== "POST") {
        sendJson(res, 405, { error: "Method not allowed." });
        return;
    }

    const sessionId = req.method === "GET"
        ? extractSessionIdFromGet(req)
        : extractSessionIdFromPost(req);

    if (!sessionId) {
        sendJson(res, 400, { error: "Missing session_id." });
        return;
    }

    try {
        const result = await fulfillCheckout(sessionId, {
            source: "fulfill_endpoint",
            eventType: "manual"
        });

        const record = await getFulfillmentRecord(sessionId);

        sendJson(res, 200, {
            ok: true,
            session_id: sessionId,
            status: result.status,
            tier: result.tier || (record ? record.tier : ""),
            deliverables: Array.isArray(result.deliverables) && result.deliverables.length > 0
                ? result.deliverables
                : (record ? record.deliverables : [])
        });
    } catch (error) {
        console.error("payments/fulfill endpoint error", {
            sessionId,
            message: error && error.message ? error.message : "Unknown"
        });
        sendJson(res, 500, {
            error: "Unable to fulfill this checkout session right now."
        });
    }
};
