const { sendJson } = require("../_lib/newsletter");
const {
    fulfillCheckout,
    getWebhookSecret,
    markAsyncPaymentFailed,
    readRawBody,
    verifyStripeWebhookSignature
} = require("../_lib/payments");

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        sendJson(res, 405, { error: "Method not allowed." });
        return;
    }

    let webhookSecret = "";
    try {
        webhookSecret = getWebhookSecret();
    } catch (error) {
        console.error("payments/webhook configuration error", error);
        sendJson(res, 500, { error: "Webhook configuration is missing." });
        return;
    }

    let payloadBuffer = null;
    try {
        payloadBuffer = await readRawBody(req);
    } catch (error) {
        console.error("payments/webhook raw body error", error);
        sendJson(res, 400, { error: "Invalid request body." });
        return;
    }

    const signatureHeader = req.headers["stripe-signature"] || "";
    let event = null;
    try {
        verifyStripeWebhookSignature(payloadBuffer, signatureHeader, webhookSecret, 300);
        event = JSON.parse(payloadBuffer.toString("utf8"));
    } catch (error) {
        console.warn("payments/webhook signature verification failed", error.message);
        sendJson(res, 400, { error: "Invalid signature." });
        return;
    }

    const eventType = String(event && event.type ? event.type : "");
    const eventId = String(event && event.id ? event.id : "");
    const object = event && event.data ? event.data.object : null;
    const sessionId = String(object && object.id ? object.id : "");

    if (!sessionId) {
        sendJson(res, 200, { received: true, ignored: true, reason: "Missing session id." });
        return;
    }

    try {
        if (eventType === "checkout.session.completed" || eventType === "checkout.session.async_payment_succeeded") {
            const result = await fulfillCheckout(sessionId, {
                source: "webhook",
                eventType,
                eventId
            });
            sendJson(res, 200, {
                received: true,
                status: result.status,
                session_id: sessionId
            });
            return;
        }

        if (eventType === "checkout.session.async_payment_failed") {
            await markAsyncPaymentFailed(sessionId, {
                source: "webhook",
                eventType,
                eventId
            });
            sendJson(res, 200, {
                received: true,
                status: "payment_failed",
                session_id: sessionId
            });
            return;
        }

        sendJson(res, 200, {
            received: true,
            ignored: true,
            event_type: eventType
        });
    } catch (error) {
        console.error("payments/webhook processing error", {
            eventType,
            sessionId,
            message: error && error.message ? error.message : "Unknown"
        });
        sendJson(res, 500, { error: "Unable to process webhook event." });
    }
};
