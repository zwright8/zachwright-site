import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
} from "framer-motion";
import { useState, type FormEvent, type ReactNode } from "react";

import {
  RepositoryPreflightError,
  runRepositoryPreflight,
} from "./repoPreflight.mjs";
import type { PreflightCheck, PreflightResult } from "./repoPreflight.mjs";

const CONTACT_EMAIL = "zach@zachwright.xyz";
const GITHUB_ORG_URL = "https://github.com/wrightops-ai";
const AUDITOR_URL = "https://github.com/wrightops-ai/agent-ready-repo-auditor";
const AUDIT_REQUEST_URL =
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=audit-request.yml";
const HUMAN_AUDIT_REQUEST_URL =
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=human-audit-scope-request.yml";
const HUMAN_AUDIT_LANDING_URL = "/agent-ready-repository-audit/";
const HUMAN_AUDIT_TERMS_URL =
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-repository-audit.md";
const COST_SNAPSHOT_REQUEST_URL =
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=cost-reliability-snapshot-request.yml";
const COST_SNAPSHOT_LANDING_URL =
  "/ai-agent-cost-reliability-snapshot/";
const AUDITOR_RELEASE_URL =
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/releases/tag/v1.1.0";
const AUDITOR_CI_URL =
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/actions/runs/29484452275";
const FIX_PLAN_REQUEST_URL =
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=fix-plan-request.yml";
const FIX_PLAN_SAMPLE_URL =
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/sample-fix-plan-claude-code.md";
const FIX_PLAN_TERMS_URL =
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-fix-plan.md";
const FIX_PLAN_LANDING_URL = "/agent-ready-fix-plan/";
const INSTRUCTIONS_PR_REQUEST_URL =
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=instructions-pr-request.yml";
const INSTRUCTIONS_PR_LANDING_URL = "/agent-ready-instructions-pr/";
const INSTRUCTIONS_PR_TERMS_URL =
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/main/docs/agent-ready-instructions-pr.md";
const INSTRUCTIONS_PR_SAMPLE_URL =
  "https://github.com/wrightops-ai/bounty-red-flag-card/pull/1";
const BOUNTY_CARD_URL =
  "https://github.com/wrightops-ai/bounty-red-flag-card";
const BOUNTY_CARD_OPEN_URL =
  "https://github.com/wrightops-ai/bounty-red-flag-card/blob/main/bounty-red-flag-card/BOUNTY-RED-FLAG-CARD.md";
const BOUNTY_CARD_RELEASE_URL =
  "https://github.com/wrightops-ai/bounty-red-flag-card/releases/tag/v1.0.0";
const BOUNTY_REVIEW_REQUEST_URL =
  "https://github.com/wrightops-ai/bounty-red-flag-card/issues/new?template=bounty-review.yml";
const BOUNTY_REVIEW_LANDING_URL = "/bounty-go-no-go-review/";
const BOUNTY_CHECKLIST_URL = "/coding-bounty-payout-checklist/";
const BOUNTY_REVIEW_SAMPLE_URL =
  "https://github.com/wrightops-ai/bounty-red-flag-card/blob/main/docs/sample-bounty-go-no-go-review.md";
const BOUNTY_REVIEW_TERMS_URL =
  "https://github.com/wrightops-ai/bounty-red-flag-card/blob/main/docs/bounty-go-no-go-review.md";

const preflightCheckLabels = [
  "README and setup guidance",
  "Coding-agent instructions",
  "Runtime environment configuration",
  "Continuous integration",
  "Issue and pull-request templates",
  "Verification commands and automation",
  "Risky-action boundaries",
];

const engagementOptions = [
  {
    eyebrow: "Fastest paid step",
    title: "Agent-Ready Repo Fix Plan",
    price: "$149",
    timing: "One business day after scope confirmation",
    description:
      "Three prioritized fix cards for one public repository, each pinned to evidence and written so a maintainer or coding agent can execute it.",
    bullets: [
      "Exactly three blocker cards",
      "Evidence and immutable revision",
      "Smallest recommended change",
      "Executable acceptance check",
    ],
    primaryLabel: "See the $149 scope & sample",
    primaryHref: FIX_PLAN_LANDING_URL,
    secondaryLabel: "Inspect the complete sample",
    secondaryHref: FIX_PLAN_SAMPLE_URL,
    featured: false,
  },
  {
    eyebrow: "Founding implementation offer",
    title: "Agent-Ready Instructions PR",
    price: "$249",
    timing: "Private PayPal G&S checkout after written scope confirmation",
    description:
      "One focused pull request for one public repository, delivering exactly two repository-specific instruction files from public evidence.",
    bullets: [
      "Root AGENTS.md plus root CLAUDE.md or .github/copilot-instructions.md",
      "One public PR at a pinned revision with evidence, limits, and checks",
      "No application-code, CI, dependency, security, or deployment changes",
      "No review, merge, adoption, or outcome guarantee",
    ],
    primaryLabel: "See the $249 scope & proof",
    primaryHref: INSTRUCTIONS_PR_LANDING_URL,
    secondaryLabel: "Inspect the merged sample PR",
    secondaryHref: INSTRUCTIONS_PR_SAMPLE_URL,
    featured: true,
  },
  {
    eyebrow: "Deeper evidence",
    title: "Agent-Ready Repository Audit",
    price: "$750",
    timing: "Three business days after settled payment and complete public inputs",
    description:
      "A broader Markdown and JSON evidence package for teams that need a documented view of repository readiness before changing the repo.",
    bullets: [
      "One public GitHub repository",
      "Deterministic artifact checks",
      "Human-reviewed findings",
      "Inspect-ready delivery package",
    ],
    primaryLabel: "See the $750 scope & proof",
    primaryHref: HUMAN_AUDIT_LANDING_URL,
    secondaryLabel: "Review service terms",
    secondaryHref: HUMAN_AUDIT_TERMS_URL,
    featured: false,
  },
  {
    eyebrow: "Agent operations evidence",
    title: "AI Agent Cost & Reliability Snapshot",
    price: "$495",
    timing: "Three business days after settled payment and accepted prompt-free inputs",
    description:
      "Aggregate cost, completion, first-pass reliability, retries, latency, and evidence gaps for one workflow—without prompts, responses, or direct identifiers.",
    bullets: [
      "One workflow, up to 50 normalized attempts",
      "Deterministic JSON and Markdown",
      "Up to five human-reviewed priorities",
      "Thirty-minute readout and one factual correction round",
    ],
    primaryLabel: "See the $495 snapshot",
    primaryHref: COST_SNAPSHOT_LANDING_URL,
    secondaryLabel: "Request written scope",
    secondaryHref: COST_SNAPSHOT_REQUEST_URL,
    featured: false,
  },
];

const proofItems = [
  {
    label: "Public release",
    value: "v1.1.0",
    title: "Deterministic auditor",
    description:
      "Open-source Python and GitHub Action workflow with inspectable scoring rules and no repository code execution.",
    link: AUDITOR_RELEASE_URL,
    linkLabel: "Open release",
  },
  {
    label: "Hosted verification",
    value: "CI passed",
    title: "Fail-closed qualification",
    description:
      "The hosted workflow verifies completed audits before acknowledging a Fix Plan request and routing it to human scope review.",
    link: AUDITOR_CI_URL,
    linkLabel: "Inspect run",
  },
  {
    label: "Complete sample",
    value: "3 cards",
    title: "Pinned public evidence",
    description:
      "A demonstration Fix Plan shows the exact card structure, revision pinning, limitations, and acceptance checks.",
    link: FIX_PLAN_SAMPLE_URL,
    linkLabel: "Read sample",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Run the no-login preflight",
    text: "Paste one public repository. Your browser checks seven evidence categories without cloning, executing code, or storing the submitted URL with WrightOps.",
  },
  {
    number: "02",
    title: "Submit one scoped repository",
    text: "Share the public repository URL, completed audit evidence, and the outcome you want. Never send credentials or private code.",
  },
  {
    number: "03",
    title: "Confirm scope before payment",
    text: "WrightOps confirms fit, exclusions, delivery timing, and acceptance criteria in writing before inviting payment.",
  },
  {
    number: "04",
    title: "Receive inspectable work",
    text: "The delivery is pinned to public evidence and includes explicit limits. Missing evidence stays missing instead of becoming a guess.",
  },
];

const boundaries = [
  "Public GitHub repositories only",
  "No credentials, secrets, or private code",
  "No production or deployment access",
  "No vulnerability research",
  "Not a security, legal, privacy, or compliance audit",
  "No guaranteed score, merge, adoption, or business outcome",
];

const faqs = [
  {
    question: "Why start with the free audit?",
    answer:
      "It creates a shared evidence baseline before money changes hands. That makes the paid scope smaller, easier to verify, and less dependent on opinion.",
  },
  {
    question: "When should I use the $149 Fix Plan?",
    answer:
      "Use it when the automated audit found gaps but you need a human-reviewed order of operations. You receive exactly three cards, not implementation.",
  },
  {
    question: "Do I pay before scope is confirmed?",
    answer:
      "No. Submit the public scope request first. For the $249 Instructions PR, WrightOps sends a private, dedicated PayPal Goods & Services checkout only after confirming the repository, deliverable, exclusions, and timing in writing.",
  },
  {
    question: "What happens if the agreed work cannot be delivered?",
    answer:
      "WrightOps does not retain payment for work it cannot fulfill under the agreed scope. If the scoped Agent-Ready Instructions PR cannot be delivered, the full purchase price is refunded.",
  },
  {
    question: "Who is accountable for the work?",
    answer:
      "WrightOps is AI-operated on behalf of Zachary Wright. Zachary remains the accountable human owner for scope, payment, delivery, and refund decisions.",
  },
  {
    question: "What is the $49 Bounty GO/NO-GO Review?",
    answer:
      "It is an evidence-backed review of exactly one public bounty or listing. After written scope confirmation and payment, WrightOps delivers a GO, HOLD, or NO-GO recommendation within one business day. It does not guarantee a payout or replace professional advice.",
  },
];

function Arrow({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={className}>
      ↗
    </span>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      transition={{ delay, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-72px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </m.div>
  );
}

function ExternalLink({
  children,
  className = "",
  href,
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <a className={className} href={href}>
      {children}
    </a>
  );
}

function PrimaryAction({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <ExternalLink className="primary-action" href={href}>
      <span>{children}</span>
      <Arrow />
    </ExternalLink>
  );
}

function SecondaryAction({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <ExternalLink className="secondary-action" href={href}>
      <span>{children}</span>
      <Arrow />
    </ExternalLink>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: ReactNode;
  text: string;
}) {
  return (
    <Reveal className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <p>{text}</p>
    </Reveal>
  );
}

function Navbar() {
  return (
    <header className="site-header">
      <nav aria-label="Primary navigation" className="site-nav">
        <a aria-label="WrightOps home" className="brand-lockup" href="#top">
          <span className="brand-mark">W</span>
          <span>
            <strong>WrightOps</strong>
            <small>Public-repository engineering</small>
          </span>
        </a>

        <div className="nav-links">
          <a href="#offers">Offers</a>
          <a href="#bounty-review">Bounty review</a>
          <a href="#proof">Proof</a>
          <a href="#faq">FAQ</a>
        </div>

        <ExternalLink className="nav-action" href="#preflight">
          Check a repository <Arrow />
        </ExternalLink>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-texture" />
      <div className="hero-grid site-shell">
        <m.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">WrightOps / evidence before automation</p>
          <h1>
            Make your repository easier for coding agents to{" "}
            <span>finish.</span>
          </h1>
          <p className="hero-lede">
            WrightOps turns public-repository friction into inspectable work:
            a free audit, fixed-price plans, and a scoped instructions PR with
            acceptance criteria.
          </p>

          <div className="hero-actions">
            <PrimaryAction href="#preflight">
              Run the no-login preflight
            </PrimaryAction>
            <a className="text-action" href="#offers">
              See the $249 Instructions PR <span aria-hidden="true">↓</span>
            </a>
          </div>

          <ul className="scope-pills" aria-label="Service boundaries" role="list">
            <li>Public repos only</li>
            <li>No secrets</li>
            <li>Scope before payment</li>
          </ul>

          <p className="accountability-note">
            <span aria-hidden="true" />
            AI-operated on behalf of Zachary Wright, the accountable human
            owner.
          </p>
        </m.div>

        <m.aside
          aria-label="Sample Fix Plan format"
          className="sample-panel"
          initial={{ opacity: 0, scale: 0.97, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            delay: 0.12,
            duration: 0.72,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="sample-panel-head">
            <div>
              <p>Sample output</p>
              <strong>Agent-Ready Repo Fix Plan</strong>
            </div>
            <span>3 cards</span>
          </div>

          <div className="sample-revision">
            <span>Immutable revision</span>
            <code>c39cb0f…</code>
          </div>

          <ol className="sample-cards">
            <li>
              <span>01</span>
              <div>
                <strong>Add repository-specific agent instructions</strong>
                <small>Evidence · change path · acceptance check</small>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>State the public configuration boundary</strong>
                <small>Missing evidence stays explicit</small>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Define approval gates for risky actions</strong>
                <small>Limits and authorization are part of delivery</small>
              </div>
            </li>
          </ol>

          <ExternalLink className="panel-link" href={FIX_PLAN_SAMPLE_URL}>
            Inspect the complete public sample <Arrow />
          </ExternalLink>
        </m.aside>
      </div>
    </section>
  );
}

function preflightBandLabel(band: PreflightResult["score"]["band"]) {
  return {
    limited_public_evidence: "Limited public evidence",
    partially_evidenced: "Partially evidenced",
    well_evidenced: "Well evidenced",
  }[band];
}

function preflightStatusLabel(status: PreflightCheck["status"]) {
  return {
    met: "Met",
    not_evidenced: "Not evidenced",
    partial: "Partial",
  }[status];
}

function instructionsRequestUrl(result: PreflightResult) {
  const url = new URL(INSTRUCTIONS_PR_REQUEST_URL);
  url.searchParams.set(
    "title",
    `[Instructions PR request] ${result.repository.fullName}`,
  );
  return url.toString();
}

function preflightEvidence(result: PreflightResult) {
  return [
    "WrightOps no-login repository preflight",
    `Repository: ${result.repository.webUrl}`,
    `Immutable revision: ${result.repository.revisionSha}`,
    `Evidence score: ${result.score.earned}/${result.score.maximum} (${result.score.percentage}%)`,
    `Band: ${preflightBandLabel(result.score.band)}`,
    "Source: https://zachwright.xyz/#preflight",
  ].join("\n");
}

function RepositoryPreflight() {
  const [repository, setRepository] = useState("");
  const [result, setResult] = useState<PreflightResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setCopyState("idle");
    setIsLoading(true);
    try {
      setResult(await runRepositoryPreflight(repository));
    } catch (caught) {
      setError(
        caught instanceof RepositoryPreflightError
          ? caught.message
          : "The preflight could not complete. No partial result was emitted.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function copyEvidence() {
    if (!result) {
      return;
    }
    try {
      await navigator.clipboard.writeText(preflightEvidence(result));
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  const check = (id: string) =>
    result?.checks.find((item) => item.id === id);
  const instructions = check("agent_instructions");
  const readme = check("readme_setup");
  const verification = check("verification");
  const instructionsPrFit =
    result &&
    !result.repository.archived &&
    instructions?.score === 0 &&
    (readme?.score ?? 0) >= 8 &&
    (verification?.score ?? 0) >= 8;

  return (
    <section className="preflight-section" id="preflight">
      <div className="preflight-shell site-shell">
        <Reveal className="preflight-intro">
          <div>
            <p className="eyebrow">No-login quick preflight</p>
            <h2>Paste one public GitHub repository.</h2>
          </div>
          <p>
            See the public evidence a coding agent can actually use before you
            buy anything. The scan runs in your browser through GitHub’s public
            API—no account, clone, code execution, or WrightOps data storage.
          </p>
        </Reveal>

        <form className="preflight-form" onSubmit={handleSubmit}>
          <label htmlFor="repository-url">Public repository</label>
          <div className="preflight-input-row">
            <input
              aria-describedby="preflight-help"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              id="repository-url"
              name="repository"
              onChange={(event) => setRepository(event.target.value)}
              placeholder="github.com/owner/repository"
              spellCheck={false}
              type="text"
              value={repository}
            />
            <button disabled={isLoading} type="submit">
              {isLoading ? "Reading public evidence…" : "Run 7 checks"}
              {!isLoading && <Arrow />}
            </button>
          </div>
          <p id="preflight-help">
            Public default branch only · 15-second request timeout · GitHub’s
            unauthenticated API limit applies
          </p>
        </form>

        <div aria-atomic="true" aria-live="polite" className="preflight-live">
          {error && (
            <m.div
              animate={{ opacity: 1, y: 0 }}
              className="preflight-error"
              initial={{ opacity: 0, y: 8 }}
              role="alert"
            >
              <strong>Preflight stopped.</strong>
              <p>{error}</p>
              <ExternalLink href={AUDIT_REQUEST_URL}>
                Use the full free auditor instead <Arrow />
              </ExternalLink>
            </m.div>
          )}

          {!result && !error && (
            <div className="preflight-empty">
              <p>Seven evidence categories. One immutable revision.</p>
              <ol>
                {preflightCheckLabels.map((label, index) => (
                  <li key={label}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {label}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {result && (
            <m.div
              animate={{ opacity: 1, y: 0 }}
              className="preflight-result"
              initial={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="preflight-result-head">
                <div>
                  <p className="eyebrow">Immutable public snapshot</p>
                  <ExternalLink href={result.repository.webUrl}>
                    {result.repository.fullName} <Arrow />
                  </ExternalLink>
                  <code>{result.repository.revisionSha}</code>
                </div>
                <div className={`preflight-score ${result.score.band}`}>
                  <strong>{result.score.percentage}</strong>
                  <span>
                    {result.score.earned}/{result.score.maximum}
                  </span>
                  <small>{preflightBandLabel(result.score.band)}</small>
                </div>
              </div>

              <ol className="preflight-results-list">
                {result.checks.map((item, index) => (
                  <li className={item.status} key={item.id}>
                    <span className="preflight-result-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="preflight-result-title">
                        <h3>{item.label}</h3>
                        <span>{preflightStatusLabel(item.status)}</span>
                      </div>
                      <p>{item.summary}</p>
                      {item.evidence[0] && (
                        <ExternalLink href={item.evidence[0].sourceUrl}>
                          View immutable evidence <Arrow />
                        </ExternalLink>
                      )}
                    </div>
                    <strong>
                      {item.score}/{item.maxScore}
                    </strong>
                  </li>
                ))}
              </ol>

              {result.inspectionWarnings.length > 0 && (
                <div className="preflight-warning">
                  <strong>Inspection limits</strong>
                  <ul>
                    {result.inspectionWarnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="preflight-conversion">
                <div>
                  <p className="eyebrow">
                    {instructionsPrFit
                      ? "Qualified implementation gap"
                      : "Preserve the evidence"}
                  </p>
                  <h3>
                    {instructionsPrFit
                      ? "No recognized coding-agent instructions were evidenced."
                      : "Use the full auditor for a persistent public report."}
                  </h3>
                  <p>
                    {instructionsPrFit
                      ? "Public setup and verification evidence exists, so this repository may fit the fixed $249 two-file Instructions PR after written scope confirmation."
                      : "The browser result is a quick preflight. The GitHub Action produces the durable Markdown and JSON evidence required for deeper paid work."}
                  </p>
                </div>
                <div className="preflight-actions">
                  {instructionsPrFit ? (
                    <PrimaryAction href={instructionsRequestUrl(result)}>
                      Request $249 scope
                    </PrimaryAction>
                  ) : (
                    <PrimaryAction href={AUDIT_REQUEST_URL}>
                      Run the full free audit
                    </PrimaryAction>
                  )}
                  <button className="secondary-action" onClick={copyEvidence} type="button">
                    {copyState === "copied"
                      ? "Evidence copied"
                      : copyState === "failed"
                        ? "Select the SHA above"
                        : "Copy preflight evidence"}
                  </button>
                  {instructionsPrFit && (
                    <ExternalLink
                      className="preflight-terms-link"
                      href={INSTRUCTIONS_PR_TERMS_URL}
                    >
                      Review exact scope and refund terms <Arrow />
                    </ExternalLink>
                  )}
                </div>
              </div>

              <p className="preflight-limit">
                {result.limitations.join(" ")}
              </p>
            </m.div>
          )}
        </div>
      </div>
    </section>
  );
}

function Offers() {
  return (
    <section className="content-section" id="offers">
      <div className="site-shell">
        <SectionHeading
          eyebrow="Engagement options"
          title={
            <>
              Buy the smallest useful <span>next step.</span>
            </>
          }
          text="Every paid engagement begins with written scope and public evidence. The $149 Fix Plan is the fastest way to turn an audit into executable decisions."
        />

        <div className="offer-grid">
          {engagementOptions.map((offer, index) => (
            <Reveal
              className={`offer-card ${offer.featured ? "featured" : ""}`}
              delay={index * 0.06}
              key={offer.title}
            >
              {offer.featured && (
                <span className="featured-label">Recommended first paid step</span>
              )}
              <p className="eyebrow">{offer.eyebrow}</p>
              <div className="offer-title-row">
                <h3>{offer.title}</h3>
                <strong>{offer.price}</strong>
              </div>
              <p className="offer-timing">{offer.timing}</p>
              <p className="offer-description">{offer.description}</p>
              <ul>
                {offer.bullets.map((bullet) => (
                  <li key={bullet}>
                    <span aria-hidden="true">✓</span>
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="offer-actions">
                <PrimaryAction href={offer.primaryHref}>
                  {offer.primaryLabel}
                </PrimaryAction>
                <SecondaryAction href={offer.secondaryHref}>
                  {offer.secondaryLabel}
                </SecondaryAction>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="payment-note">
          The $249 Instructions PR uses a private, dedicated PayPal Goods
          &amp; Services checkout sent only after written scope confirmation.
          If WrightOps cannot deliver the scoped PR, the full purchase price is
          refunded. Never use Friends and Family for WrightOps work.
        </p>
      </div>
    </section>
  );
}

function BountyReview() {
  return (
    <section className="bounty-section" id="bounty-review">
      <div className="site-shell">
        <SectionHeading
          eyebrow="Bounty triage"
          title={
            <>
              Decide before you spend the <span>time.</span>
            </>
          }
          text="Screen the public evidence first. Start with the free Bounty Red-Flag Card, then request a bounded review when the payout decision needs a second set of eyes."
        />

        <div className="bounty-funnel">
          <Reveal className="bounty-free-card">
            <div>
              <p className="eyebrow">Free decision aid</p>
              <h3>Bounty Red-Flag Card</h3>
              <p>
                Check funding, payout authority, competition, delivery terms,
                and other early warning signs before committing work to a
                public bounty or listing.
              </p>
            </div>

            <ul aria-label="Red-Flag Card checks">
              <li>
                <span aria-hidden="true">01</span>
                Funding and payout evidence
              </li>
              <li>
                <span aria-hidden="true">02</span>
                Claim, review, and acceptance authority
              </li>
              <li>
                <span aria-hidden="true">03</span>
                Competition, delivery, and dispute risk
              </li>
            </ul>

            <div className="bounty-actions">
              <PrimaryAction href={BOUNTY_CARD_OPEN_URL}>
                Open the free card
              </PrimaryAction>
              <SecondaryAction href={BOUNTY_CARD_RELEASE_URL}>
                Get the v1.0.0 release
              </SecondaryAction>
            </div>
          </Reveal>

          <Reveal className="bounty-paid-card" delay={0.06}>
            <div className="bounty-price-row">
              <p className="eyebrow">Bounded paid review</p>
              <strong>$49</strong>
            </div>
            <h3>Bounty GO/NO-GO Review</h3>
            <p>
              WrightOps reviews exactly one public bounty or listing and
              returns an evidence-backed GO, HOLD, or NO-GO recommendation
              within one business day after written scope confirmation and
              payment.
            </p>
            <ul>
              <li>Public evidence only</li>
              <li>No secrets, private code, or private data</li>
              <li>No guaranteed payout or professional advice</li>
            </ul>
            <div className="bounty-actions">
              <PrimaryAction href={BOUNTY_REVIEW_LANDING_URL}>
                See the $49 scope &amp; sample
              </PrimaryAction>
              <SecondaryAction href={BOUNTY_CHECKLIST_URL}>
                Run the free payout checklist
              </SecondaryAction>
            </div>
            <p className="bounty-intake-note">
              No GitHub account is required on the full page: choose the public
              form or the WrightOps business-email path. Review the{" "}
              <ExternalLink href={BOUNTY_REVIEW_TERMS_URL}>
                service and refund terms
              </ExternalLink>{" "}
              before requesting scope.
            </p>
          </Reveal>
        </div>

        <p className="bounty-disclaimer">
          The free card and paid review are decision aids based on public
          evidence. They are not legal, tax, financial, investment, security,
          or other professional advice, and no payout or business outcome is
          guaranteed.
        </p>
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section className="content-section proof-section" id="proof">
      <div className="site-shell">
        <SectionHeading
          eyebrow="Inspect before you buy"
          title={
            <>
              Proof lives in public <span>artifacts.</span>
            </>
          }
          text="No customer logos, invented outcomes, or hidden methodology. Review the tool, hosted verification, and exact sample delivery yourself."
        />

        <div className="proof-grid">
          {proofItems.map((item, index) => (
            <Reveal className="proof-card" delay={index * 0.06} key={item.title}>
              <div className="proof-card-top">
                <p>{item.label}</p>
                <strong>{item.value}</strong>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ExternalLink className="panel-link" href={item.link}>
                {item.linkLabel} <Arrow />
              </ExternalLink>
            </Reveal>
          ))}
        </div>

        <Reveal className="proof-statement">
          <p className="eyebrow">Operating principle</p>
          <blockquote>
            “If the public repository does not prove it, the delivery says it
            is unknown.”
          </blockquote>
          <p>
            That boundary applies to commands, configuration, approvals,
            deployment access, and every other fact a coding agent would need.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="content-section" id="process">
      <div className="site-shell">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              Evidence first. Scope second. <span>Payment third.</span>
            </>
          }
          text="The workflow is deliberately boring: one public target, one agreed deliverable, and checks that make completion easy to judge."
        />

        <ol className="process-list">
          {processSteps.map((step, index) => (
            <m.li
              initial={{ opacity: 0, x: -18 }}
              key={step.number}
              transition={{
                delay: index * 0.05,
                duration: 0.56,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true, margin: "-64px" }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </m.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Boundaries() {
  return (
    <section className="boundary-section">
      <div className="boundary-grid site-shell">
        <Reveal>
          <p className="eyebrow">Clear boundaries</p>
          <h2>
            Know exactly what WrightOps <span>will not do.</span>
          </h2>
          <p>
            These limits protect the buyer, the repository, and the quality of
            the evidence. Out-of-scope requests are declined before payment.
          </p>
        </Reveal>

        <Reveal className="boundary-list">
          {boundaries.map((boundary) => (
            <div key={boundary}>
              <span aria-hidden="true">—</span>
              <p>{boundary}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="content-section" id="faq">
      <div className="site-shell">
        <SectionHeading
          eyebrow="Before you start"
          title={
            <>
              Questions with direct <span>answers.</span>
            </>
          }
          text="If the repository or request falls outside these answers, email before opening a paid scope."
        />

        <div className="faq-list">
          {faqs.map((item, index) => (
            <Reveal className="faq-item" delay={index * 0.04} key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta">
      <div className="final-cta-texture" />
      <Reveal className="final-cta-inner site-shell">
        <p className="eyebrow">One public repository</p>
        <h2>
          Start with proof. Pay only after the scope is{" "}
          <span>clear.</span>
        </h2>
        <p>
          Run the no-login preflight now. If public evidence supports a paid
          next step, WrightOps confirms the exact scope before payment.
        </p>
        <div className="hero-actions">
          <PrimaryAction href="#preflight">
            Check a public repository
          </PrimaryAction>
          <SecondaryAction href={INSTRUCTIONS_PR_LANDING_URL}>
            See the $249 scope &amp; proof
          </SecondaryAction>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-grid site-shell">
        <div>
          <a className="brand-lockup" href="#top">
            <span className="brand-mark">W</span>
            <span>
              <strong>WrightOps</strong>
              <small>Evidence before automation</small>
            </span>
          </a>
          <p className="footer-description">
            AI-operated public-repository engineering with a human-accountable
            owner.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <strong>Start</strong>
            <ExternalLink href={AUDIT_REQUEST_URL}>Free audit request</ExternalLink>
            <ExternalLink href={HUMAN_AUDIT_REQUEST_URL}>
              Human-reviewed audit scope
            </ExternalLink>
            <ExternalLink href={AUDITOR_URL}>Inspect the auditor</ExternalLink>
            <ExternalLink href={FIX_PLAN_REQUEST_URL}>Fix Plan request</ExternalLink>
            <ExternalLink href={INSTRUCTIONS_PR_REQUEST_URL}>
              Instructions PR request
            </ExternalLink>
            <ExternalLink href={BOUNTY_REVIEW_REQUEST_URL}>
              Bounty review request
            </ExternalLink>
          </div>
          <div>
            <strong>Verify</strong>
            <ExternalLink href={GITHUB_ORG_URL}>WrightOps on GitHub</ExternalLink>
            <ExternalLink href={AUDITOR_RELEASE_URL}>Public release</ExternalLink>
            <ExternalLink href={AUDITOR_CI_URL}>Hosted CI run</ExternalLink>
            <a href="/agents-md-vs-claude-md/">AGENTS.md file guide</a>
            <a href={BOUNTY_CHECKLIST_URL}>Coding bounty payout checklist</a>
            <ExternalLink href={INSTRUCTIONS_PR_TERMS_URL}>
              Instructions PR terms
            </ExternalLink>
            <ExternalLink href={HUMAN_AUDIT_TERMS_URL}>
              Human-reviewed audit terms
            </ExternalLink>
            <ExternalLink href={INSTRUCTIONS_PR_SAMPLE_URL}>
              Instructions PR sample
            </ExternalLink>
            <ExternalLink href={BOUNTY_CARD_URL}>Bounty Red-Flag Card</ExternalLink>
          </div>
          <div>
            <strong>Contact</strong>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <ExternalLink href={FIX_PLAN_SAMPLE_URL}>Sample Fix Plan</ExternalLink>
            <ExternalLink href={FIX_PLAN_TERMS_URL}>Fix Plan terms</ExternalLink>
            <ExternalLink href={BOUNTY_REVIEW_SAMPLE_URL}>
              Sample bounty review
            </ExternalLink>
            <ExternalLink href={BOUNTY_REVIEW_TERMS_URL}>
              Bounty review terms
            </ExternalLink>
            <a href="#offers">Offers</a>
            <a href="#faq">FAQ</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom site-shell">
        <span>© 2026 WrightOps</span>
        <span>Public repositories only · No secrets · No production access</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          <Hero />
          <RepositoryPreflight />
          <Offers />
          <BountyReview />
          <Proof />
          <Process />
          <Boundaries />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
      </LazyMotion>
    </MotionConfig>
  );
}
