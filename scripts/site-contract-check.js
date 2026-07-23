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
  "window.location.hash.slice(1)",
  "window.requestAnimationFrame",
  'target.scrollIntoView({ block: "start" })',
  "no account, clone, code execution, or WrightOps data storage",
  "Qualified implementation gap",
  "Request $249 scope",
  "Copy preflight evidence",
  "unauthenticated API limit applies",
  'reducedMotion="user"',
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=audit-request.yml",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=human-audit-scope-request.yml",
  'const HUMAN_AUDIT_LANDING_URL = "/agent-ready-repository-audit/"',
  'primaryHref: "#preflight"',
  "Run preflight to scope",
  "See the $750 scope & proof",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-repository-audit.md",
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
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=fix-plan-request.yml",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/sample-fix-plan-claude-code.md",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-fix-plan.md",
  'const FIX_PLAN_LANDING_URL = "/agent-ready-fix-plan/"',
  "See the $149 scope & sample",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=instructions-pr-request.yml",
  'const INSTRUCTIONS_PR_LANDING_URL = "/agent-ready-instructions-pr/"',
  'const AGENTS_STARTER_URL = "/agents-md-starter-template/"',
  '<a className="hero-starter-link" href={AGENTS_STARTER_URL}>',
  "Copy the free AGENTS.md starter",
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
  'const BOUNTY_CHECKLIST_URL = "/coding-bounty-payout-checklist/"',
  "See the $49 scope &amp; sample",
  "Run the free payout checklist",
  "https://github.com/wrightops-ai/bounty-red-flag-card/blob/main/docs/sample-bounty-go-no-go-review.md",
  "https://github.com/wrightops-ai/bounty-red-flag-card/blob/main/docs/bounty-go-no-go-review.md",
  "Bounty GO/NO-GO Review",
  "reviews exactly one public bounty or listing",
  "No guaranteed payout or professional advice",
  "No GitHub account is required on the full page",
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
  '"name": "Free AGENTS.md starter template"',
  '"url": "https://zachwright.xyz/agents-md-starter-template/"',
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
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-repository-audit.md",
  "mailto:zach@zachwright.xyz?subject=WrightOps%20%24750%20repository%20audit%20scope%20request",
  "Email scope without GitHub",
  'href="/#preflight"',
  "Run preflight to scope",
  "Request scope on GitHub",
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
  "mailto:zach@zachwright.xyz?subject=WrightOps%20%24495%20cost%20reliability%20scope%20request",
  "Email scope without GitHub",
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
  "Use the public GitHub form or business email",
  "Never include contact or payment",
  "personal or customer data",
  "mailto:zach@zachwright.xyz?subject=Agent-Ready%20Instructions%20PR%20scope%20confirmed",
  "private, buyer-specific PayPal Goods &amp; Services checkout",
  "If WrightOps cannot deliver the confirmed scope",
  "full refund of every dollar paid through the original payment rail",
  "Public demand, not testimonials",
  "Three repositories asked for better agent instructions.",
  "not customers, paid engagements,",
  "testimonials, or endorsements",
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
  "mailto:zach@zachwright.xyz?subject=WrightOps%20%24249%20instructions%20PR%20scope%20request",
  "Email scope without GitHub",
  'id="scope-builder"',
  'id="instructions-scope-builder"',
  'name="repository"',
  'name="revision"',
  'name="companion"',
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
  "navigator.clipboard.writeText(scopeText)",
  "window.location.href = buildMailto(scopeText)",
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
  'href="/agents-md-starter-template/"',
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
  "$249 Agent-Ready Instructions PR",
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
  "Use the public GitHub form or business email",
  "Never include contact, private, payment, or transaction data",
  "does not create a contract or payment obligation",
  "Self-serve scope confirmation",
  'id="scope-builder"',
  'id="fix-plan-scope-builder"',
  'name="repository"',
  'name="audit-issue"',
  'name="pain"',
  'name="authority"',
  'name="fixed-scope"',
  'name="ordinary-software"',
  'name="payment-terms"',
  "No contract, checkout, payment, or work starts before successful automated confirmation",
  "Confirm $149 fixed scope",
  "Copy order-note reference",
  "WrightOps fixed $149 scope is confirmed",
  "https://www.paypal.com/ncp/payment/H9VVRGRGA3DCG",
  "https://api.github.com",
  "/repos/${parsed.repository.owner}/${parsed.repository.repo}",
  "/repos/${AUDIT_REPO_OWNER}/${AUDIT_REPO_NAME}/issues/${parsed.auditIssue.number}",
  "comments?per_page=100",
  "application/vnd.github+json",
  "launch-verification",
  "excluded from demand metrics",
  "This report was automatically generated from one immutable public GitHub snapshot.",
  "Evidence score",
  "github-actions[bot]",
  'comment.user.type === "Bot"',
  'comment.performed_via_github_app.slug === "github-actions"',
  'comment.performed_via_github_app.owner.login === "github"',
  "navigator.clipboard.writeText(note)",
  "checkoutLink.href = PAYPAL_CHECKOUT_URL",
  "checkoutLink.removeAttribute(\"href\")",
  "scope before payment",
  "full purchase-price refund",
  "WrightOps absorbs that cost",
  "Start the free audit",
  "Already audited? Request $149 scope",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=audit-request.yml",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=fix-plan-request.yml",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/sample-fix-plan-claude-code.md",
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-fix-plan.md",
  "mailto:zach@zachwright.xyz?subject=WrightOps%20%24149%20fix%20plan%20scope%20request",
  "Email audited scope without GitHub",
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
  "Use the public GitHub form or business email",
  "Never include personal, private, credential, customer, wallet, or payment data",
  "does not create a contract or payment obligation",
  "Scope before payment",
  "full purchase price",
  "WrightOps absorbs any retained processor fee",
  "https://github.com/wrightops-ai/bounty-red-flag-card/issues/new?template=bounty-review.yml",
  "https://github.com/wrightops-ai/bounty-red-flag-card/blob/main/docs/sample-bounty-go-no-go-review.md",
  "https://github.com/wrightops-ai/bounty-red-flag-card/blob/main/docs/bounty-go-no-go-review.md",
  "mailto:zach@zachwright.xyz?subject=WrightOps%20%2449%20bounty%20review%20scope%20request",
  "Email scope without GitHub",
  "Run the free no-login check",
  'href="/coding-bounty-payout-checklist/"',
  'id="scope-builder"',
  'id="bounty-scope-builder"',
  'name="bounty-url"',
  'name="payout"',
  'name="deadline"',
  'name="uncertainty"',
  'name="authority"',
  "Build a non-binding $49 scope request",
  "Public HTTPS bounty or listing URL",
  "Primary uncertainty to resolve",
  "Open prefilled business email",
  "Copy scope request",
  "Nothing is uploaded or stored",
  'role="group"',
  "URL shape is checked locally",
  "WrightOps verifies public access after receipt",
  "ordinary-software review",
  "no work before written scope and provider-confirmed settled payment",
  "Prefer GitHub? Open the public request fallback",
  "navigator.clipboard.writeText(scopeText)",
  "window.location.href = buildMailto(scopeText)",
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
    instructionsStarterPage.includes(marker) ||
    instructionsStarterFile.includes(marker) ||
    fixPlanPage.includes(marker) ||
    bountyReviewPage.includes(marker) ||
    bountyChecklistPage.includes(marker) ||
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

const instructionsStarterUrl = "https://zachwright.xyz/agents-md-starter-template/";
if (!sitemap.includes(instructionsStarterUrl)) {
  failures.push("Sitemap is missing the free AGENTS.md starter template.");
}

if (!llms.includes(instructionsStarterUrl)) {
  failures.push("llms.txt is missing the free AGENTS.md starter template.");
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
    `Expected at least three $249 scope-builder CTAs; found ${instructionsScopeBuilderCtaCount}.`,
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
    failures.push(`The $249 scope builder must remain browser-local: ${marker}`);
  }
}

const bountyScopeBuilderCtaCount = (
  bountyReviewPage.match(/href="#scope-builder"/g) || []
).length;
if (bountyScopeBuilderCtaCount < 3) {
  failures.push(
    `Expected at least three $49 scope-builder CTAs; found ${bountyScopeBuilderCtaCount}.`,
  );
}

for (const marker of [
  "fetch(",
  "localStorage",
  "sessionStorage",
  "<form",
  'type="submit"',
  'scopeBuilder.addEventListener("submit"',
]) {
  if (bountyReviewPage.includes(marker)) {
    failures.push(`The $49 bounty scope builder must remain browser-local: ${marker}`);
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
if (auditPagePreflightCtaCount < 3) {
  failures.push(
    `Expected at least three dedicated $750 page routes to the no-login preflight; found ${auditPagePreflightCtaCount}.`,
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

const fixPlanScopeBuilderCtaCount = (
  fixPlanPage.match(/href="#scope-builder"/g) || []
).length;
if (fixPlanScopeBuilderCtaCount < 2) {
  failures.push(
    `Expected the Fix Plan offer to expose at least two self-serve confirmation paths; found ${fixPlanScopeBuilderCtaCount}.`,
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
  if (fixPlanPage.includes(marker)) {
    failures.push(`The Fix Plan checkout gate must not use unsafe browser behavior: ${marker}`);
  }
}

if (!fixPlanPage.includes('data-checkout-url="https://www.paypal.com/ncp/payment/H9VVRGRGA3DCG"')) {
  failures.push("The Fix Plan PayPal checkout must be present only as a gated data URL.");
}

if (
  !fixPlanPage.includes('aria-disabled="true"') ||
  !/id="paypal-checkout-panel"[\s\S]{0,80}hidden/.test(fixPlanPage)
) {
  failures.push("The Fix Plan PayPal checkout must start hidden and disabled.");
}

if (!fixPlanPage.includes("fetch(url, {")) {
  failures.push("The Fix Plan gate must use the centralized unauthenticated fetch wrapper.");
}

for (const marker of [
  '!url.port',
  '!url.pathname.includes("%")',
  'labels.includes("audit-request")',
  'startsWith("[Audit request]")',
  'issueBodySection(issueBody, "Public repository")',
  "AUTOMATED_REPORT_SENTENCE",
  '.slice(0, 140)',
]) {
  if (!fixPlanPage.includes(marker)) {
    failures.push(`The Fix Plan evidence gate is missing a strict verifier: ${marker}`);
  }
}

for (const looseMarker of [
  'combinedTextLower.includes("audit-request")',
  '"Agent-Ready Repository Audit",',
  '.slice(0, 500)',
]) {
  if (fixPlanPage.includes(looseMarker)) {
    failures.push(`The Fix Plan evidence gate still contains a loose verifier: ${looseMarker}`);
  }
}

if (
  !/\.scope-builder-status\s*\{[^}]*overflow-wrap:\s*anywhere;/s.test(auditCss)
) {
  failures.push("The Fix Plan status must wrap immutable evidence on narrow screens.");
}

if (
  !fixPlanPage.includes("cache: \"no-store\"") ||
  !fixPlanPage.includes("Accept: \"application/vnd.github+json\"")
) {
  failures.push("The Fix Plan gate must keep GitHub checks unauthenticated and no-store.");
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
  "agents-md-starter-template/index.html",
  "agents-md-starter-template/styles.css",
  "agents-md-starter-template/AGENTS.md",
  "agents-md-starter-template/builder.js",
  "agent-ready-fix-plan/index.html",
  "bounty-go-no-go-review/index.html",
  "coding-bounty-payout-checklist/index.html",
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
      instructionsStarterMarkers: requiredInstructionsStarterMarkers.length,
      instructionsBuilderScriptMarkers: requiredInstructionsBuilderScriptMarkers.length,
      instructionsBuilderForbiddenMarkers: forbiddenInstructionsBuilderScriptMarkers.length,
      instructionsBuilderPageForbiddenMarkers: forbiddenInstructionsStarterPageMarkers.length,
      instructionsBuilderCssMarkers: requiredInstructionsStarterCssMarkers.length,
      fixPlanPageMarkers: requiredFixPlanPageMarkers.length,
      bountyReviewPageMarkers: requiredBountyReviewPageMarkers.length,
      bountyChecklistMarkers: requiredBountyChecklistMarkers.length,
      bountyChecklistForbiddenMarkers: forbiddenBountyChecklistMarkers.length,
      costPageMarkers: requiredCostPageMarkers.length,
      costSampleMarkers: requiredCostSampleMarkers.length,
      forbiddenMarkers: forbiddenMarkers.length,
      auditCtas: auditCtaCount,
      preflightCtas: preflightCtaCount,
      auditScopeRequestCtas: auditScopeRequestCtaCount,
      auditTermsCtas: auditTermsCtaCount,
      publicAssets: 18,
    },
    null,
    2,
  ),
);
