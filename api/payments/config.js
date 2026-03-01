module.exports = async function handler(req, res) {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Method not allowed." }));
        return;
    }

    const links = {
        lite: process.env.STRIPE_PAYMENT_LINK_AI_OPERATOR_KIT_LITE || "https://buy.stripe.com/aFaeV54ZK9LP4og5Sd6Zy02",
        pro: process.env.STRIPE_PAYMENT_LINK_AI_OPERATOR_KIT_PRO || "https://buy.stripe.com/bJe9AL3VG0bfaME80l6Zy01",
        agency: process.env.STRIPE_PAYMENT_LINK_AI_OPERATOR_KIT_AGENCY || "https://buy.stripe.com/6oU5kv8bWf69bQI2G16Zy00"
    };

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true, links }));
};
