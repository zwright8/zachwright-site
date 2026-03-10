const { fulfillCheckout, getFulfillmentRecord } = require("../_lib/payments");

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function renderDeliverables(deliverables) {
    if (!Array.isArray(deliverables) || deliverables.length === 0) {
        return "<p>Your delivery email is being prepared. Please check your inbox in a moment.</p>";
    }

    const listItems = deliverables
        .map(function renderItem(item) {
            const href = escapeHtml(item && item.downloadUrl ? item.downloadUrl : "");
            const name = escapeHtml(item && item.name ? item.name : "Deliverable");
            return `<li><a href="${href}">${name}</a></li>`;
        })
        .join("");

    return `<ul>${listItems}</ul>`;
}

function renderPage(title, body) {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; color: #0f1720; line-height: 1.55; }
    main { max-width: 760px; margin: 0 auto; }
    h1 { margin-bottom: 12px; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }
    a { color: #0b4f9c; }
  </style>
</head>
<body>
  <main>
    ${body}
  </main>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(renderPage("Method Not Allowed", "<h1>Method not allowed</h1>"));
        return;
    }

    const url = new URL(String(req.url || "/"), "https://zachwright.xyz");
    const sessionId = String(url.searchParams.get("session_id") || "").trim();

    if (!sessionId) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(renderPage(
            "Missing Session ID",
            "<h1>Missing checkout session ID</h1><p>Please return to checkout and try again.</p>"
        ));
        return;
    }

    try {
        const result = await fulfillCheckout(sessionId, {
            source: "success_page",
            eventType: "redirect"
        });
        const record = await getFulfillmentRecord(sessionId);
        const deliverables = (result && Array.isArray(result.deliverables) && result.deliverables.length > 0)
            ? result.deliverables
            : (record && Array.isArray(record.deliverables) ? record.deliverables : []);

        const tier = escapeHtml((result && result.tier) || (record && record.tier) || "your");
        const status = escapeHtml(result && result.status ? result.status : "processing");
        const body = `
            <h1>Thanks for your purchase.</h1>
            <p>Checkout session: <code>${escapeHtml(sessionId)}</code></p>
            <p>Bundle: <strong>${tier}</strong></p>
            <p>Fulfillment status: <strong>${status}</strong></p>
            <h2>Your deliverables</h2>
            ${renderDeliverables(deliverables)}
            <p>If your links or email are missing, contact <a href="mailto:zach@zachwright.xyz">zach@zachwright.xyz</a>.</p>
        `;

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(renderPage("AI Operator Kit Delivery", body));
    } catch (error) {
        console.error("payments/success error", {
            sessionId,
            message: error && error.message ? error.message : "Unknown"
        });
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(renderPage(
            "Fulfillment Error",
            "<h1>We received your order.</h1><p>Automatic fulfillment hit a temporary issue. Please email zach@zachwright.xyz with your order details and we will send your files manually.</p>"
        ));
    }
};
