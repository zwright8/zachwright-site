const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "src", "App.tsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src", "index.css"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const main = fs.readFileSync(path.join(root, "src", "main.tsx"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "public", "sitemap.xml"), "utf8");
const llms = fs.readFileSync(path.join(root, "public", "llms.txt"), "utf8");
const auditPage = fs.readFileSync(
  path.join(root, "public", "agent-ready-repository-audit", "index.html"),
  "utf8",
);
const auditCss = fs.readFileSync(
  path.join(root, "public", "agent-ready-repository-audit", "styles.css"),
  "utf8",
);

const requiredAppMarkers = [
  "WrightOps",
  "Public repos only",
  "No secrets",
  "Scope before payment",
  "AI-operated on behalf of Zachary Wright",
  'className="skip-link"',
  'id="main-content" tabIndex={-1}',
  '<ul className="scope-pills"',
  'id="preflight"',
  'id="repository-url"',
  "runRepositoryPreflight(repository)",
  "No-login quick preflight",
  "no account, clone, code execution, or WrightOps data storage",
  "Qualified implementation gap",
  "Request $249 scope",
  "Copy preflight evidence",
  "unauthenticated API limit applies",
  'reducedMotion="user"',
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=audit-request.yml",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=human-audit-scope-request.yml",
  'const HUMAN_AUDIT_LANDING_URL = "/agent-ready-repository-audit/"',
  "See audit deliverables",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-repository-audit.md",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=fix-plan-request.yml",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/sample-fix-plan-claude-code.md",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-fix-plan.md",
  "https://www.paypal.com/ncp/payment/H9VVRGRGA3DCG",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=instructions-pr-request.yml",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-instructions-pr.md",
  "https://github.com/wrightops-ai/bounty-red-flag-card/pull/1",
  "Agent-Ready Instructions PR",
  "Root AGENTS.md plus root CLAUDE.md or .github/copilot-instructions.md",
  "delivering exactly two repository-specific instruction files",
  "No application-code, CI, dependency, security, or deployment changes",
  "private, dedicated PayPal Goods",
  "the full purchase price is refunded",
  "https://github.com/wrightops-ai/bounty-red-flag-card",
  "https://github.com/wrightops-ai/bounty-red-flag-card/blob/main/bounty-red-flag-card/BOUNTY-RED-FLAG-CARD.md",
  "https://github.com/wrightops-ai/bounty-red-flag-card/releases/tag/v1.0.0",
  "https://github.com/wrightops-ai/bounty-red-flag-card/issues/new?template=bounty-review.yml",
  "https://github.com/wrightops-ai/bounty-red-flag-card/blob/main/docs/sample-bounty-go-no-go-review.md",
  "https://github.com/wrightops-ai/bounty-red-flag-card/blob/main/docs/bounty-go-no-go-review.md",
  "Bounty GO/NO-GO Review",
  "reviews exactly one public bounty or listing",
  "No guaranteed payout or professional advice",
  "GitHub sign-in is required to submit",
  "Three business days after settled payment and complete public inputs",
];

const requiredHtmlMarkers = [
  "<title>WrightOps | Free Agent-Ready Repository Preflight</title>",
  '<link rel="canonical" href="https://zachwright.xyz/"',
  'property="og:image" content="https://zachwright.xyz/og.png"',
  '"@type": "ProfessionalService"',
  '"name": "Free no-login repository preflight"',
  '"url": "https://zachwright.xyz/#preflight"',
  '"price": "149"',
  '"name": "Founding Agent-Ready Instructions PR"',
  '"price": "249"',
  '"name": "Human-reviewed Agent-Ready Repository Audit"',
  '"price": "750"',
  '"name": "Bounty Red-Flag Card"',
  '"name": "Bounty GO/NO-GO Review"',
  '"price": "49"',
];

const requiredAuditPageMarkers = [
  "<title>Agent-Ready Repository Audit | WrightOps</title>",
  'href="https://zachwright.xyz/agent-ready-repository-audit/"',
  '"@type": "Service"',
  '"price": "750"',
  "Know what your coding agents can",
  "provider-confirmed settled payment",
  "Markdown + JSON",
  "Up to 5 reviewed findings",
  "Three business days",
  "not a vulnerability, security, privacy, legal, or",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/sample-report-v1.md",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=human-audit-scope-request.yml",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-repository-audit.md",
];

const forbiddenMarkers = [
  "cal.com/",
  "linkedin.com/",
  "facebook.com/",
  'target="_blank"',
  "BrowserRouter",
  "Software Engineering Portfolio",
  "Daily Drop",
  "AI Operator Kit",
  "Repository Remediation Sprint",
  "$1,500",
];

function missing(source, markers) {
  return markers.filter((marker) => !source.includes(marker));
}

const failures = [];
const missingApp = missing(app, requiredAppMarkers);
const missingHtml = missing(html, requiredHtmlMarkers);
const missingAuditPage = missing(auditPage, requiredAuditPageMarkers);

if (missingApp.length) {
  failures.push(`App is missing: ${missingApp.join(", ")}`);
}

if (missingHtml.length) {
  failures.push(`HTML is missing: ${missingHtml.join(", ")}`);
}

if (missingAuditPage.length) {
  failures.push(`Audit page is missing: ${missingAuditPage.join(", ")}`);
}

for (const marker of forbiddenMarkers) {
  if (
    app.includes(marker) ||
    html.includes(marker) ||
    main.includes(marker) ||
    auditPage.includes(marker)
  ) {
    failures.push(`Forbidden legacy marker remains: ${marker}`);
  }
}

if (!css.includes("@media (prefers-reduced-motion: reduce)")) {
  failures.push("Reduced-motion CSS contract is missing.");
}

if (!css.includes("box-shadow: 0 0 0 6px var(--midnight)")) {
  failures.push("Two-color keyboard focus contract is missing.");
}

if (!auditCss.includes("@media (prefers-reduced-motion: reduce)")) {
  failures.push("Audit page reduced-motion contract is missing.");
}

if (!auditCss.includes("box-shadow: 0 0 0 6px var(--midnight)")) {
  failures.push("Audit page two-color keyboard focus contract is missing.");
}

const auditLandingUrl = "https://zachwright.xyz/agent-ready-repository-audit/";
if (!sitemap.includes(auditLandingUrl)) {
  failures.push("Sitemap is missing the audit landing page.");
}

if (!llms.includes(auditLandingUrl)) {
  failures.push("llms.txt is missing the audit landing page.");
}

if (app.includes("mailto:${CONTACT_EMAIL}?subject=Agent-Ready%20Repository%20Audit")) {
  failures.push("The $750 audit must use the structured public scope form, not email.");
}

const auditCtaCount = (app.match(/href=\{AUDIT_REQUEST_URL\}/g) || []).length;
if (auditCtaCount < 3) {
  failures.push(`Expected at least three full-audit fallbacks; found ${auditCtaCount}.`);
}

const preflightCtaCount = (app.match(/href="#preflight"/g) || []).length;
if (preflightCtaCount < 3) {
  failures.push(`Expected at least three no-login preflight CTAs; found ${preflightCtaCount}.`);
}

for (const file of [
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "og.png",
  "agent-ready-repository-audit/index.html",
  "agent-ready-repository-audit/styles.css",
]) {
  if (!fs.existsSync(path.join(root, "public", file))) {
    failures.push(`Public asset is missing: ${file}`);
  }
}

const socialImagePath = path.join(root, "public", "og.png");
if (fs.existsSync(socialImagePath)) {
  const png = fs.readFileSync(socialImagePath);
  const signature = png.subarray(1, 4).toString("ascii");
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);

  if (signature !== "PNG" || width !== 1200 || height !== 630) {
    failures.push(
      `Social image must be a 1200x630 PNG; found ${width}x${height} ${signature}.`,
    );
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      appMarkers: requiredAppMarkers.length,
      htmlMarkers: requiredHtmlMarkers.length,
      auditPageMarkers: requiredAuditPageMarkers.length,
      forbiddenMarkers: forbiddenMarkers.length,
      auditCtas: auditCtaCount,
      preflightCtas: preflightCtaCount,
      publicAssets: 6,
    },
    null,
    2,
  ),
);
