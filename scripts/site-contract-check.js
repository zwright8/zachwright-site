const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const vercelConfig = JSON.parse(
  fs.readFileSync(path.join(root, "vercel.json"), "utf8"),
);
const app = fs.readFileSync(path.join(root, "src", "App.tsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src", "index.css"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const main = fs.readFileSync(path.join(root, "src", "main.tsx"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "public", "sitemap.xml"), "utf8");
const llms = fs.readFileSync(path.join(root, "public", "llms.txt"), "utf8");
const paymentConfig = fs.readFileSync(
  path.join(root, "api", "payments", "config.js"),
  "utf8",
);
const auditPage = fs.readFileSync(
  path.join(root, "public", "agent-ready-repository-audit", "index.html"),
  "utf8",
);
const auditCss = fs.readFileSync(
  path.join(root, "public", "agent-ready-repository-audit", "styles.css"),
  "utf8",
);
const auditSamplePage = fs.readFileSync(
  path.join(
    root,
    "public",
    "agent-ready-repository-audit",
    "sample",
    "index.html",
  ),
  "utf8",
);
const auditSampleCss = fs.readFileSync(
  path.join(
    root,
    "public",
    "agent-ready-repository-audit",
    "sample",
    "styles.css",
  ),
  "utf8",
);
const instructionsPage = fs.readFileSync(
  path.join(root, "public", "agent-ready-instructions-pr", "index.html"),
  "utf8",
);
const singleFileCorrectionPage = fs.readFileSync(
  path.join(
    root,
    "public",
    "single-file-agent-instructions-correction",
    "index.html",
  ),
  "utf8",
);
const singleFileCorrectionSample = fs.readFileSync(
  path.join(
    root,
    "public",
    "single-file-agent-instructions-correction",
    "sample.md",
  ),
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
const instructionsGuideWorksheet = fs.readFileSync(
  path.join(
    root,
    "public",
    "agents-md-vs-claude-md",
    "worksheet.js",
  ),
  "utf8",
);
const storefrontGuidePage = fs.readFileSync(
  path.join(root, "public", "agent-ready-storefront-checklist", "index.html"),
  "utf8",
);
const instructionsStarterPage = fs.readFileSync(
  path.join(root, "public", "agents-md-starter-template", "index.html"),
  "utf8",
);
const instructionsStarterFile = fs.readFileSync(
  path.join(root, "public", "agents-md-starter-template", "AGENTS.md"),
  "utf8",
);
const instructionsStarterCss = fs.readFileSync(
  path.join(root, "public", "agents-md-starter-template", "styles.css"),
  "utf8",
);
const instructionsBuilderScript = fs.readFileSync(
  path.join(root, "public", "agents-md-starter-template", "builder.js"),
  "utf8",
);
const agentsSizeBudgetPage = fs.readFileSync(
  path.join(root, "public", "agents-md-size-budget-checker", "index.html"),
  "utf8",
);
const fixPlanPage = fs.readFileSync(
  path.join(root, "public", "agent-ready-fix-plan", "index.html"),
  "utf8",
);
const bountyReviewPage = fs.readFileSync(
  path.join(root, "public", "bounty-go-no-go-review", "index.html"),
  "utf8",
);
const bountyChecklistPage = fs.readFileSync(
  path.join(root, "public", "coding-bounty-payout-checklist", "index.html"),
  "utf8",
);
const costPage = fs.readFileSync(
  path.join(root, "public", "ai-agent-cost-reliability-snapshot", "index.html"),
  "utf8",
);
const costAttributionPage = fs.readFileSync(
  path.join(root, "public", "ai-agent-cost-attribution-checklist", "index.html"),
  "utf8",
);
const structuredOutputReliabilityPage = fs.readFileSync(
  path.join(
    root,
    "public",
    "ai-agent-structured-output-reliability-checklist",
    "index.html",
  ),
  "utf8",
);
const costCss = fs.readFileSync(
  path.join(root, "public", "ai-agent-cost-reliability-snapshot", "styles.css"),
  "utf8",
);
const costCalculator = fs.readFileSync(
  path.join(
    root,
    "public",
    "ai-agent-cost-reliability-snapshot",
    "calculator.js",
  ),
  "utf8",
);
const costSample = fs.readFileSync(
  path.join(root, "public", "ai-agent-cost-reliability-snapshot", "synthetic-sample.md"),
  "utf8",
);
const proposalPage = fs.readFileSync(
  path.join(root, "public", "received-proposal", "index.html"),
  "utf8",
);
const proposalLookup = fs.readFileSync(
  path.join(root, "public", "received-proposal", "lookup.js"),
  "utf8",
);
const proposalCss = fs.readFileSync(
  path.join(root, "public", "received-proposal", "styles.css"),
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
  "window.location.hash.slice(1)",
  "window.requestAnimationFrame",
  'target.scrollIntoView({ block: "start" })',
  "no account, clone, code execution, or WrightOps data storage",
  "Qualified implementation gap",
  "Build $249 scope",
  "Copy preflight evidence",
  "unauthenticated API limit applies",
  'reducedMotion="user"',
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=audit-request.yml",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=human-audit-scope-request.yml",
  'const HUMAN_AUDIT_LANDING_URL = "/agent-ready-repository-audit/"',
  "Confirm the $750 self-serve scope",
  "Read the fixed audit terms",
  "Confirm the $750 self-serve audit",
  'const HUMAN_AUDIT_TERMS_URL = "/agent-ready-repository-audit/#terms"',
  "function auditScopeEvidence(",
  "WrightOps $750 Agent-Ready Repository Audit — non-binding scope request",
  "Requester authority: I confirm that I am authorized to request this public-evidence review.",
  "No submission, storage, checkout, or payment occurred.",
  'id="audit-workflow"',
  "maxLength={500}",
  'id="audit-authority"',
  "disabled={!auditWorkflow.trim() || !auditAuthority}",
  "Copy $750 scope brief",
  "Open public request form",
  "Read complete terms",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/sample-fix-plan-claude-code.md",
  'const FIX_PLAN_TERMS_URL =\n  "/agent-ready-fix-plan/#terms"',
  'const FIX_PLAN_LANDING_URL = "/agent-ready-fix-plan/"',
  "Confirm the $149 fixed scope",
  'const INSTRUCTIONS_PR_LANDING_URL = "/agent-ready-instructions-pr/"',
  'const AGENTS_STARTER_URL = "/agents-md-starter-template/"',
  '<a className="hero-starter-link" href={AGENTS_STARTER_URL}>',
  "Copy the free AGENTS.md starter",
  'const AGENTS_SIZE_CHECKER_URL = "/agents-md-size-budget-checker/"',
  '<a className="hero-starter-link" href={AGENTS_SIZE_CHECKER_URL}>',
  "Check its browser-local size budget",
  '<a className="text-action" href={HUMAN_AUDIT_LANDING_URL}>',
  "Open the approved $750 self-serve audit",
  "Confirm the audit-gated $149 scope",
  "<SecondaryAction href={HUMAN_AUDIT_LANDING_URL}>",
  "See the $149 correction scope",
  "See the $249 foundation scope",
  "AI Agent Cost & Reliability Snapshot",
  'const COST_SNAPSHOT_LANDING_URL =\n  "/ai-agent-cost-reliability-snapshot/"',
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=cost-reliability-snapshot-request.yml",
  "One workflow, up to 50 normalized attempts",
  "Three business days after settled payment and accepted prompt-free inputs",
  "https://github.com/wrightops-ai/bounty-red-flag-card/pull/1",
  'href="/agents-md-vs-claude-md/"',
  "Single-File Agent Instructions Correction",
  "Agent Instructions Foundation",
  "skill/SKILL.md",
  "Replacement Markdown, unified diff, evidence notes, and acceptance checks",
  "No application-code, CI, dependency, security, or deployment changes",
  "private, buyer-specific PayPal Goods",
  "the full purchase price is refunded",
  "https://github.com/wrightops-ai/bounty-red-flag-card",
  "https://github.com/wrightops-ai/bounty-red-flag-card/blob/main/bounty-red-flag-card/BOUNTY-RED-FLAG-CARD.md",
  "https://github.com/wrightops-ai/bounty-red-flag-card/releases/tag/v1.0.0",
  'const BOUNTY_CHECKLIST_URL = "/coding-bounty-payout-checklist/"',
  'const PROPOSAL_VERIFICATION_URL = "/received-proposal/"',
  "Proposal lookup",
  "Verify a WrightOps proposal",
  "Run the free payout checklist",
  "Paid review retired",
  "The former $49 review produced no qualified requests or settled",
  "No purchase path or payment obligation",
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
  '"name": "Single-File Agent Instructions Correction"',
  '"price": "149"',
  '"name": "Two-file Agent Instructions Foundation"',
  '"price": "249"',
  '"url": "https://zachwright.xyz/agent-ready-instructions-pr/"',
  '"name": "Free AGENTS.md starter template"',
  '"url": "https://zachwright.xyz/agents-md-starter-template/"',
  '"name": "Human-reviewed Agent-Ready Repository Audit"',
  '"price": "750"',
  '"url": "https://zachwright.xyz/agent-ready-repository-audit/"',
  '"name": "AI Agent Cost & Reliability Snapshot"',
  '"price": "495"',
  '"url": "https://zachwright.xyz/ai-agent-cost-reliability-snapshot/"',
  '"name": "Bounty Red-Flag Card"',
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
  'id="terms"',
  "Fixed self-serve terms",
  "A GitHub or business-email request remains non-binding",
  "mailto:zach@zachwright.xyz?subject=WrightOps%20%24750%20repository%20audit%20scope%20request",
  "Email scope without GitHub",
  'href="/#preflight"',
  "Run the free preflight first",
  "Self-serve written scope",
  "No GitHub sign-in or pre-sale email",
  "Confirm in your browser. Copy the reference. Check out.",
  "GitHub account or pre-sale email is required.",
  "Copy reference and enable checkout",
  "no pre-sale email is required",
  'id="scope-builder"',
  'id="repository-audit-scope-builder"',
  "Confirm $750 fixed scope",
  "scope_version=repository-audit-v2",
  "loadScopePrefill",
  'new URLSearchParams(window.location.search)',
  "Checkout remains unavailable.",
  'data-checkout-url="https://www.paypal.com/ncp/payment/5WFCZBVANJLGA"',
  "AGENTS.md / CLAUDE.md drift",
  "Missing verification evidence",
  "Unclear risky-action boundaries",
  "let scopeRevision = 0",
  "const confirmationRevision = scopeRevision",
  "confirmationRevision !== scopeRevision",
  "const copyRevision = scopeRevision",
  "copyRevision !== scopeRevision",
  "Request scope on GitHub",
  'href="/agent-ready-storefront-checklist/"',
  "Use the storefront evidence checklist",
  'href="/received-proposal/"',
  "Received this proposal? Verify it",
  'href="/agent-ready-repository-audit/sample/"',
  "Inspect the human-reviewed sample",
];

const requiredAuditSampleMarkers = [
  "<title>Human-Reviewed Repository Audit Sample | WrightOps</title>",
  'href="https://zachwright.xyz/agent-ready-repository-audit/sample/"',
  '"@type": "Article"',
  '"datePublished": "2026-07-25"',
  "not a customer",
  "7a507bc0cb42f8c04fb18e53a46371b37b5bd56f",
  "90/100 evidence coverage",
  "State the runtime-configuration boundary in the root README.",
  "Keep instruction and verification evidence linked",
  "Treat the score as evidence coverage",
  "Acceptance evidence:",
  "30-minute handoff agenda",
  "Inspection limits",
  "does not clone or execute repository code",
  "vulnerability, security,",
  'href="../#scope-builder"',
  "Confirm $750 scope",
  'href="/#preflight"',
  "Run the free preflight first",
];

const forbiddenAuditSampleMarkers = [
  "customer testimonial",
  "guaranteed outcome",
  "guaranteed savings",
  "guaranteed revenue",
  "buy.stripe.com",
  "fetch(",
  "XMLHttpRequest",
  "navigator.sendBeacon",
  "localStorage",
  "sessionStorage",
  "document.cookie",
];

const requiredCostPageMarkers = [
  "<title>AI Agent Cost & Reliability Snapshot | WrightOps</title>",
  'href="https://zachwright.xyz/ai-agent-cost-reliability-snapshot/"',
  '"@type": "Service"',
  '"price": "495"',
  "Know what your agents cost",
  "Prompt-free",
  "Hard timeouts &amp; dropped replies",
  "Retry &amp; first-pass uncertainty",
  "Parent-child trace &amp; cost gaps",
  "83.33",
  "27.27",
  "2ec0de17",
  "$495 USD",
  "Three business days",
  "provider-confirmed settled payment",
  "not a customer or claimed business result",
  "accepted v2 evidence supplies pseudonymous parent links",
  "Missing lineage is never reconstructed or guessed.",
  "Optional v2 pseudonymous parent-run links",
  "Reconstruction of missing parent-child lineage",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=cost-reliability-snapshot-request.yml",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/ai-agent-cost-reliability-snapshot.md",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/ai-agent-cost-reliability-run-contract.md",
  "Savings, reliability, revenue, or profit guarantees",
  "mailto:zach@zachwright.xyz?subject=WrightOps%20%24495%20cost%20reliability%20scope%20request",
  "Email scope without GitHub",
  'id="calculator"',
  'id="cost-estimator"',
  "Put a monthly range around retry and failure cost.",
  "Calculator inputs are not submitted, stored, or",
  "transmitted by this tool.",
  "The two cost signals can overlap, so they are never added together.",
  'id="weekly-starts"',
  'id="attempt-cost"',
  'id="average-attempts"',
  'id="failure-rate"',
  'id="monthly-spend"',
  'id="retry-overhead"',
  'id="failed-task-spend"',
  'id="fee-equivalent"',
  "Turn the estimate into evidence",
  'id="reconcile"',
  'id="cost-reconciliation"',
  "Measure the gap before choosing a cost source.",
  "values stay in this browser and are never submitted, stored, or",
  "https://github.com/nikhilsoman/synlynk/issues/510",
  "not a WrightOps customer, lead, endorsement, paid",
  'id="cost-path-a"',
  'id="cost-path-b"',
  'id="reconciliation-runs"',
  'id="reconciliation-threshold"',
  'id="reconciliation-gap"',
  'id="reconciliation-multiple"',
  'id="reconciliation-monthly"',
  'id="reconciliation-status"',
  "A mismatch is a control signal.",
  "Reconcile one workflow",
  'id="hosted-loop-economics"',
  "Separate loop cost from missing local evidence.",
  "not a WrightOps customer, paid engagement, verified billing",
  "local or billing evidence unknown",
  "https://github.com/momentiq-ai/cerebe/issues/58",
  "mailto:zach@zachwright.xyz?subject=WrightOps%20%24495%20hosted-loop%20scope%20request",
  "non-binding%20scope%20request",
  "Request one hosted-loop decision map",
  '<script src="./calculator.js" defer></script>',
  'href="/received-proposal/"',
  "Received this proposal? Verify it",
];

const requiredCostCalculatorMarkers = [
  "weeklyStarts * 4.33",
  "Math.max(averageAttempts - 1, 0)",
  "monthlyStarts * failureRate * averageAttempts * attemptCost",
  "Math.max(retryOverhead, failedTaskSpend)",
  "Retry and failed-task figures may overlap and are not combined.",
  "A paid snapshot is unlikely to fit this decision.",
  'outputs.feeEquivalent.textContent = "Complete inputs"',
  "Enter four values within the displayed limits",
  "Math.abs(pathA - pathB)",
  "const monthlyGap = gap * runs",
  "larger / smaller",
  "Above by",
  "Below by",
  "The mismatch is a control signal",
  "does not prove which path matches an invoice or prove savings",
];

const forbiddenCostCalculatorMarkers = [
  "fetch(",
  "XMLHttpRequest",
  "navigator.sendBeacon",
  "localStorage",
  "sessionStorage",
  "document.cookie",
];

const requiredCostAttributionPageMarkers = [
  "<title>AI Agent Cost Attribution Checklist | WrightOps</title>",
  'href="https://zachwright.xyz/ai-agent-cost-attribution-checklist/"',
  '"@type": "TechArticle"',
  '"datePublished": "2026-07-24"',
  "Attribute agent cost before you try to <em>cap it.</em>",
  "Every cost needs an owner and an outcome.",
  "Minimum normalized ledger",
  "workflow_key",
  "parent_attempt_key",
  "billing_basis",
  "subscription-covered usage",
  "Missing is null, not zero.",
  "Stable metering contract",
  "Document what emitters guarantee before dashboards depend on it.",
  "schema_version",
  "record_kind",
  "pipeline_key",
  "ISO 4217 currency",
  "RFC 3339 UTC",
  "Cycle totals sum conforming stage records once",
  "unsupported major versions",
  "consumer-field audit",
  "Teams are asking for attribution before enforcement.",
  "not WrightOps",
  "https://github.com/Poetic-Poems/agent-ops/issues/81",
  "https://github.com/dimagi/open-chat-studio/issues/3906",
  "https://github.com/lightdash/lightdash/issues/26121",
  "https://github.com/paperclipai/paperclip/issues/498",
  "https://github.com/sipyourdrink-ltd/bernstein/issues/2918",
  "A cost ledger supports decisions. It does not prove causality.",
  "provider-confirmed settled payment",
  'href="/ai-agent-cost-reliability-snapshot/"',
];

const forbiddenCostAttributionPageMarkers = [
  "<form",
  "fetch(",
  "XMLHttpRequest",
  "navigator.sendBeacon",
  "localStorage",
  "sessionStorage",
  "document.cookie",
  "paypal.com",
  "mailto:",
];

const requiredStructuredOutputReliabilityPageMarkers = [
  "<title>AI Agent Structured-Output Reliability Checklist | WrightOps</title>",
  'href="https://zachwright.xyz/ai-agent-structured-output-reliability-checklist/"',
  '"@type": "TechArticle"',
  '"datePublished": "2026-07-24"',
  "Make the agent outcome machine-readable—or mark it <em>unknown.</em>",
  "Reliability begins at the output boundary.",
  "Minimum result contract",
  "schema_version",
  "termination_reason",
  "validation_state",
  "completed, failed, refused, cancelled, timed_out, max_turns, invalid_output, and unknown",
  "Keep JSON stdout clean",
  "Unknown is not completed.",
  "Missing is null, not zero.",
  "Teams are asking for machine-readable outcomes.",
  "not WrightOps",
  "https://github.com/langchain-ai/deepagents/issues/4612",
  "https://github.com/Extra-Chill/homeboy/issues/9653",
  "A valid envelope supports measurement. It does not prove correctness.",
  "provider-confirmed settled payment",
  'href="/ai-agent-cost-reliability-snapshot/"',
];

const forbiddenStructuredOutputReliabilityPageMarkers = [
  "<form",
  "fetch(",
  "XMLHttpRequest",
  "navigator.sendBeacon",
  "localStorage",
  "sessionStorage",
  "document.cookie",
  "paypal.com",
  "mailto:",
];

const requiredInstructionsPageMarkers = [
  "<title>Agent Instructions Correction | WrightOps</title>",
  'href="https://zachwright.xyz/agent-ready-instructions-pr/"',
  '"@type": "Service"',
  '"name": "Single-File Agent Instructions Correction"',
  '"price": "149"',
  '"name": "Two-File Agent Instructions Foundation"',
  '"price": "249"',
  "Give coding agents consistent repository",
  "$149 one file · $249 two files",
  "1 business day",
  "provider-confirmed settlement",
  "Available tiers",
  "1<span>/2 files</span>",
  "replacement Markdown and a unified diff",
  "No invented commands. No implied access.",
  "does not clone, install, build, test, or execute",
  "No source, CI, test, dependency, or config changes",
  "No branch, pull request, merge, adoption, or outcome guarantee",
  "factual correction round requested within",
  "maximum 250 source lines",
  "75 total labor minutes",
  "<h3>Open a non-binding scope request</h3>",
  "<h3>Receive written scope</h3>",
  "private, buyer-specific PayPal Goods &amp; Services checkout",
  "Use the browser-local builder",
  "Never include payment details",
  "personal or customer data",
  "If WrightOps cannot deliver the confirmed scope",
  "every dollar paid is refunded through the",
  "any retained seller fee is WrightOps'",
  "Public demand, not testimonials",
  "Four repositories exposed instruction-file drift.",
  "not customers, paid engagements,",
  "testimonials, endorsements, or evidence of willingness to pay",
  "p2well/dotfiles",
  "20/100",
  "https://github.com/p2well/dotfiles/issues/12#issuecomment-5012991019",
  "frankxai/creator-intelligence-system",
  "35/100",
  "https://github.com/frankxai/creator-intelligence-system/issues/2#issuecomment-5013067732",
  "Zugruul/development-skills",
  "30/100",
  "https://github.com/Zugruul/development-skills/issues/178#issuecomment-5013145223",
  "DYB-Development/event_engine",
  "https://github.com/DYB-Development/event_engine/issues/235",
  "1 file",
  "https://github.com/wrightops-ai/bounty-red-flag-card/pull/1",
  'href="/agents-md-vs-claude-md/"',
  'id="scope-builder"',
  'id="instructions-scope-builder"',
  'name="repository"',
  'name="revision"',
  'name="tier"',
  'name="target-file"',
  'name="workflow"',
  'name="authority"',
  "Build a non-binding scope request",
  "Open prefilled business email",
  "Copy scope request",
  "Nothing is uploaded or stored",
  'role="group"',
  'id="open-scope-email"',
  "URL shape is checked locally",
  "WrightOps verifies public access after receipt",
  "new URLSearchParams(window.location.search)",
  "navigator.clipboard.writeText(scopeText)",
  "window.location.href = buildMailto(scopeText)",
  'query.get("tier") === "single-file"',
  'tierInput.value = "$149 single-file correction"',
  '<option value="skill/SKILL.md">skill/SKILL.md</option>',
  "The SKILL.md path is eligible only for the $149 tier.",
  'href="/received-proposal/"',
  "Received this proposal? Verify it",
];

const requiredSingleFileCorrectionPageMarkers = [
  "<title>Single-File Agent Instructions Correction | WrightOps</title>",
  'href="https://zachwright.xyz/single-file-agent-instructions-correction/"',
  '"@type": "Service"',
  '"name": "Single-File Agent Instructions Correction"',
  '"price": "149"',
  "Correct one agent-guidance Markdown file",
  "$149 fixed scope",
  "1 existing instruction or template file",
  '<option value="skill/SKILL.md">skill/SKILL.md</option>',
  '<option value="agent-workflow Markdown template">',
  "Agent-workflow Markdown template",
  "one existing instructions or",
  "agent-workflow template file, its exact path",
  "1 business day",
  "Complete replacement Markdown",
  "Ready-to-apply unified diff",
  "Evidence and acceptance checks",
  "maximum <code>250 source lines</code>",
  "75 total WrightOps labor minutes",
  "provider-confirmed settled payment",
  "private, buyer-specific PayPal Goods &amp; Services checkout",
  "No public checkout or payment",
  "No branch, pull request, comment",
  "No repository code execution or security work",
  "Product guidance mixed with development notes",
  "durable repository guidance",
  "owner-specific diary entries",
  "One template from a multi-file issue",
  "additional files require separate written scope",
  "Public fit signal · not a customer result",
  "https://github.com/RockyHong/super-bootstrap/issues/27",
  "public problem example only—not a",
  "purchase signal",
  "every dollar paid is refunded through the original payment rail",
  'id="single-file-scope-builder"',
  'id="single-file-scope-builder-heading"',
  'name="repository"',
  'name="revision"',
  'name="target-file"',
  'name="target-path"',
  'name="workflow"',
  'name="authority"',
  "Build the exact $149 request here",
  "Open public GitHub request",
  "GitHub account",
  "required. This builder creates only a non-binding request.",
  "Open prefilled business email",
  "Copy scope request",
  "Nothing is uploaded or stored",
  "URL shape is checked locally",
  "Exact repository-relative Markdown path",
  "without a leading slash or parent traversal",
  "Exact repository-relative path:",
  "WrightOps verifies public access after receipt",
  "navigator.clipboard.writeText(scopeText)",
  "buildGitHubIssueUrl(scopeText)",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new",
  "openGitHubLink.href = buildGitHubIssueUrl(scopeText)",
  'target="_blank"',
  'rel="noopener noreferrer"',
  'aria-disabled="true"',
  "window.location.href = buildMailto(scopeText)",
  "WrightOps $149 Single-File Agent Instructions Correction scope request",
  "one existing instructions or agent-workflow Markdown template file",
  'href="/single-file-agent-instructions-correction/sample.md"',
  "Inspect the complete one-file sample",
  'href="#scope-builder"',
  'href="/agents-md-vs-claude-md/"',
  'href="/#preflight"',
  'href="/received-proposal/"',
  "Received this proposal? Verify it",
];

const requiredProposalPageMarkers = [
  "<title>Verify a WrightOps Proposal</title>",
  'href="https://zachwright.xyz/received-proposal/"',
  '"@type": "WebPage"',
  "Verify the proposal before you <em>respond.</em>",
  "Public issue → fixed scope",
  "6 current public references",
  "One public issue. One clear answer.",
  'id="proposal-issue-url"',
  'id="verify-proposal"',
  'id="proposal-result"',
  'id="proposal-acceptance-brief"',
  'id="copy-acceptance"',
  "A match proves only that WrightOps recorded one proposal",
  "not claim that the issue owner is a",
  "No response or purchase is required",
  "No repeated follow-up sequence",
  "No work before written scope and settled payment",
  "No customer or endorsement claim from a proposal",
  'src="/received-proposal/lookup.js"',
];

const requiredProposalLookupMarkers = [
  '"use strict"',
  "https://github.com/RESOStandards/reso-tools/issues/240",
  "https://github.com/AIClarityAU/minspec/issues/889",
  "https://github.com/Extra-Chill/homeboy/issues/9653",
  "https://github.com/BasedHardware/omi/issues/10338",
  "https://github.com/DYB-Development/event_engine/issues/235",
  'price: "$750 USD"',
  'price: "$495 USD"',
  'price: "$149 USD"',
  'scopeUrl: "/agent-ready-repository-audit/#scope-builder"',
  "normalizeIssueUrl",
  "not in the current WrightOps proposal register",
  "buildAcceptanceBrief",
  "buildScopeUrl",
  "isSelfServeAudit",
  "No private pre-sale reply is required.",
  "navigator.clipboard.writeText",
  "I understand this is a non-binding request for written scope confirmation.",
  "Do not include credentials, payment details, private files",
];

const forbiddenProposalLookupMarkers = [
  "https://github.com/Liatrio-Labs/claude-code-gauntlet/issues/37",
  "https://github.com/momentiq-ai/cerebe/issues/58",
  "fetch(",
  "XMLHttpRequest",
  "navigator.sendBeacon",
  "localStorage",
  "sessionStorage",
  "document.cookie",
];

const forbiddenProposalPageMarkers = [
  "mailto:",
  "paypal.com",
  "paypal.me",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
];

const requiredSingleFileCorrectionSampleMarkers = [
  "# Complete Single-File Correction Pack",
  "historical WrightOps-owned public-repository example",
  "example, not customer",
  "work, a testimonial, or a claimed buyer outcome",
  "a5c77f4106e47240dcea302da2bbf4d05f1a2eb0",
  "7a507bc0cb42f8c04fb18e53a46371b37b5bd56f",
  "Existing file: root `AGENTS.md`",
  "Source size: 7 lines",
  "## Complete replacement Markdown",
  "161bbeff67ca2a5f0cb92cdd0fb0e5831ee17acb2e582072bee790f57c18f576",
  "## Ready-to-apply unified diff",
  "## Claim-to-source evidence",
  "2331273ab3f2b67abd96a4291f9c9046905ca3448382f99314065cab88de8d05",
  "## Acceptance checks",
  "Exactly one existing eligible instructions file is in scope",
  "## Limitations",
  "provider-confirmed settled payment before",
  "Build a non-binding $149 scope request",
];

const forbiddenSingleFileCorrectionPageMarkers = [
  "paypal.com",
  "paypal.me",
  "<form",
  "<script src=",
  "localStorage",
  "sessionStorage",
  "document.cookie",
  "navigator.sendBeacon",
  "XMLHttpRequest",
  "window.open(",
  'type="submit"',
  'action="',
  "guaranteed outcome",
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
  "See the $149 / $249 correction scope",
  "Instructions correction scope",
  'id="worksheet"',
  "Browser-local evidence worksheet",
  "Exact repeated rules",
  "Volatile duplicates",
  'id="reference-check"',
  "Public-reference integrity check",
  "Find GitHub repositories that agent instructions can no longer reach.",
  "up to ten public GitHub repository references",
  "exact public search match",
  "Nothing leaves this browser until you run the public check.",
  "No token or login",
  "PSModule/docs issue 83",
  "https://github.com/PSModule/docs/issues/83",
  "not a WrightOps customer, endorsement",
  "Inspect the fixed $149 one-file correction",
  'href="/single-file-agent-instructions-correction/"',
  "It does not",
  "upload, store, or semantically validate either file",
  'src="/agents-md-vs-claude-md/worksheet.js"',
  "AI-operated public-repository engineering with a human-accountable owner",
  'href="/agent-ready-instructions-pr/"',
  'href="/#preflight"',
  'href="/agents-md-starter-template/"',
];

const requiredInstructionsGuideWorksheetMarkers = [
  '"use strict"',
  "new TextEncoder()",
  "normalizedRules",
  "volatileRulePattern",
  "No exact repeated rule was found",
  "navigator.clipboard.writeText",
  "exact-line evidence only",
  "canonicalInput.addEventListener",
  "companionInput.addEventListener",
  "extractPublicGitHubRepositories",
  "readPublicRepository",
  "checkPublicReferences",
  "https://api.github.com/search/repositories",
  'credentials: "omit"',
  "repositories.slice(0, 10)",
  "Missing references found",
  "Do not treat unavailable as missing.",
  "exact public repository search only",
  "referenceCheckButton.addEventListener",
];

const forbiddenInstructionsGuideWorksheetMarkers = [
  "XMLHttpRequest",
  "navigator.sendBeacon",
  "localStorage",
  "sessionStorage",
  "document.cookie",
  "Authorization",
  "github_pat_",
  "Bearer ",
];

const requiredStorefrontGuideMarkers = [
  "<title>Agent-Ready Storefront Repository Checklist | WrightOps</title>",
  'href="https://zachwright.xyz/agent-ready-storefront-checklist/"',
  '"@type": "TechArticle"',
  '"datePublished": "2026-07-23"',
  '"dateModified": "2026-07-24"',
  "Prove your storefront is <em>agent-ready.</em>",
  "llms.txt + sitemap",
  "Product JSON-LD",
  "Page + feed + machine view",
  "Fixture-backed CI",
  "Illustrative evidence map / checklist model",
  "not an audit result",
  'id="quick-check"',
  'id="storefront-check-score"',
  'id="storefront-check-meter"',
  'id="storefront-check-status"',
  'id="storefront-check-action"',
  'id="storefront-check-reset"',
  "data-evidence-check",
  "Two-minute browser-local check",
  "Discovery baseline missing",
  "Evidence map incomplete",
  "Ready to confirm the $149 fixed scope",
  "Continue to the $149 Fix Plan",
  "browser-local gate still verifies the active public repository",
  "Nothing is uploaded, stored, or sent to WrightOps.",
  "function storefrontResult(count)",
  "function updateStorefrontResult()",
  "Missing evidence should stay missing",
  "No login · No form submission · No live-site crawl",
  "No fabricated reviews, policies, or catalog facts",
  "No ranking, adoption, traffic, or revenue guarantee",
  "not assess vulnerabilities, security,",
  "The $149 Fix Plan checks one active",
  "generated scope reference is",
  'href="/agent-ready-fix-plan/"',
  "Use the $149 Fix Plan",
  'href="/agent-ready-repository-audit/"',
  'href="/#preflight"',
];

const forbiddenStorefrontGuideMarkers = [
  "<form",
  "fetch(",
  "XMLHttpRequest",
  "navigator.sendBeacon",
  "localStorage",
  "sessionStorage",
  "document.cookie",
];

const requiredInstructionsStarterMarkers = [
  "<title>Free AGENTS.md Builder & Starter Template | WrightOps</title>",
  'href="https://zachwright.xyz/agents-md-starter-template/"',
  '"@type": "TechArticle"',
  '"@type": "WebApplication"',
  "WrightOps AGENTS.md Builder",
  '"datePublished": "2026-07-21"',
  '"dateModified": "2026-07-23"',
  "Build AGENTS.md with <em>evidence, not guesses.</em>",
  "No login · No analytics · No input upload · No repository code execution",
  "The builder does not inspect your repository or validate a command.",
  'id="agents-builder"',
  'id="builder-score"',
  'id="builder-meter"',
  'id="generated-agents"',
  'id="copy-generated"',
  'id="download-generated"',
  'id="builder-status"',
  "Nothing is submitted, stored, or sent to WrightOps.",
  "Missing evidence stays out of the generated file",
  'src="/agents-md-starter-template/builder.js"',
  "https://agents.md/",
  "https://code.visualstudio.com/docs/agent-customization/custom-instructions",
  'id="copy-template"',
  'id="template-source"',
  'href="/agents-md-starter-template/AGENTS.md" download',
  "Download AGENTS.md",
  "No invented setup or verification commands",
  "does not inspect a repository, execute code, validate commands",
  "security, legal, privacy, or compliance assessment",
  'href="/agent-ready-instructions-pr/"',
  "See the $149 / $249 correction scope",
  "Instructions correction scope",
  "$249 Agent Instructions Foundation",
  "It does not include a branch or pull request",
  "Scope before payment",
];

const requiredInstructionsBuilderScriptMarkers = [
  "function buildAgentsFile(input)",
  "function evidenceScore(input)",
  "elements.output.textContent = output",
  'anchor.download = "AGENTS.md"',
  'new Blob([output], { type: "text/markdown;charset=utf-8" })',
  "Missing evidence stays omitted.",
  "Generated AGENTS.md copied to the clipboard.",
  "Generated AGENTS.md downloaded locally.",
];

const forbiddenInstructionsBuilderScriptMarkers = [
  "fetch(",
  "XMLHttpRequest",
  "navigator.sendBeacon",
  "localStorage",
  "sessionStorage",
  "document.cookie",
];

const forbiddenInstructionsStarterPageMarkers = [
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  '<script src="http',
  '<link rel="stylesheet" href="http',
];

const requiredInstructionsStarterCssMarkers = [
  ".builder-layout",
  "grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr)",
  ".builder-form input:focus-visible",
  ".builder-output",
  "position: sticky",
  "@media (max-width: 860px)",
  "grid-template-columns: 1fr",
  "position: static",
  "@media (max-width: 540px)",
  ".builder-actions .reset-button",
  "width: 100%",
  "@media (prefers-reduced-motion: reduce)",
];

const requiredInstructionsStarterFileMarkers = [
  "# Repository instructions",
  "## Repository map",
  "## Working agreements",
  "## Setup",
  "[verified setup command]",
  "## Verification",
  "[verified test, lint, typecheck, or build command]",
  "## Change boundaries",
  "Ask before destructive, irreversible, production, credentialed, or paid actions.",
  "Report missing evidence instead of guessing",
  "## Completion",
];

const requiredFixPlanPageMarkers = [
  "<title>Agent-Ready Repo Fix Plan | WrightOps</title>",
  'href="https://zachwright.xyz/agent-ready-fix-plan/"',
  '"@type": "Service"',
  '"price": "149"',
  '"availability": "https://schema.org/InStock"',
  "Turn one audit into three executable",
  "Exactly three human-reviewed fix cards",
  "at most 45 minutes of human review",
  "Demonstration only — not paid, commissioned, or endorsed",
  "evidenced gap",
  "exact file or path",
  "Bounded change outline",
  "acceptance check",
  "No implementation or repository changes",
  "not a vulnerability, security, privacy, legal, or compliance",
  'id="scope-builder"',
  'id="fix-plan-scope-builder"',
  "A successful check is WrightOps' automated written fit confirmation",
  "Return to this page after the GitHub Actions audit report appears.",
  "Ignore any older repository request or checkout link",
  "completed WrightOps audit issue",
  "Confirm $149 fixed scope",
  'id="paypal-checkout-panel" hidden',
  'id="paypal-checkout-link"',
  'data-checkout-url="https://www.paypal.com/ncp/payment/H9VVRGRGA3DCG"',
  "provider-confirmed settled payment",
  "full purchase-price refund",
  "WrightOps absorbs that cost",
  "Listed on CurlShip",
  "let scopeRevision = 0",
  "confirmationRevision !== scopeRevision",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=audit-request.yml",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/sample-fix-plan-claude-code.md",
  'href="#terms"',
  'id="terms"',
];

const requiredBountyReviewPageMarkers = [
  "<title>Bounty GO/NO-GO Review Retired | WrightOps</title>",
  'href="https://zachwright.xyz/bounty-go-no-go-review/"',
  '"@type": "WebPage"',
  "Historical notice for a retired WrightOps paid offer",
  "Paid offer retired · July 24, 2026",
  "The paid bounty review is <em>closed.</em>",
  "qualified requests or settled sales",
  "No purchase path · No scope request · No payment obligation",
  "Run the free payout checklist",
  'href="/coding-bounty-payout-checklist/"',
  "https://wrightops-ai.github.io/bounty-red-flag-card/bounty-red-flag-card/",
  "zero-signal purchase path",
  "Historical notice · No paid review available",
];

const requiredBountyChecklistMarkers = [
  "<title>Coding Bounty Payout Checklist | WrightOps</title>",
  'href="https://zachwright.xyz/coding-bounty-payout-checklist/"',
  '"@type": "TechArticle"',
  '"@type": "WebApplication"',
  '"datePublished": "2026-07-21"',
  'id="bounty-worksheet"',
  'id="decision-output"',
  'id="hours" min="0.25" step="0.25"',
  "Check the payout evidence before you write the <em>code.</em>",
  "No login · No tracking · No form submission",
  "The tool stores and sends nothing",
  "The reward is escrowed, prepaid, or independently verifiable",
  "The person or system accepting delivery has evidenced payout authority",
  "Objective acceptance criteria and a review or dispute path are public",
  "The payout asset, fees, timing, and usable receipt rail are established",
  "The worker must pay, deposit, bond, purchase, trade, or transfer funds",
  "GO CANDIDATE",
  "Paid-case net",
  "payment-probability estimate",
  "$399 advertised. $0.084841 available.",
  "NO-GO. A proposal would not repair missing funds",
  "Inputs remain in your browser",
  "No GitHub account required",
  "not provide vulnerability research, exploitation, security testing",
  'href="/bounty-go-no-go-review/"',
  "https://wrightops-ai.github.io/bounty-red-flag-card/",
  "https://www.singularitymarketplace.com/docs/bounties/",
  "https://support.upwork.com/hc/en-us/articles/35088484250003-Recognize-red-flags-and-avoid-scams",
  "https://bounties.sh/faqs",
  "0x38495C0a0F46DEFbc562cCd8CDd6a50adC100773",
];

const forbiddenBountyChecklistMarkers = [
  "<form action=",
  "fetch(",
  "XMLHttpRequest",
  "navigator.sendBeacon",
  "localStorage",
  "sessionStorage",
  "document.cookie",
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
  "https://github.com/StoneCypher/fsl/issues/1491#issuecomment-5012788530",
];

const requiredAgentsSizeBudgetPageMarkers = [
  "<title>Free AGENTS.md Size Budget Checker | WrightOps</title>",
  'href="https://zachwright.xyz/agents-md-size-budget-checker/"',
  '"@type": "WebApplication"',
  '"isAccessibleForFree": true',
  "Know when your <em>AGENTS.md</em> is getting too large.",
  "32,768-byte starting value is editable planning input",
  "not a universal platform limit",
  "No login",
  "No upload",
  "No storage",
  "No tracking",
  'id="instruction-text"',
  'id="byte-budget"',
  'value="32768"',
  'id="budget-status"',
  'id="budget-progress"',
  'id="byte-count"',
  'id="character-count"',
  'id="line-count"',
  'id="budget-percent"',
  'id="copy-summary"',
  'id="clear-text"',
  "const encoder = new TextEncoder()",
  "encoder.encode(text).length",
  "Array.from(text).length",
  "navigator.clipboard.writeText(currentSummary)",
  "does not judge instruction quality",
  'href="/single-file-agent-instructions-correction/"',
  "See the $149 scope &amp; sample",
  'href="/agent-ready-repository-audit/#scope-builder"',
  "Open the active $750 self-serve audit",
  "settled PayPal Business payment are",
  "required before work.",
  "does not estimate tokens",
  "@media (prefers-reduced-motion: reduce)",
];

const forbiddenAgentsSizeBudgetPageMarkers = [
  "<form",
  "fetch(",
  "XMLHttpRequest",
  "navigator.sendBeacon",
  "localStorage",
  "sessionStorage",
  "document.cookie",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  '<script src="http',
  '<link rel="stylesheet" href="http',
  "buy.stripe.com",
];

function missing(source, markers) {
  return markers.filter((marker) => !source.includes(marker));
}

const failures = [];
for (const marker of [
  "See the $249 service",
  "See the $249 scope &amp; proof",
  "$249 Instructions PR",
]) {
  if (
    instructionsStarterPage.includes(marker) ||
    instructionsGuidePage.includes(marker)
  ) {
    failures.push(`The instruction guides must not use the retired PR-shaped cross-sell: ${marker}`);
  }
}
const missingApp = missing(app, requiredAppMarkers);
const missingHtml = missing(html, requiredHtmlMarkers);
const missingAuditPage = missing(auditPage, requiredAuditPageMarkers);
const missingAuditSamplePage = missing(
  auditSamplePage,
  requiredAuditSampleMarkers,
);
const missingInstructionsPage = missing(instructionsPage, requiredInstructionsPageMarkers);
const missingSingleFileCorrectionPage = missing(
  singleFileCorrectionPage,
  requiredSingleFileCorrectionPageMarkers,
);
const missingSingleFileCorrectionSample = missing(
  singleFileCorrectionSample,
  requiredSingleFileCorrectionSampleMarkers,
);
const missingInstructionsGuidePage = missing(
  instructionsGuidePage,
  requiredInstructionsGuideMarkers,
);
const missingInstructionsGuideWorksheet = missing(
  instructionsGuideWorksheet,
  requiredInstructionsGuideWorksheetMarkers,
);
const missingStorefrontGuidePage = missing(
  storefrontGuidePage,
  requiredStorefrontGuideMarkers,
);
const missingInstructionsStarterPage = missing(
  instructionsStarterPage,
  requiredInstructionsStarterMarkers,
);
const missingInstructionsStarterFile = missing(
  instructionsStarterFile,
  requiredInstructionsStarterFileMarkers,
);
const missingInstructionsBuilderScript = missing(
  instructionsBuilderScript,
  requiredInstructionsBuilderScriptMarkers,
);
const missingInstructionsStarterCss = missing(
  instructionsStarterCss,
  requiredInstructionsStarterCssMarkers,
);
const missingAgentsSizeBudgetPage = missing(
  agentsSizeBudgetPage,
  requiredAgentsSizeBudgetPageMarkers,
);
const missingFixPlanPage = missing(fixPlanPage, requiredFixPlanPageMarkers);
const missingBountyReviewPage = missing(
  bountyReviewPage,
  requiredBountyReviewPageMarkers,
);
const missingBountyChecklistPage = missing(
  bountyChecklistPage,
  requiredBountyChecklistMarkers,
);
const missingCostPage = missing(costPage, requiredCostPageMarkers);
const missingCostCalculator = missing(
  costCalculator,
  requiredCostCalculatorMarkers,
);
const missingCostAttributionPage = missing(
  costAttributionPage,
  requiredCostAttributionPageMarkers,
);
const missingStructuredOutputReliabilityPage = missing(
  structuredOutputReliabilityPage,
  requiredStructuredOutputReliabilityPageMarkers,
);
const missingCostSample = missing(costSample, requiredCostSampleMarkers);
const missingProposalPage = missing(proposalPage, requiredProposalPageMarkers);
const missingProposalLookup = missing(
  proposalLookup,
  requiredProposalLookupMarkers,
);

if (missingApp.length) {
  failures.push(`App is missing: ${missingApp.join(", ")}`);
}

if (missingHtml.length) {
  failures.push(`HTML is missing: ${missingHtml.join(", ")}`);
}

if (missingAuditSamplePage.length) {
  failures.push(
    `Audit sample page is missing: ${missingAuditSamplePage.join(", ")}`,
  );
}

for (const marker of forbiddenAuditSampleMarkers) {
  if (auditSamplePage.includes(marker)) {
    failures.push(`Audit sample page contains forbidden marker: ${marker}`);
  }
}

for (const marker of [
  ".sample-hero",
  ".priority-list",
  ".handoff-layout",
  ".limits-layout",
  "@media (max-width: 640px)",
]) {
  if (!auditSampleCss.includes(marker)) {
    failures.push(`Audit sample CSS is missing: ${marker}`);
  }
}

if (missingAuditPage.length) {
  failures.push(`Audit page is missing: ${missingAuditPage.join(", ")}`);
}

if (missingInstructionsPage.length) {
  failures.push(`Instructions page is missing: ${missingInstructionsPage.join(", ")}`);
}

if (missingSingleFileCorrectionPage.length) {
  failures.push(
    `Single-file correction page is missing: ${missingSingleFileCorrectionPage.join(", ")}`,
  );
}

if (missingSingleFileCorrectionSample.length) {
  failures.push(
    `Single-file correction sample is missing: ${missingSingleFileCorrectionSample.join(", ")}`,
  );
}

for (const marker of forbiddenSingleFileCorrectionPageMarkers) {
  if (singleFileCorrectionPage.includes(marker)) {
    failures.push(`Single-file correction page must remain scope-first: ${marker}`);
  }
}

if (missingInstructionsGuidePage.length) {
  failures.push(
    `Instructions guide is missing: ${missingInstructionsGuidePage.join(", ")}`,
  );
}

if (missingInstructionsGuideWorksheet.length) {
  failures.push(
    `Instructions guide worksheet is missing: ${missingInstructionsGuideWorksheet.join(", ")}`,
  );
}

for (const marker of forbiddenInstructionsGuideWorksheetMarkers) {
  if (instructionsGuideWorksheet.includes(marker)) {
    failures.push(`Instructions guide worksheet must preserve its credential-free public-read boundary: ${marker}`);
  }
}

const publicReferenceFetchCount = (
  instructionsGuideWorksheet.match(/\bfetch\(/g) || []
).length;
if (publicReferenceFetchCount !== 1) {
  failures.push(
    `Expected exactly one user-triggered public GitHub reference fetch; found ${publicReferenceFetchCount}.`,
  );
}

const publicReferenceApiHostCount = (
  instructionsGuideWorksheet.match(/https:\/\/api\.github\.com\/search\/repositories/g) || []
).length;
if (publicReferenceApiHostCount !== 1) {
  failures.push(
    `Expected exactly one fixed public GitHub repository API host; found ${publicReferenceApiHostCount}.`,
  );
}

if (missingStorefrontGuidePage.length) {
  failures.push(
    `Storefront guide is missing: ${missingStorefrontGuidePage.join(", ")}`,
  );
}

for (const marker of forbiddenStorefrontGuideMarkers) {
  if (storefrontGuidePage.includes(marker)) {
    failures.push(`Storefront guide must remain read-only: ${marker}`);
  }
}

const storefrontGuideCheckCount = (
  storefrontGuidePage.match(/type="checkbox" data-evidence-check/g) || []
).length;
if (storefrontGuideCheckCount !== 7) {
  failures.push(
    `Expected exactly seven browser-local storefront evidence checks; found ${storefrontGuideCheckCount}.`,
  );
}

if (
  !storefrontGuidePage.includes('href="/#preflight"') ||
  !storefrontGuidePage.includes('href="/agent-ready-fix-plan/"')
) {
  failures.push(
    "Storefront quick-check results must preserve the free preflight and $149 Fix Plan paths.",
  );
}

const storefrontStructuredDataMatch = storefrontGuidePage.match(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
);
if (!storefrontStructuredDataMatch) {
  failures.push("Storefront guide is missing parseable JSON-LD.");
} else {
  try {
    const structuredData = JSON.parse(storefrontStructuredDataMatch[1]);
    if (
      structuredData["@type"] !== "TechArticle" ||
      structuredData.mainEntityOfPage !==
        "https://zachwright.xyz/agent-ready-storefront-checklist/"
    ) {
      failures.push("Storefront guide JSON-LD does not match the canonical article.");
    }
  } catch {
    failures.push("Storefront guide JSON-LD is invalid JSON.");
  }
}

if (missingInstructionsStarterPage.length) {
  failures.push(
    `Instructions starter page is missing: ${missingInstructionsStarterPage.join(", ")}`,
  );
}

if (missingInstructionsStarterFile.length) {
  failures.push(
    `Instructions starter file is missing: ${missingInstructionsStarterFile.join(", ")}`,
  );
}

if (missingInstructionsBuilderScript.length) {
  failures.push(
    `Instructions builder script is missing: ${missingInstructionsBuilderScript.join(", ")}`,
  );
}

for (const marker of forbiddenInstructionsBuilderScriptMarkers) {
  if (instructionsBuilderScript.includes(marker)) {
    failures.push(`Instructions builder must remain browser-local: ${marker}`);
  }
}

for (const marker of forbiddenInstructionsStarterPageMarkers) {
  if (instructionsStarterPage.includes(marker)) {
    failures.push(`Instructions builder page must not load third-party assets: ${marker}`);
  }
}

if (missingInstructionsStarterCss.length) {
  failures.push(
    `Instructions builder CSS is missing: ${missingInstructionsStarterCss.join(", ")}`,
  );
}

if (missingAgentsSizeBudgetPage.length) {
  failures.push(
    `AGENTS.md size budget checker is missing: ${missingAgentsSizeBudgetPage.join(", ")}`,
  );
}

for (const marker of forbiddenAgentsSizeBudgetPageMarkers) {
  if (agentsSizeBudgetPage.includes(marker)) {
    failures.push(`AGENTS.md size budget checker must remain browser-local: ${marker}`);
  }
}

if (missingFixPlanPage.length) {
  failures.push(`Fix Plan page is missing: ${missingFixPlanPage.join(", ")}`);
}

if (missingBountyReviewPage.length) {
  failures.push(
    `Bounty review page is missing: ${missingBountyReviewPage.join(", ")}`,
  );
}

if (missingBountyChecklistPage.length) {
  failures.push(
    `Bounty checklist is missing: ${missingBountyChecklistPage.join(", ")}`,
  );
}

for (const marker of forbiddenBountyChecklistMarkers) {
  if (bountyChecklistPage.includes(marker)) {
    failures.push(`Bounty checklist must remain browser-local: ${marker}`);
  }
}

if (missingCostPage.length) {
  failures.push(`Cost page is missing: ${missingCostPage.join(", ")}`);
}

if (missingCostCalculator.length) {
  failures.push(
    `Cost calculator is missing: ${missingCostCalculator.join(", ")}`,
  );
}

for (const marker of forbiddenCostCalculatorMarkers) {
  if (costCalculator.includes(marker)) {
    failures.push(`Cost calculator must remain browser-local: ${marker}`);
  }
}

if (missingCostAttributionPage.length) {
  failures.push(
    `Cost-attribution guide is missing: ${missingCostAttributionPage.join(", ")}`,
  );
}

for (const marker of forbiddenCostAttributionPageMarkers) {
  if (costAttributionPage.includes(marker)) {
    failures.push(`Cost-attribution guide must remain read-only: ${marker}`);
  }
}

if (missingStructuredOutputReliabilityPage.length) {
  failures.push(
    `Structured-output reliability guide is missing: ${missingStructuredOutputReliabilityPage.join(", ")}`,
  );
}

for (const marker of forbiddenStructuredOutputReliabilityPageMarkers) {
  if (structuredOutputReliabilityPage.includes(marker)) {
    failures.push(`Structured-output reliability guide must remain read-only: ${marker}`);
  }
}

if (missingCostSample.length) {
  failures.push(`Cost sample is missing: ${missingCostSample.join(", ")}`);
}

if (missingProposalPage.length) {
  failures.push(
    `Proposal verification page is missing: ${missingProposalPage.join(", ")}`,
  );
}

if (missingProposalLookup.length) {
  failures.push(
    `Proposal verification lookup is missing: ${missingProposalLookup.join(", ")}`,
  );
}

const auditProposalScopeBuilderCount =
  proposalLookup.match(
    /scopeUrl: "\/agent-ready-repository-audit\/#scope-builder"/g,
  )?.length || 0;
if (auditProposalScopeBuilderCount !== 2) {
  failures.push(
    `Expected exactly two current $750 proposal routes to use the self-serve audit scope builder; found ${auditProposalScopeBuilderCount}.`,
  );
}

const expectedProposalRoutes = [
  {
    issue: "https://github.com/RESOStandards/reso-tools/issues/240",
    price: "$750 USD",
    scopeUrl: "/agent-ready-repository-audit/#scope-builder",
  },
  {
    issue: "https://github.com/AIClarityAU/minspec/issues/889",
    price: "$750 USD",
    scopeUrl: "/agent-ready-repository-audit/#scope-builder",
  },
  {
    issue: "https://github.com/Extra-Chill/homeboy/issues/9653",
    price: "$495 USD",
    scopeUrl:
      "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=cost-reliability-snapshot-request.yml",
  },
  {
    issue: "https://github.com/BasedHardware/omi/issues/10338",
    price: "$495 USD",
    scopeUrl:
      "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=cost-reliability-snapshot-request.yml",
  },
  {
    issue: "https://github.com/DYB-Development/event_engine/issues/235",
    price: "$149 USD",
    scopeUrl: "/single-file-agent-instructions-correction/#scope-builder",
  },
  {
    issue: "https://github.com/Arize-ai/coding-harness-tracing/issues/97",
    price: "$495 USD",
    scopeUrl:
      "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=cost-reliability-snapshot-request.yml",
  },
];

for (const expected of expectedProposalRoutes) {
  const issueMarker = `issue: "${expected.issue}",`;
  const issueCount = proposalLookup.split(issueMarker).length - 1;
  const recordStart = proposalLookup.indexOf(issueMarker);
  const recordEnd = proposalLookup.indexOf("\n    },", recordStart);
  const record =
    recordStart >= 0 && recordEnd > recordStart
      ? proposalLookup.slice(recordStart, recordEnd)
      : "";
  const normalizedRecord = record.replace(/\s+/g, " ");
  if (
    issueCount !== 1 ||
    !normalizedRecord.includes(`price: "${expected.price}"`) ||
    !normalizedRecord.includes(`scopeUrl: "${expected.scopeUrl}"`)
  ) {
    failures.push(
      `Proposal route contract mismatch for ${expected.issue}: expected ${expected.price} via ${expected.scopeUrl}.`,
    );
  }
}

for (const marker of forbiddenProposalLookupMarkers) {
  if (proposalLookup.includes(marker)) {
    failures.push(`Proposal verification must remain browser-local: ${marker}`);
  }
}

for (const marker of forbiddenProposalPageMarkers) {
  if (proposalPage.includes(marker)) {
    failures.push(`Proposal verification must not expose private contact or checkout routes: ${marker}`);
  }
}

for (const marker of forbiddenMarkers) {
  if (
    app.includes(marker) ||
    html.includes(marker) ||
    main.includes(marker) ||
    auditPage.includes(marker) ||
    instructionsPage.includes(marker) ||
    instructionsGuidePage.includes(marker) ||
    storefrontGuidePage.includes(marker) ||
    instructionsStarterPage.includes(marker) ||
    instructionsStarterFile.includes(marker) ||
    agentsSizeBudgetPage.includes(marker) ||
    fixPlanPage.includes(marker) ||
    bountyReviewPage.includes(marker) ||
    bountyChecklistPage.includes(marker) ||
    costPage.includes(marker) ||
    costAttributionPage.includes(marker) ||
    structuredOutputReliabilityPage.includes(marker) ||
    costSample.includes(marker) ||
    proposalPage.includes(marker) ||
    proposalLookup.includes(marker)
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

if (!proposalCss.includes("@media (prefers-reduced-motion: reduce)")) {
  failures.push("Proposal verification reduced-motion contract is missing.");
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

const instructionsStarterUrl = "https://zachwright.xyz/agents-md-starter-template/";
if (!sitemap.includes(instructionsStarterUrl)) {
  failures.push("Sitemap is missing the free AGENTS.md starter template.");
}

if (!llms.includes(instructionsStarterUrl)) {
  failures.push("llms.txt is missing the free AGENTS.md starter template.");
}

const agentsSizeBudgetUrl =
  "https://zachwright.xyz/agents-md-size-budget-checker/";
if (!sitemap.includes(agentsSizeBudgetUrl)) {
  failures.push("Sitemap is missing the AGENTS.md size budget checker.");
}

if (!llms.includes(agentsSizeBudgetUrl)) {
  failures.push("llms.txt is missing the AGENTS.md size budget checker.");
}

const storefrontGuideUrl = "https://zachwright.xyz/agent-ready-storefront-checklist/";
if (!sitemap.includes(storefrontGuideUrl)) {
  failures.push("Sitemap is missing the agent-ready storefront checklist.");
}

if (!llms.includes(storefrontGuideUrl)) {
  failures.push("llms.txt is missing the agent-ready storefront checklist.");
}

if (!llms.includes(auditLandingUrl)) {
  failures.push("llms.txt is missing the audit landing page.");
}

const proposalVerificationUrl = "https://zachwright.xyz/received-proposal/";
if (!sitemap.includes(proposalVerificationUrl)) {
  failures.push("Sitemap is missing the proposal verification page.");
}

if (!llms.includes(proposalVerificationUrl)) {
  failures.push("llms.txt is missing the proposal verification page.");
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

const costAttributionUrl =
  "https://zachwright.xyz/ai-agent-cost-attribution-checklist/";
if (!sitemap.includes(costAttributionUrl)) {
  failures.push("Sitemap is missing the AI-agent cost-attribution checklist.");
}

if (!llms.includes(costAttributionUrl)) {
  failures.push("llms.txt is missing the AI-agent cost-attribution checklist.");
}

const structuredOutputReliabilityUrl =
  "https://zachwright.xyz/ai-agent-structured-output-reliability-checklist/";
if (!sitemap.includes(structuredOutputReliabilityUrl)) {
  failures.push("Sitemap is missing the structured-output reliability checklist.");
}

if (!llms.includes(structuredOutputReliabilityUrl)) {
  failures.push("llms.txt is missing the structured-output reliability checklist.");
}

if (
  !costPage.includes(
    'href="/ai-agent-structured-output-reliability-checklist/"',
  )
) {
  failures.push("The $495 snapshot is missing its structured-output checklist path.");
}

const bountyReviewLandingUrl = "https://zachwright.xyz/bounty-go-no-go-review/";
if (!sitemap.includes(bountyReviewLandingUrl)) {
  failures.push("Sitemap is missing the bounty review landing page.");
}

if (!llms.includes(bountyReviewLandingUrl)) {
  failures.push("llms.txt is missing the bounty review retirement notice.");
}

if (!paymentConfig.includes("res.statusCode = 410")) {
  failures.push("Retired payment config must return HTTP 410.");
}

if (
  !paymentConfig.includes('status: "retired"') ||
  !paymentConfig.includes('code: "AI_OPERATOR_KIT_RETIRED"') ||
  !paymentConfig.includes("links: {}")
) {
  failures.push("Retired payment config is missing its fail-closed response.");
}

for (const marker of ["buy.stripe.com", "STRIPE_PAYMENT_LINK"]) {
  if (paymentConfig.includes(marker)) {
    failures.push(`Retired payment config exposes a forbidden receipt marker: ${marker}`);
  }
}

const bountyChecklistUrl = "https://zachwright.xyz/coding-bounty-payout-checklist/";
if (!sitemap.includes(bountyChecklistUrl)) {
  failures.push("Sitemap is missing the coding bounty payout checklist.");
}

if (!llms.includes(bountyChecklistUrl)) {
  failures.push("llms.txt is missing the coding bounty payout checklist.");
}

if (llms.includes("requires a GitHub sign-in") || llms.includes("requires GitHub sign-in")) {
  failures.push("llms.txt must preserve the live no-GitHub business-email scope paths.");
}

if (!llms.includes("prefilled WrightOps business-email path")) {
  failures.push("llms.txt is missing the business-email scope alternative.");
}

if (app.includes("mailto:${CONTACT_EMAIL}?subject=Agent-Ready%20Repository%20Audit")) {
  failures.push("The $750 audit must use the structured public scope form, not email.");
}

const instructionsScopeBuilderCtaCount = (
  instructionsPage.match(/href="#scope-builder"/g) || []
).length;
if (instructionsScopeBuilderCtaCount < 3) {
  failures.push(
    `Expected at least three instructions-correction scope-builder CTAs; found ${instructionsScopeBuilderCtaCount}.`,
  );
}

for (const marker of [
  "fetch(",
  "localStorage",
  "sessionStorage",
  "<form",
  'type="submit"',
  'scopeForm.addEventListener("submit"',
]) {
  if (instructionsPage.includes(marker)) {
    failures.push(`The instructions correction scope builder must remain browser-local: ${marker}`);
  }
}

for (const marker of [
  '"price": "49"',
  "paypal.com",
  "mailto:",
  "issues/new?template=bounty-review.yml",
  'id="scope-builder"',
  "fetch(",
  "localStorage",
  "sessionStorage",
  "<form",
  "$49",
  "checkout",
]) {
  if (bountyReviewPage.includes(marker)) {
    failures.push(`The retired bounty review page must not expose paid intake or browser state: ${marker}`);
  }
}

const auditCtaCount = (app.match(/href=\{AUDIT_REQUEST_URL\}/g) || []).length;
if (auditCtaCount < 3) {
  failures.push(`Expected at least three full-audit fallbacks; found ${auditCtaCount}.`);
}

const preflightCtaCount = (app.match(/href="#preflight"/g) || []).length;
if (preflightCtaCount < 3) {
  failures.push(`Expected at least three no-login preflight CTAs; found ${preflightCtaCount}.`);
}

if (
  !/\.preflight-result-head\s*>\s*div\s*\{[^}]*min-width:\s*0;/s.test(css) ||
  !/\.preflight-result-head\s+a\s*\{[^}]*max-width:\s*100%;[^}]*overflow-wrap:\s*anywhere;/s.test(
    css,
  )
) {
  failures.push("The homepage preflight result must wrap public repository evidence on narrow screens.");
}

const auditScopeRequestCtaCount = (
  app.match(/href=\{HUMAN_AUDIT_REQUEST_URL\}/g) || []
).length;
if (auditScopeRequestCtaCount < 2) {
  failures.push(
    `Expected at least two $750 public scope-request paths; found ${auditScopeRequestCtaCount}.`,
  );
}

const auditTermsCtaCount = (
  app.match(/href=\{HUMAN_AUDIT_TERMS_URL\}/g) || []
).length;
if (auditTermsCtaCount < 2) {
  failures.push(
    `Expected at least two $750 terms paths; found ${auditTermsCtaCount}.`,
  );
}

const auditPagePreflightCtaCount = (
  auditPage.match(/href="\/#preflight"/g) || []
).length;
if (auditPagePreflightCtaCount < 2) {
  failures.push(
    `Expected at least two dedicated $750 page routes to the optional no-login preflight; found ${auditPagePreflightCtaCount}.`,
  );
}

const auditPageScopeBuilderCtaCount = (
  auditPage.match(/href="#scope-builder"/g) || []
).length;
if (auditPageScopeBuilderCtaCount < 3) {
  failures.push(
    `Expected at least three dedicated $750 self-serve confirmation paths; found ${auditPageScopeBuilderCtaCount}.`,
  );
}

const auditPageGitHubScopeCtaCount = (
  auditPage.match(
    /href="https:\/\/github\.com\/wrightops-ai\/agent-ready-repo-auditor\/issues\/new\?template=human-audit-scope-request\.yml"/g,
  ) || []
).length;
if (auditPageGitHubScopeCtaCount < 2) {
  failures.push(
    `Expected at least two dedicated $750 GitHub scope fallbacks; found ${auditPageGitHubScopeCtaCount}.`,
  );
}

const auditPageEmailScopeCtaCount = (
  auditPage.match(
    /href="mailto:zach@zachwright\.xyz\?subject=WrightOps%20%24750%20repository%20audit%20scope%20request/g,
  ) || []
).length;
if (auditPageEmailScopeCtaCount < 2) {
  failures.push(
    `Expected at least two dedicated $750 business-email scope fallbacks; found ${auditPageEmailScopeCtaCount}.`,
  );
}

for (const marker of [
  "localStorage",
  "sessionStorage",
  "document.cookie",
  "navigator.sendBeacon",
  "XMLHttpRequest",
  "<form",
  'type="submit"',
  "Authorization",
  "Bearer ",
  "checkoutLink.click",
  "window.open(PAYPAL_CHECKOUT_URL",
  "window.location.href = PAYPAL_CHECKOUT_URL",
  "location.assign(PAYPAL_CHECKOUT_URL",
  "location.replace(PAYPAL_CHECKOUT_URL",
]) {
  if (auditPage.includes(marker)) {
    failures.push(`The $750 audit checkout gate must not use unsafe browser behavior: ${marker}`);
  }
}

if (!auditPage.includes('data-checkout-url="https://www.paypal.com/ncp/payment/5WFCZBVANJLGA"')) {
  failures.push("The $750 PayPal checkout must be present only as a gated data URL.");
}

if (
  !auditPage.includes('aria-disabled="true"') ||
  !/id="repository-audit-paypal-panel"[\s\S]{0,80}hidden/.test(auditPage)
) {
  failures.push("The $750 PayPal checkout must start hidden and disabled.");
}

if (
  !/\.scope-builder-actions\[hidden\]\s*\{[^}]*display:\s*none;/s.test(auditCss)
) {
  failures.push("Shared checkout panels must remain visually hidden before scope confirmation.");
}

if (!auditPage.includes("fetch(url, {")) {
  failures.push("The $750 audit gate must use the centralized unauthenticated fetch wrapper.");
}

for (const marker of [
  '!url.port',
  '!url.pathname.includes("%")',
  "repository.archived",
  "repository.disabled",
  "repository.default_branch",
  '.slice(0, 160)',
  "scope_version=repository-audit-v2",
  "4-hour review cap",
  "buildScopeMailto(note)",
  'confirmedScopeEmail.addEventListener("click", enableCheckout)',
  'document.execCommand("copy")',
  "copiedWithFallback",
  'cache: "no-store"',
  'Accept: "application/vnd.github+json"',
]) {
  if (!auditPage.includes(marker)) {
    failures.push(`The $750 audit evidence gate is missing a strict verifier: ${marker}`);
  }
}

for (const marker of [
  "localStorage",
  "sessionStorage",
  "document.cookie",
  "navigator.sendBeacon",
  "XMLHttpRequest",
  'action="',
  "action={",
]) {
  if (app.includes(marker)) {
    failures.push(`The homepage scope builders must remain browser-local: ${marker}`);
  }
}

const fixPlanAuditCtaCount = (
  fixPlanPage.match(/issues\/new\?template=audit-request\.yml/g) || []
).length;
if (fixPlanAuditCtaCount < 3) {
  failures.push(
    `Expected the Fix Plan offer to preserve at least three optional free-audit starts; found ${fixPlanAuditCtaCount}.`,
  );
}

const fixPlanScopeCtaCount = (
  fixPlanPage.match(/issues\/new\?template=fix-plan-request\.yml/g) || []
).length;

for (const marker of [
  "localStorage",
  "sessionStorage",
  "document.cookie",
  "navigator.sendBeacon",
  "XMLHttpRequest",
  "<form",
  'type="submit"',
  "Authorization",
  "Bearer ",
  "checkoutLink.click",
  "window.open(PAYPAL_CHECKOUT_URL",
  "window.location.href = PAYPAL_CHECKOUT_URL",
  "location.assign(PAYPAL_CHECKOUT_URL",
  "location.replace(PAYPAL_CHECKOUT_URL",
]) {
  if (fixPlanPage.includes(marker)) {
    failures.push(`The Fix Plan checkout gate must not use unsafe browser behavior: ${marker}`);
  }
}

if (fixPlanScopeCtaCount !== 0) {
  failures.push(
    `Expected the active Fix Plan page to remove the contradictory legacy request route; found ${fixPlanScopeCtaCount}.`,
  );
}

if (
  fixPlanPage.includes(
    "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-fix-plan.md",
  )
) {
  failures.push(
    "The active Fix Plan page must not send buyers to legacy terms that expose a contradictory checkout route.",
  );
}

const fixPlanSelfServeCtaCount = (
  fixPlanPage.match(/href="#scope-builder"/g) || []
).length;
if (fixPlanSelfServeCtaCount < 3) {
  failures.push(
    `Expected the Fix Plan offer to preserve at least three self-serve confirmation routes; found ${fixPlanSelfServeCtaCount}.`,
  );
}

if (
  /href=["']https:\/\/www\.paypal\.com\/ncp\/payment\/H9VVRGRGA3DCG["']/.test(
    fixPlanPage,
  )
) {
  failures.push("The Fix Plan PayPal URL must not be a live href before the evidence gate passes.");
}

for (const marker of [
  'const AUDIT_REPO_OWNER = "wrightops-ai"',
  'const AUDIT_REPO_NAME = "agent-ready-repo-auditor"',
  'name="audit-issue"',
  'labels.includes("audit-request")',
  'String(issue.title || "").startsWith("[Audit request]")',
  'comment.user.type === "Bot"',
  'comment.performed_via_github_app.slug === "github-actions"',
  "AUTOMATED_REPORT_SENTENCE",
  "Evidence score",
  'checkoutLink.removeAttribute("href")',
  "checkoutLink.href = PAYPAL_CHECKOUT_URL",
  "control.addEventListener(\"input\", invalidateScope)",
  "control.addEventListener(\"change\", invalidateScope)",
]) {
  if (!fixPlanPage.includes(marker)) {
    failures.push(`The active Fix Plan evidence gate is missing: ${marker}`);
  }
}

for (const file of [
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "og.png",
  "agent-ready-repository-audit/index.html",
  "agent-ready-repository-audit/styles.css",
  "agent-ready-repository-audit/sample/index.html",
  "agent-ready-repository-audit/sample/styles.css",
  "agent-ready-instructions-pr/index.html",
  "single-file-agent-instructions-correction/index.html",
  "single-file-agent-instructions-correction/sample.md",
  "agents-md-vs-claude-md/index.html",
  "agents-md-vs-claude-md/worksheet.js",
  "agents-md-starter-template/index.html",
  "agents-md-size-budget-checker/index.html",
  "agent-ready-storefront-checklist/index.html",
  "agents-md-starter-template/styles.css",
  "agents-md-starter-template/AGENTS.md",
  "agents-md-starter-template/builder.js",
  "agent-ready-fix-plan/index.html",
  "bounty-go-no-go-review/index.html",
  "coding-bounty-payout-checklist/index.html",
  "ai-agent-cost-reliability-snapshot/index.html",
  "ai-agent-cost-reliability-snapshot/styles.css",
  "ai-agent-cost-reliability-snapshot/synthetic-sample.md",
  "ai-agent-structured-output-reliability-checklist/index.html",
  "received-proposal/index.html",
  "received-proposal/lookup.js",
  "received-proposal/styles.css",
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

const faviconRewrite = vercelConfig.rewrites?.find(
  (rewrite) =>
    rewrite?.source === "/favicon.ico" && rewrite?.destination === "/og.png",
);
if (!faviconRewrite) {
  failures.push("vercel.json must rewrite /favicon.ico to public/og.png.");
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
      auditSamplePageMarkers: requiredAuditSampleMarkers.length,
      auditSampleForbiddenMarkers: forbiddenAuditSampleMarkers.length,
      instructionsPageMarkers: requiredInstructionsPageMarkers.length,
      instructionsGuideMarkers: requiredInstructionsGuideMarkers.length,
      instructionsGuideWorksheetMarkers:
        requiredInstructionsGuideWorksheetMarkers.length,
      instructionsGuideWorksheetForbiddenMarkers:
        forbiddenInstructionsGuideWorksheetMarkers.length,
      storefrontGuideMarkers: requiredStorefrontGuideMarkers.length,
      storefrontGuideForbiddenMarkers: forbiddenStorefrontGuideMarkers.length,
      instructionsStarterMarkers: requiredInstructionsStarterMarkers.length,
      instructionsBuilderScriptMarkers: requiredInstructionsBuilderScriptMarkers.length,
      instructionsBuilderForbiddenMarkers: forbiddenInstructionsBuilderScriptMarkers.length,
      instructionsBuilderPageForbiddenMarkers: forbiddenInstructionsStarterPageMarkers.length,
      instructionsBuilderCssMarkers: requiredInstructionsStarterCssMarkers.length,
      agentsSizeBudgetPageMarkers: requiredAgentsSizeBudgetPageMarkers.length,
      agentsSizeBudgetPageForbiddenMarkers:
        forbiddenAgentsSizeBudgetPageMarkers.length,
      fixPlanPageMarkers: requiredFixPlanPageMarkers.length,
      bountyReviewPageMarkers: requiredBountyReviewPageMarkers.length,
      bountyChecklistMarkers: requiredBountyChecklistMarkers.length,
      bountyChecklistForbiddenMarkers: forbiddenBountyChecklistMarkers.length,
      costPageMarkers: requiredCostPageMarkers.length,
      costCalculatorMarkers: requiredCostCalculatorMarkers.length,
      costCalculatorForbiddenMarkers: forbiddenCostCalculatorMarkers.length,
      costAttributionPageMarkers: requiredCostAttributionPageMarkers.length,
      costAttributionPageForbiddenMarkers:
        forbiddenCostAttributionPageMarkers.length,
      structuredOutputReliabilityPageMarkers:
        requiredStructuredOutputReliabilityPageMarkers.length,
      structuredOutputReliabilityPageForbiddenMarkers:
        forbiddenStructuredOutputReliabilityPageMarkers.length,
      proposalPageMarkers: requiredProposalPageMarkers.length,
      proposalLookupMarkers: requiredProposalLookupMarkers.length,
      proposalLookupForbiddenMarkers: forbiddenProposalLookupMarkers.length,
      costSampleMarkers: requiredCostSampleMarkers.length,
      singleFileCorrectionSampleMarkers:
        requiredSingleFileCorrectionSampleMarkers.length,
      forbiddenMarkers: forbiddenMarkers.length,
      auditCtas: auditCtaCount,
      preflightCtas: preflightCtaCount,
      auditScopeRequestCtas: auditScopeRequestCtaCount,
      auditTermsCtas: auditTermsCtaCount,
      publicAssets: 27,
    },
    null,
    2,
  ),
);
