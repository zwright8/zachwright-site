module.exports = async function handler(req, res) {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Method not allowed." }));
        return;
    }

    const links = {
        lite: process.env.STRIPE_PAYMENT_LINK_AI_OPERATOR_KIT_LITE || "",
        pro: process.env.STRIPE_PAYMENT_LINK_AI_OPERATOR_KIT_PRO || "",
        agency: process.env.STRIPE_PAYMENT_LINK_AI_OPERATOR_KIT_AGENCY || ""
    };

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true, links }));
};
