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
const instructionsPage = fs.readFileSync(
  path.join(root, "public", "agent-ready-instructions-pr", "index.html"),
  "utf8",
);
const instructionsGuidePath = path.join(
  root,
  "public",
  "agents-md-vs-claude-md",
  "index.html",
);
const instructionsGuidePage = fs.existsSync(instructionsGuidePath)
  ? fs.readFileSync(instructionsGuidePath, "utf8")
  : "";
const fixPlanPage = fs.readFileSync(
  path.join(root, "public", "agent-ready-fix-plan", "index.html"),
  "utf8",
);
const bountyReviewPage = fs.readFileSync(
  path.join(root, "public", "bounty-go-no-go-review", "index.html"),
  "utf8",
);
const costPage = fs.readFileSync(
  path.join(root, "public", "ai-agent-cost-reliability-snapshot", "index.html"),
  "utf8",
);
const costCss = fs.readFileSync(
  path.join(root, "public", "ai-agent-cost-reliability-snapshot", "styles.css"),
  "utf8",
);
const costSample = fs.readFileSync(
  path.join(root, "public", "ai-agent-cost-reliability-snapshot", "synthetic-sample.md"),
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
  "primaryHref: HUMAN_AUDIT_LANDING_URL",
  "See the $750 scope & proof",
  "Review service terms",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-repository-audit.md",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=fix-plan-request.yml",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/sample-fix-plan-claude-code.md",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-fix-plan.md",
  'const FIX_PLAN_LANDING_URL = "/agent-ready-fix-plan/"',
  "See the $149 scope & sample",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=instructions-pr-request.yml",
  'const INSTRUCTIONS_PR_LANDING_URL = "/agent-ready-instructions-pr/"',
  "<SecondaryAction href={INSTRUCTIONS_PR_LANDING_URL}>",
  "See the $249 scope & proof",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-instructions-pr.md",
  "AI Agent Cost & Reliability Snapshot",
  'const COST_SNAPSHOT_LANDING_URL =\n  "/ai-agent-cost-reliability-snapshot/"',
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=cost-reliability-snapshot-request.yml",
  "One workflow, up to 50 normalized attempts",
  "Three business days after settled payment and accepted prompt-free inputs",
  "https://github.com/wrightops-ai/bounty-red-flag-card/pull/1",
  'href="/agents-md-vs-claude-md/"',
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
  'const BOUNTY_REVIEW_LANDING_URL = "/bounty-go-no-go-review/"',
  "See the $49 scope &amp; sample",
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
  '"url": "https://zachwright.xyz/agent-ready-fix-plan/"',
  '"name": "Founding Agent-Ready Instructions PR"',
  '"price": "249"',
  '"url": "https://zachwright.xyz/agent-ready-instructions-pr/"',
  '"name": "Human-reviewed Agent-Ready Repository Audit"',
  '"price": "750"',
  '"url": "https://zachwright.xyz/agent-ready-repository-audit/"',
  '"name": "AI Agent Cost & Reliability Snapshot"',
  '"price": "495"',
  '"url": "https://zachwright.xyz/ai-agent-cost-reliability-snapshot/"',
  '"name": "Bounty Red-Flag Card"',
  '"name": "Bounty GO/NO-GO Review"',
  '"price": "49"',
  '"url": "https://zachwright.xyz/bounty-go-no-go-review/"',
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
  "mailto:zach@zachwright.xyz?subject=WrightOps%20%24750%20repository%20audit%20scope%20request",
  "Email scope without GitHub",
  "Do I need a GitHub account to request scope?",
  "non-binding scope request",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-repository-audit.md",
];

const requiredCostPageMarkers = [
  "<title>AI Agent Cost & Reliability Snapshot | WrightOps</title>",
  'href="https://zachwright.xyz/ai-agent-cost-reliability-snapshot/"',
  '"@type": "Service"',
  '"price": "495"',
  "Know what your agents cost",
  "Prompt-free",
  "83.33",
  "27.27",
  "2ec0de17",
  "$495 USD",
  "Three business days",
  "provider-confirmed settled payment",
  "not a customer or claimed business result",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=cost-reliability-snapshot-request.yml",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/ai-agent-cost-reliability-snapshot.md",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/ai-agent-cost-reliability-run-contract.md",
  "Savings, reliability, revenue, or profit guarantees",
];

const requiredInstructionsPageMarkers = [
  "<title>Agent-Ready Instructions PR | WrightOps</title>",
  'href="https://zachwright.xyz/agent-ready-instructions-pr/"',
  '"@type": "Service"',
  '"price": "249"',
  "Give coding agents consistent repository",
  "Exactly two repository-specific",
  "One business day",
  "provider-confirmed settled payment",
  "Files changed",
  "2<span>/2</span>",
  "No invented commands. No implied access.",
  "does not clone, install, build, test, or execute",
  "No source, CI, test, dependency, or config changes",
  "No merge, adoption, savings, or outcome guarantee",
  "one revision round within seven days",
  "<h3>Open a non-binding scope request</h3>",
  "<h3>Receive written scope</h3>",
  "After confirmation, email",
  "Use the public GitHub form or business email.",
  "Never include contact or payment",
  "personal or customer data",
  "mailto:zach@zachwright.xyz?subject=Agent-Ready%20Instructions%20PR%20scope%20confirmed",
  "private, buyer-specific PayPal Goods &amp; Services checkout",
  "If WrightOps cannot deliver the confirmed scope",
  "full refund of every dollar paid through the original payment rail",
  "Public demand, not testimonials",
  "Four repositories asked for better agent instructions.",
  "not customers, paid engagements,",
  "testimonials, or endorsements",
  "StoneCypher/jssm",
  "80/100",
  "https://github.com/StoneCypher/fsl/issues/1491#issuecomment-5012788530",
  "p2well/dotfiles",
  "20/100",
  "https://github.com/p2well/dotfiles/issues/12#issuecomment-5012991019",
  "frankxai/creator-intelligence-system",
  "35/100",
  "https://github.com/frankxai/creator-intelligence-system/issues/2#issuecomment-5013067732",
  "Zugruul/development-skills",
  "30/100",
  "https://github.com/Zugruul/development-skills/issues/178#issuecomment-5013145223",
  "https://github.com/wrightops-ai/bounty-red-flag-card/pull/1",
  'href="/agents-md-vs-claude-md/"',
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=instructions-pr-request.yml",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-instructions-pr.md",
];

const requiredInstructionsGuideMarkers = [
  "<title>AGENTS.md vs CLAUDE.md vs Copilot Instructions | WrightOps</title>",
  'href="https://zachwright.xyz/agents-md-vs-claude-md/"',
  '"@type": "TechArticle"',
  '"datePublished": "2026-07-19"',
  "AGENTS.md vs CLAUDE.md vs Copilot instructions",
  "Put each agent rule in the file that can actually <em>reach it.</em>",
  "Shared repository truth belongs in AGENTS.md.",
  "Companion files adapt. They do not fork.",
  "Root AGENTS.md",
  "Root CLAUDE.md",
  ".github/copilot-instructions.md",
  "Never put secrets, private infrastructure, or undocumented commands",
  "WrightOps does not clone or execute the target repository",
  "not a security, legal, privacy, or compliance assessment",
  "Run the free repository preflight",
  "See the $249 scope &amp; proof",
  "AI-operated public-repository engineering with a human-accountable owner",
  'href="/agent-ready-instructions-pr/"',
  'href="/#preflight"',
];

const requiredFixPlanPageMarkers = [
  "<title>Agent-Ready Repo Fix Plan | WrightOps</title>",
  'href="https://zachwright.xyz/agent-ready-fix-plan/"',
  '"@type": "Service"',
  '"price": "149"',
  "Turn one audit into three executable",
  "Exactly three human-reviewed fix cards",
  "One business day",
  "provider-confirmed settled payment",
  "at most 45 minutes of human review",
  "Demonstration only — not paid, commissioned, or endorsed",
  "evidenced gap",
  "exact file or path",
  "Bounded change outline",
  "acceptance check",
  "No implementation or repository changes",
  "not a vulnerability, security, privacy, legal, or compliance",
  "Use the public GitHub form or business email.",
  "Never include contact, private, payment, or transaction data",
  "does not create a contract or payment obligation",
  "scope before payment",
  "full purchase-price refund",
  "WrightOps absorbs that cost",
  "Start the free audit",
  "Already audited? Request $149 scope",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=audit-request.yml",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=fix-plan-request.yml",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/sample-fix-plan-claude-code.md",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-fix-plan.md",
];

const requiredBountyReviewPageMarkers = [
  "<title>Bounty GO/NO-GO Review | WrightOps</title>",
  'href="https://zachwright.xyz/bounty-go-no-go-review/"',
  '"@type": "Service"',
  '"price": "49"',
  "Know if one bounty is worth the",
  "Exactly one public bounty or listing",
  "One business day",
  "provider-confirmed settled payment",
  "Funding and payout evidence",
  "Claim window, eligibility, and competition",
  "Acceptance, access, and third-party dependencies",
  "Rights, compliance, and required approvals",
  "Bounded work estimate",
  "GO, HOLD, or NO-GO",
  "Synthetic example — not a customer result",
  "$300.00 × (1 - 0.10) = $270.00",
  "Missing evidence stays unknown",
  "No claim, reservation, implementation, or maintainer contact",
  "No repository clone or code execution",
  "No legal, tax, financial, security, privacy, or compliance advice",
  "No eligibility, acceptance, merge, payment, profit, or outcome guarantee",
  "Use the public GitHub form or business email.",
  "Never include personal, private, credential, customer, wallet, or payment data",
  "does not create a contract or payment obligation",
  "Scope before payment",
  "full purchase price",
  "WrightOps absorbs any retained processor fee",
  "https://github.com/wrightops-ai/bounty-red-flag-card/issues/new?template=bounty-review.yml",
  "https://wrightops-ai.github.io/bounty-red-flag-card/",
  "Run the free no-login check",
  "https://github.com/wrightops-ai/bounty-red-flag-card/blob/main/docs/sample-bounty-go-no-go-review.md",
  "https://github.com/wrightops-ai/bounty-red-flag-card/blob/main/docs/bounty-go-no-go-review.md",
];

const requiredCostSampleMarkers = [
  "This complete sample uses seven synthetic, prompt-free attempts",
  "not a customer result, savings claim, revenue claim, or forecast",
  "2ec0de17fbedc36b98862fd41ce57011feab2933142ab3e1d07fbd6a9b023259",
  "Task completion rate | 83.33%",
  "Failed-run waste share | 27.27%",
  "Scenario only; not a forecast, guarantee, revenue figure, or profit",
  "Missing evidence is never treated as zero",
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
  "https://www.paypal.com/ncp/payment/H9VVRGRGA3DCG",
];

function missing(source, markers) {
  return markers.filter((marker) => !source.includes(marker));
}

const failures = [];
const missingApp = missing(app, requiredAppMarkers);
const missingHtml = missing(html, requiredHtmlMarkers);
const missingAuditPage = missing(auditPage, requiredAuditPageMarkers);
const missingInstructionsPage = missing(instructionsPage, requiredInstructionsPageMarkers);
const missingInstructionsGuidePage = missing(
  instructionsGuidePage,
  requiredInstructionsGuideMarkers,
);
const missingFixPlanPage = missing(fixPlanPage, requiredFixPlanPageMarkers);
const missingBountyReviewPage = missing(
  bountyReviewPage,
  requiredBountyReviewPageMarkers,
);
const missingCostPage = missing(costPage, requiredCostPageMarkers);
const missingCostSample = missing(costSample, requiredCostSampleMarkers);

if (missingApp.length) {
  failures.push(`App is missing: ${missingApp.join(", ")}`);
}

if (missingHtml.length) {
  failures.push(`HTML is missing: ${missingHtml.join(", ")}`);
}

if (missingAuditPage.length) {
  failures.push(`Audit page is missing: ${missingAuditPage.join(", ")}`);
}

if (missingInstructionsPage.length) {
  failures.push(`Instructions page is missing: ${missingInstructionsPage.join(", ")}`);
}

if (missingInstructionsGuidePage.length) {
  failures.push(
    `Instructions guide is missing: ${missingInstructionsGuidePage.join(", ")}`,
  );
}

if (missingFixPlanPage.length) {
  failures.push(`Fix Plan page is missing: ${missingFixPlanPage.join(", ")}`);
}

if (missingBountyReviewPage.length) {
  failures.push(
    `Bounty review page is missing: ${missingBountyReviewPage.join(", ")}`,
  );
}

if (missingCostPage.length) {
  failures.push(`Cost page is missing: ${missingCostPage.join(", ")}`);
}

if (missingCostSample.length) {
  failures.push(`Cost sample is missing: ${missingCostSample.join(", ")}`);
}

for (const marker of forbiddenMarkers) {
  if (
    app.includes(marker) ||
    html.includes(marker) ||
    main.includes(marker) ||
    auditPage.includes(marker) ||
    instructionsPage.includes(marker) ||
    instructionsGuidePage.includes(marker) ||
    fixPlanPage.includes(marker) ||
    bountyReviewPage.includes(marker) ||
    costPage.includes(marker) ||
    costSample.includes(marker)
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

if (!costCss.includes("@media (prefers-reduced-motion: reduce)")) {
  failures.push("Cost page reduced-motion contract is missing.");
}

if (!costCss.includes("box-shadow: 0 0 0 6px var(--midnight)")) {
  failures.push("Cost page two-color keyboard focus contract is missing.");
}

const auditLandingUrl = "https://zachwright.xyz/agent-ready-repository-audit/";
if (!sitemap.includes(auditLandingUrl)) {
  failures.push("Sitemap is missing the audit landing page.");
}

const instructionsLandingUrl = "https://zachwright.xyz/agent-ready-instructions-pr/";
if (!sitemap.includes(instructionsLandingUrl)) {
  failures.push("Sitemap is missing the instructions PR landing page.");
}

if (!llms.includes(instructionsLandingUrl)) {
  failures.push("llms.txt is missing the instructions PR landing page.");
}

const instructionsGuideUrl = "https://zachwright.xyz/agents-md-vs-claude-md/";
if (!sitemap.includes(instructionsGuideUrl)) {
  failures.push("Sitemap is missing the AGENTS.md comparison guide.");
}

if (!llms.includes(instructionsGuideUrl)) {
  failures.push("llms.txt is missing the AGENTS.md comparison guide.");
}

if (!llms.includes(auditLandingUrl)) {
  failures.push("llms.txt is missing the audit landing page.");
}

const fixPlanLandingUrl = "https://zachwright.xyz/agent-ready-fix-plan/";
if (!sitemap.includes(fixPlanLandingUrl)) {
  failures.push("Sitemap is missing the Fix Plan landing page.");
}

if (!llms.includes(fixPlanLandingUrl)) {
  failures.push("llms.txt is missing the Fix Plan landing page.");
}

const costLandingUrl = "https://zachwright.xyz/ai-agent-cost-reliability-snapshot/";
if (!sitemap.includes(costLandingUrl)) {
  failures.push("Sitemap is missing the cost and reliability landing page.");
}

if (!llms.includes(costLandingUrl)) {
  failures.push("llms.txt is missing the cost and reliability landing page.");
}

const bountyReviewLandingUrl = "https://zachwright.xyz/bounty-go-no-go-review/";
if (!sitemap.includes(bountyReviewLandingUrl)) {
  failures.push("Sitemap is missing the bounty review landing page.");
}

if (!llms.includes(bountyReviewLandingUrl)) {
  failures.push("llms.txt is missing the bounty review landing page.");
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

const fixPlanAuditCtaCount = (
  fixPlanPage.match(/issues\/new\?template=audit-request\.yml/g) || []
).length;
if (fixPlanAuditCtaCount < 4) {
  failures.push(
    `Expected the Fix Plan offer to expose at least four free-audit starts; found ${fixPlanAuditCtaCount}.`,
  );
}

const fixPlanScopeCtaCount = (
  fixPlanPage.match(/issues\/new\?template=fix-plan-request\.yml/g) || []
).length;
if (fixPlanScopeCtaCount < 3) {
  failures.push(
    `Expected the Fix Plan offer to preserve at least three audited-buyer scope paths; found ${fixPlanScopeCtaCount}.`,
  );
}

const auditEmailScopeCtaCount = (
  auditPage.match(/mailto:zach@zachwright\.xyz\?subject=WrightOps%20%24750%20repository%20audit%20scope%20request/g) || []
).length;
if (auditEmailScopeCtaCount < 2) {
  failures.push(
    `Expected the $750 audit to expose at least two no-GitHub business-email scope paths; found ${auditEmailScopeCtaCount}.`,
  );
}

const fixPlanEmailScopeCtaCount = (
  fixPlanPage.match(/mailto:zach@zachwright\.xyz\?subject=WrightOps%20%24149%20fix%20plan%20scope%20request/g) || []
).length;
if (fixPlanEmailScopeCtaCount < 2) {
  failures.push(
    `Expected the $149 Fix Plan to expose at least two no-GitHub business-email scope paths; found ${fixPlanEmailScopeCtaCount}.`,
  );
}

const instructionsEmailScopeCtaCount = (
  instructionsPage.match(/mailto:zach@zachwright\.xyz\?subject=WrightOps%20%24249%20instructions%20PR%20scope%20request/g) || []
).length;
if (instructionsEmailScopeCtaCount < 2) {
  failures.push(
    `Expected the $249 Instructions PR to expose at least two no-GitHub business-email scope paths; found ${instructionsEmailScopeCtaCount}.`,
  );
}

const costEmailScopeCtaCount = (
  costPage.match(/mailto:zach@zachwright\.xyz\?subject=WrightOps%20%24495%20cost%20reliability%20scope%20request/g) || []
).length;
if (costEmailScopeCtaCount < 2) {
  failures.push(
    `Expected the $495 Cost & Reliability Snapshot to expose at least two no-GitHub business-email scope paths; found ${costEmailScopeCtaCount}.`,
  );
}

const bountyEmailScopeCtaCount = (
  bountyReviewPage.match(/mailto:zach@zachwright\.xyz\?subject=WrightOps%20%2449%20bounty%20review%20scope%20request/g) || []
).length;
if (bountyEmailScopeCtaCount < 2) {
  failures.push(
    `Expected the $49 Bounty Review to expose at least two no-GitHub business-email scope paths; found ${bountyEmailScopeCtaCount}.`,
  );
}

const bountyFreeToolCtaCount = (
  bountyReviewPage.match(/https:\/\/wrightops-ai\.github\.io\/bounty-red-flag-card\//g) || []
).length;
if (bountyFreeToolCtaCount < 2) {
  failures.push(
    `Expected the bounty review offer to expose at least two no-login proof-tool paths; found ${bountyFreeToolCtaCount}.`,
  );
}

for (const file of [
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "og.png",
  "agent-ready-repository-audit/index.html",
  "agent-ready-repository-audit/styles.css",
  "agent-ready-instructions-pr/index.html",
  "agents-md-vs-claude-md/index.html",
  "agent-ready-fix-plan/index.html",
  "bounty-go-no-go-review/index.html",
  "ai-agent-cost-reliability-snapshot/index.html",
  "ai-agent-cost-reliability-snapshot/styles.css",
  "ai-agent-cost-reliability-snapshot/synthetic-sample.md",
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
      instructionsPageMarkers: requiredInstructionsPageMarkers.length,
      instructionsGuideMarkers: requiredInstructionsGuideMarkers.length,
      fixPlanPageMarkers: requiredFixPlanPageMarkers.length,
      bountyReviewPageMarkers: requiredBountyReviewPageMarkers.length,
      costPageMarkers: requiredCostPageMarkers.length,
      costSampleMarkers: requiredCostSampleMarkers.length,
      forbiddenMarkers: forbiddenMarkers.length,
      auditCtas: auditCtaCount,
      auditEmailScopeCtas: auditEmailScopeCtaCount,
      fixPlanEmailScopeCtas: fixPlanEmailScopeCtaCount,
      instructionsEmailScopeCtas: instructionsEmailScopeCtaCount,
      costEmailScopeCtas: costEmailScopeCtaCount,
      bountyEmailScopeCtas: bountyEmailScopeCtaCount,
      preflightCtas: preflightCtaCount,
      bountyFreeToolCtas: bountyFreeToolCtaCount,
      publicAssets: 13,
    },
    null,
    2,
  ),
);
