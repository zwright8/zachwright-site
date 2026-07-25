module.exports = async function handler(req, res) {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Method not allowed." }));
        return;
    }

    res.statusCode = 410;
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
        ok: false,
        status: "retired",
        code: "AI_OPERATOR_KIT_RETIRED",
        message: "AI Operator Kit is retired and is not accepting new purchases.",
        links: {}
    }));
};
