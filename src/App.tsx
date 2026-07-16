import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
} from "framer-motion";
import type { ReactNode } from "react";

const CONTACT_EMAIL = "zach@zachwright.xyz";
const GITHUB_ORG_URL = "https://github.com/wrightops-ai";
const AUDITOR_URL = "https://github.com/wrightops-ai/agent-ready-repo-auditor";
const AUDIT_REQUEST_URL =
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=audit-request.yml";
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
const FIX_PLAN_CHECKOUT_URL =
  "https://www.paypal.com/ncp/payment/H9VVRGRGA3DCG";
const INSTRUCTIONS_PR_REQUEST_URL =
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=instructions-pr-request.yml";
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
const BOUNTY_REVIEW_SAMPLE_URL =
  "https://github.com/wrightops-ai/bounty-red-flag-card/blob/main/docs/sample-bounty-go-no-go-review.md";
const BOUNTY_REVIEW_TERMS_URL =
  "https://github.com/wrightops-ai/bounty-red-flag-card/blob/main/docs/bounty-go-no-go-review.md";

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
    primaryLabel: "Request scope confirmation",
    primaryHref: FIX_PLAN_REQUEST_URL,
    secondaryLabel: "Scope confirmed? Pay $149",
    secondaryHref: FIX_PLAN_CHECKOUT_URL,
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
      "Root AGENTS.md and .github/copilot-instructions.md",
      "One public PR at a pinned revision with evidence, limits, and checks",
      "No application-code, CI, dependency, security, or deployment changes",
      "No review, merge, adoption, or outcome guarantee",
    ],
    primaryLabel: "Request written scope",
    primaryHref: INSTRUCTIONS_PR_REQUEST_URL,
    secondaryLabel: "Inspect the merged sample PR",
    secondaryHref: INSTRUCTIONS_PR_SAMPLE_URL,
    featured: true,
  },
  {
    eyebrow: "Deeper evidence",
    title: "Agent-Ready Repository Audit",
    price: "$750",
    timing: "Three-business-day delivery",
    description:
      "A broader Markdown and JSON evidence package for teams that need a documented view of repository readiness before changing the repo.",
    bullets: [
      "One public GitHub repository",
      "Deterministic artifact checks",
      "Human-reviewed findings",
      "Inspect-ready delivery package",
    ],
    primaryLabel: "Scope the audit",
    primaryHref: `mailto:${CONTACT_EMAIL}?subject=Agent-Ready%20Repository%20Audit`,
    secondaryLabel: "Inspect the free auditor",
    secondaryHref: AUDITOR_URL,
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
    title: "Run the free audit",
    text: "Start with the public tool. It checks seven repository artifacts without cloning or executing repository code.",
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

        <ExternalLink className="nav-action" href={AUDIT_REQUEST_URL}>
          Request free audit <Arrow />
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
            <PrimaryAction href={AUDIT_REQUEST_URL}>
              Request the free audit
            </PrimaryAction>
            <a className="text-action" href="#offers">
              See the $149 Fix Plan <span aria-hidden="true">↓</span>
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

function EntryPoint() {
  return (
    <section className="entry-section">
      <div className="site-shell">
        <Reveal className="entry-card">
          <div>
            <p className="eyebrow">Start without buying</p>
            <h2>Get the evidence baseline first.</h2>
            <p>
              The free auditor checks recognized repository artifacts through
              the public GitHub API. It does not clone the repository, execute
              its code, or turn missing evidence into a claim.
            </p>
          </div>
          <dl className="entry-meta">
            <div>
              <dt>public artifact checks</dt>
              <dd>7</dd>
            </div>
            <div>
              <dt>to run the audit</dt>
              <dd>$0</dd>
            </div>
            <div>
              <dt>delivery formats</dt>
              <dd>2</dd>
            </div>
          </dl>
          <PrimaryAction href={AUDIT_REQUEST_URL}>
            Request the free audit
          </PrimaryAction>
        </Reveal>
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
              <PrimaryAction href={BOUNTY_REVIEW_REQUEST_URL}>
                Open public GitHub request
              </PrimaryAction>
              <SecondaryAction href={BOUNTY_REVIEW_SAMPLE_URL}>
                View sample report
              </SecondaryAction>
            </div>
            <p className="bounty-intake-note">
              GitHub sign-in is required to submit. Review the{" "}
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
          Request the free audit now, or submit a completed audit for a $149
          three-card Fix Plan.
        </p>
        <div className="hero-actions">
          <PrimaryAction href={AUDIT_REQUEST_URL}>
            Request the free audit
          </PrimaryAction>
          <SecondaryAction href={FIX_PLAN_REQUEST_URL}>
            Request the $149 Fix Plan
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
            <ExternalLink href={INSTRUCTIONS_PR_TERMS_URL}>
              Instructions PR terms
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
          <EntryPoint />
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
