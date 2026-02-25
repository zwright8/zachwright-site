const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const apiFiles = [
    "api/_lib/newsletter.js",
    "api/newsletter/signup.js",
    "api/newsletter/confirm.js",
    "api/newsletter/unsubscribe.js",
    "api/newsletter/send.js"
];

for (const relativePath of apiFiles) {
    const absolutePath = path.join(root, relativePath);
    if (!fs.existsSync(absolutePath)) {
        throw new Error(`Missing required file: ${relativePath}`);
    }
    const loaded = require(absolutePath);
    if (relativePath.includes("/newsletter/") && typeof loaded !== "function") {
        throw new Error(`Expected function export from ${relativePath}`);
    }
}

const updatesIndex = fs.readFileSync(path.join(root, "updates", "index.html"), "utf8");
if (!updatesIndex.includes("id=\"newsletter-form\"")) {
    throw new Error("updates/index.html does not contain newsletter form.");
}

console.log("newsletter smoke check passed");
