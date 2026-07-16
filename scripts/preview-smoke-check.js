const expectedMarkers = [
    "WrightOps",
    "Public-Repository Fix Plans",
    "https://zachwright.xyz/",
    "https://zachwright.xyz/og.png",
    "id=\"root\""
];

const previewUrl = process.env.PREVIEW_URL || process.argv[2];
const bypassSecret =
    process.env.VERCEL_AUTOMATION_BYPASS_SECRET ||
    process.env.VERCEL_PROTECTION_BYPASS;

if (!previewUrl) {
    console.error("Usage: npm run check:preview -- <preview-url>");
    console.error("Set VERCEL_AUTOMATION_BYPASS_SECRET when the preview is protected.");
    process.exit(2);
}

let parsedUrl;
try {
    parsedUrl = new URL(previewUrl);
} catch (error) {
    console.error(`Invalid preview URL: ${previewUrl}`);
    process.exit(2);
}

const headers = {
    accept: "text/html,application/xhtml+xml",
    "user-agent": "zachwright-site-preview-smoke/1.0"
};

if (bypassSecret) {
    headers["x-vercel-protection-bypass"] = bypassSecret;
}

async function main() {
    const response = await fetch(parsedUrl, {
        headers,
        redirect: "follow"
    });
    const body = await response.text();
    const finalUrl = new URL(response.url);
    const redirectedToVercelLogin =
        finalUrl.hostname === "vercel.com" &&
        finalUrl.pathname.includes("/login");
    const protectionChallenge =
        response.status === 401 ||
        redirectedToVercelLogin ||
        body.includes("_vercel_sso_nonce") ||
        body.includes("Login – Vercel") ||
        body.includes("Login - Vercel");

    if (protectionChallenge) {
        const secretState = bypassSecret ? "provided but rejected" : "missing";
        throw new Error(
            [
                "Vercel deployment protection blocked preview verification.",
                `Bypass secret: ${secretState}.`,
                "Create a project Protection Bypass for Automation secret in Vercel,",
                "then expose it to CI/local verification as VERCEL_AUTOMATION_BYPASS_SECRET."
            ].join(" ")
        );
    }

    if (!response.ok) {
        throw new Error(`Preview returned HTTP ${response.status} at ${response.url}`);
    }

    const missingMarkers = expectedMarkers.filter((marker) => !body.includes(marker));
    if (missingMarkers.length > 0) {
        throw new Error(`Preview HTML is missing expected markers: ${missingMarkers.join(", ")}`);
    }

    console.log(
        JSON.stringify(
            {
                ok: true,
                status: response.status,
                requestedUrl: parsedUrl.href,
                finalUrl: response.url,
                bypassHeader: bypassSecret ? "sent" : "not-sent"
            },
            null,
            2
        )
    );
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
