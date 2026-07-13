import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
} from "framer-motion";
import { type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import updatesIndex from "../updates/index.json";

const HERO_IMAGE = "/assets/hero-material-1200.webp";
const HERO_IMAGE_SRCSET =
  "/assets/hero-material-720.webp 720w, /assets/hero-material-1200.webp 1200w, /assets/hero-material-1800.webp 1800w";

const CONTACT_EMAIL = "zach@zachwright.xyz";
const CAL_URL = "https://cal.com/zachary-wright-l9sdgm/30min";
const GITHUB_URL = "https://github.com/zwright8";
const SITE_REPO_URL = "https://github.com/zwright8/zachwright-site";
const PRODUCT_URL = `${SITE_REPO_URL}/tree/main/products/ai-operator-kit`;
const DASHBOARD_URL = "/dashboard.html";
const UPDATES_URL = "/updates/index.html";

const roles = ["AI Systems Engineer", "Product Engineer", "Frontend Builder", "Automation Operator"];

type UpdateEntry = {
  date: string;
  slug: string;
  title: string;
  url: string;
  preview: string;
};

const latestJournalEntries = (updatesIndex as UpdateEntry[]).slice(0, 4);
const journalEntryCount = (updatesIndex as UpdateEntry[]).length;

const updateDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

const proofSurfaces = [
  {
    title: "AI Operator Kit",
    cta: "Inspect product files",
    href: PRODUCT_URL,
    kind: "Artifact package",
    summary: "A repo-visible product package with tiers, fulfillment files, policy docs, and operating templates.",
    evidence: [
      ["Repo path", "products/ai-operator-kit"],
      ["Artifacts", "README, fulfillment files, policy docs"],
      ["Signal", "Product packaging is inspectable"],
    ],
    span: "md:col-span-7",
    ratio: "min-h-[28rem] md:min-h-[30rem] lg:min-h-0 lg:aspect-[1.18/1]",
  },
  {
    title: "Daily Drop Archive",
    cta: "Read dated technical notes",
    href: UPDATES_URL,
    kind: "Archive",
    summary: "A dated archive of AI-era engineering notes with source links and concrete operating takeaways.",
    evidence: [
      ["Route", "/updates/index.html"],
      ["Source", "updates/index.json"],
      ["Depth", `${journalEntryCount} dated drops`],
    ],
    span: "md:col-span-5",
    ratio: "min-h-[28rem] md:min-h-[30rem] lg:min-h-0 lg:aspect-[0.86/1]",
  },
  {
    title: "Operations Dashboard",
    cta: "Open dashboard",
    href: DASHBOARD_URL,
    kind: "Dashboard",
    summary: "A site-owned dashboard surface for checking the portfolio's data presentation and supporting assets.",
    evidence: [
      ["Route", "/dashboard.html"],
      ["Data", "dashboard-data.json"],
      ["Signal", "Static telemetry surface"],
    ],
    span: "md:col-span-5",
    ratio: "min-h-[28rem] md:min-h-[30rem] lg:min-h-0 lg:aspect-[0.86/1]",
  },
  {
    title: "GitHub Implementation Trail",
    cta: "View repository work",
    href: GITHUB_URL,
    kind: "Code record",
    summary: "Public code history for inspecting how the site and related software work are actually built.",
    evidence: [
      ["Repository", "zwright8/zachwright-site"],
      ["Checks", "build, smoke, newsletter scripts"],
      ["Signal", "Work history is public"],
    ],
    span: "md:col-span-7",
    ratio: "min-h-[28rem] md:min-h-[30rem] lg:min-h-0 lg:aspect-[1.18/1]",
  },
];

const engineeringSignals = [
  {
    kind: "Deploy confidence",
    title: "Protected previews fail loudly",
    summary:
      "The preview smoke check detects Vercel protection states and returns a specific bypass-secret diagnostic instead of a false-green deploy check.",
    cta: "Inspect preview smoke",
    href: `${SITE_REPO_URL}/blob/main/scripts/preview-smoke-check.js`,
  },
  {
    kind: "Build architecture",
    title: "Static proof surfaces ship with the React app",
    summary:
      "The Vite build copies product, update, research, asset, and dashboard surfaces into the production artifact so the portfolio remains inspectable after deploy.",
    cta: "Inspect build hook",
    href: `${SITE_REPO_URL}/blob/main/vite.config.ts`,
  },
  {
    kind: "Content pipeline",
    title: "Newsletter routes stay smoke-tested",
    summary:
      "The newsletter check loads every route module and validates callable handler exports before update or Daily Drop work is treated as safe.",
    cta: "Inspect newsletter check",
    href: `${SITE_REPO_URL}/blob/main/scripts/newsletter-smoke-check.js`,
  },
];

const socialLinks = [
  ["Email Zach", `mailto:${CONTACT_EMAIL}?subject=AI%20strategy%20inquiry`],
  ["Read Daily Drop archive", UPDATES_URL],
  ["Inspect AI Operator Kit files", PRODUCT_URL],
  ["View GitHub work", GITHUB_URL],
  ["Book 30-min call", CAL_URL],
];

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.25 11.75 11.5 4.5m0 0H5.75m5.75 0v5.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function scrollToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
  const target = document.getElementById(id);
  if (!target) {
    return;
  }

  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}

function formatUpdateDate(date: string) {
  const parsed = new Date(`${date}T00:00:00Z`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return updateDateFormatter.format(parsed);
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("home");
  const lastScrollY = useRef(0);
  const links = [
    ["Home", "home"],
    ["Proof", "work"],
    ["Updates", "journal"],
  ];

  useEffect(() => {
    lastScrollY.current = Math.max(window.scrollY, 0);

    const update = () => {
      const currentY = Math.max(window.scrollY, 0);
      const delta = currentY - lastScrollY.current;
      setScrolled(currentY > 100);

      if (currentY <= 80 || delta < -8) {
        setHidden(false);
      } else if (delta > 8 && currentY > 80) {
        setHidden(true);
      }

      lastScrollY.current = currentY;

      let current = "home";
      for (const id of ["home", "work", "journal"]) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top < window.innerHeight * 0.38) {
          current = id;
        }
      }
      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4 transition-[opacity,transform] duration-300 ease-out md:pt-6 ${
        hidden ? "pointer-events-none -translate-y-[calc(100%+2rem)] opacity-0" : "translate-y-0 opacity-100"
      }`}
      onFocus={() => setHidden(false)}
    >
      <div
        className={`inline-flex items-center rounded-full border border-white/10 bg-surface px-2 py-2 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? "shadow-md shadow-black/10" : ""
        }`}
      >
        <a
          aria-label="Zach Wright home"
          className="group grid h-9 w-9 place-items-center rounded-full p-[2px] transition-transform duration-300 hover:scale-110"
          href="#home"
          onClick={(event) => scrollToSection(event, "home")}
        >
          <span className="accent-gradient grid h-full w-full place-items-center rounded-full p-[2px] group-hover:bg-[linear-gradient(90deg,#4E85BF_0%,#89AACC_100%)]">
            <span className="grid h-full w-full place-items-center rounded-full bg-bg font-display text-[13px] italic leading-none text-text-primary">
              ZW
            </span>
          </span>
        </a>

        <div className="mx-1 hidden h-5 w-px bg-stroke sm:block" />

        <div className="flex items-center">
          {links.map(([label, id]) => (
            <a
              key={id}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors duration-200 sm:px-4 sm:py-2 sm:text-sm ${
                active === id
                  ? "bg-stroke/50 text-text-primary"
                  : "text-muted hover:bg-stroke/50 hover:text-text-primary"
              }`}
              href={`#${id}`}
              onClick={(event) => scrollToSection(event, id)}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="mx-1 hidden h-5 w-px bg-stroke sm:block" />

        <a
          className="gradient-ring group ml-1 rounded-full text-xs sm:text-sm"
          href="#contact"
          onClick={(event) => scrollToSection(event, "contact")}
        >
          <span className="relative inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-muted backdrop-blur-md transition-colors group-hover:text-text-primary sm:px-4 sm:py-2">
            <span className="sm:hidden">Email</span>
            <span className="hidden sm:inline">Email Zach</span>
            <ArrowIcon className="h-3.5 w-3.5" />
          </span>
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % roles.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,#070707_0%,#11151b_42%,#050505_100%)]" />
      <img
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center opacity-95"
        fetchPriority="high"
        sizes="100vw"
        src={HERO_IMAGE}
        srcSet={HERO_IMAGE_SRCSET}
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,rgba(0,0,0,0.24)_42%,rgba(0,0,0,0.78)_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
        <p className="mb-8 text-xs uppercase tracking-[0.3em] text-muted">
          AI OPERATING SURFACE
        </p>
        <h1 className="mb-6 font-display text-6xl italic leading-[0.9] tracking-tight text-text-primary md:text-8xl lg:text-9xl">
          Zach Wright
        </h1>
        <p className="mb-5 text-base text-text-primary/90 md:text-lg">
          <span
            key={roleIndex}
            className="inline-block animate-role-fade-in font-display italic text-text-primary"
          >
            {roles[roleIndex]}
          </span>{" "}
          shipping AI-era systems.
        </p>
        <p className="mb-12 max-w-md text-sm leading-7 text-muted md:text-base">
          Inspect the active product, technical notes, dashboard, and code trail before
          starting a conversation.
        </p>
        <div className="inline-flex flex-wrap items-center justify-center gap-4">
          <a
            className="gradient-ring group rounded-full transition-transform duration-300 hover:-translate-y-0.5"
            href="#work"
            onClick={(event) => scrollToSection(event, "work")}
          >
            <span className="relative inline-flex rounded-full bg-text-primary px-7 py-3.5 text-sm font-medium text-bg transition-colors group-hover:bg-bg group-hover:text-text-primary">
              Inspect proof
            </span>
          </a>
          <a
            className="gradient-ring group rounded-full transition-transform duration-300 hover:-translate-y-0.5"
            href="#contact"
            onClick={(event) => scrollToSection(event, "contact")}
          >
            <span className="relative inline-flex rounded-full border-2 border-stroke bg-bg px-7 py-3.5 text-sm font-medium text-text-primary transition-colors group-hover:border-transparent">
              Email Zach
            </span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-muted">SCROLL</span>
        <span className="relative h-10 w-px overflow-hidden bg-stroke">
          <span className="animate-scroll-down accent-gradient absolute left-0 top-0 h-1/2 w-px" />
        </span>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  italic,
  text,
  action,
}: {
  eyebrow: string;
  title: string;
  italic: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <m.div
      className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between"
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div>
        <div className="mb-5 flex items-center gap-4">
          <span className="h-px w-8 bg-stroke" />
          <span className="text-xs uppercase tracking-[0.3em] text-muted">{eyebrow}</span>
        </div>
        <h2 className="mb-4 text-4xl leading-tight tracking-tight text-text-primary md:text-6xl">
          {title} <span className="font-display italic">{italic}</span>
        </h2>
        <p className="max-w-xl text-sm leading-7 text-muted md:text-base">{text}</p>
      </div>
      {action}
    </m.div>
  );
}

function GradientAction({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a className="gradient-ring group hidden rounded-full md:inline-flex" href={href}>
      <span className="relative inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-stroke bg-bg px-5 py-3 text-sm text-text-primary transition-colors group-hover:border-transparent">
        {children}
        <ArrowIcon className="h-4 w-4" />
      </span>
    </a>
  );
}

function ProofSurfaceCard({
  surface,
  index,
}: {
  surface: (typeof proofSurfaces)[number];
  index: number;
}) {
  return (
    <m.a
      aria-label={`${surface.cta}: ${surface.title}`}
      className={`group relative flex overflow-hidden rounded-3xl border border-stroke bg-surface text-left outline-none transition-colors duration-300 hover:border-text-primary/30 focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${surface.ratio} ${surface.span}`}
      href={surface.href}
      initial={{ opacity: 0, y: 36 }}
      transition={{ duration: 0.72, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-35 transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
        sizes="(min-width: 768px) 50vw, 100vw"
        src={HERO_IMAGE}
        srcSet={HERO_IMAGE_SRCSET}
      />
      <div
        className="absolute inset-0 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(137,170,204,0.22),transparent_34%),linear-gradient(145deg,rgba(5,5,5,0.62)_0%,rgba(5,5,5,0.9)_64%,rgba(5,5,5,0.98)_100%)]" />
      <div className="relative z-10 flex h-full w-full flex-col justify-between p-5 md:p-7">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-text-primary/70">
            {surface.kind}
          </p>
          <h3 className="text-2xl leading-tight text-text-primary md:text-3xl">
            {surface.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-text-primary/75">
            {surface.summary}
          </p>
        </div>

        <dl className="my-6 space-y-3 border-y border-white/10 py-4 md:my-7">
          {surface.evidence.map(([label, value]) => (
            <div
              key={`${surface.title}-${label}`}
              className="grid grid-cols-[5.75rem_minmax(0,1fr)] gap-3 text-xs leading-5 md:grid-cols-[7rem_minmax(0,1fr)]"
            >
              <dt className="uppercase tracking-[0.18em] text-text-primary/45">{label}</dt>
              <dd className="min-w-0 font-medium text-text-primary/90">{value}</dd>
            </div>
          ))}
        </dl>

        <span className="inline-flex min-h-8 items-center gap-2 text-sm font-medium text-text-primary">
          {surface.cta}
          <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
        </span>
      </div>
    </m.a>
  );
}

function SelectedWorks() {
  return (
    <section id="work" className="bg-bg py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          action={<GradientAction href={PRODUCT_URL}>Inspect product files</GradientAction>}
          eyebrow="Proof surfaces"
          italic="work"
          text="Each item below is a live surface or external record that can be opened, inspected, and used."
          title="Active"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {proofSurfaces.map((surface, index) => (
            <ProofSurfaceCard key={surface.title} index={index} surface={surface} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EngineeringLedger() {
  return (
    <section id="judgment" className="bg-bg py-12 md:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 md:px-10 lg:grid-cols-[0.82fr_1.18fr] lg:px-16">
        <m.div
          className="lg:sticky lg:top-28"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="mb-5 flex items-center gap-4">
            <span className="h-px w-8 bg-stroke" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted">
              Engineering judgment
            </span>
          </div>
          <h2 className="mb-5 text-4xl leading-tight tracking-tight text-text-primary md:text-6xl">
            Decisions with <span className="font-display italic">evidence</span>
          </h2>
          <p className="max-w-md text-sm leading-7 text-muted md:text-base">
            A stronger portfolio shows how the system is kept honest: clear checks,
            boring build paths, and inspectable operating surfaces.
          </p>
          <a
            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-stroke px-5 py-3 text-sm text-text-primary transition-colors hover:border-text-primary/40 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            href={SITE_REPO_URL}
          >
            Open site repository
            <ArrowIcon className="h-4 w-4" />
          </a>
        </m.div>

        <div className="divide-y divide-stroke border-y border-stroke">
          {engineeringSignals.map((signal, index) => (
            <m.a
              key={signal.title}
              aria-label={`${signal.cta}: ${signal.title}`}
              className="group grid gap-4 px-0 py-6 text-left outline-none transition-colors duration-300 hover:bg-surface/35 focus-visible:bg-surface/35 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-text-primary md:grid-cols-[10rem_1fr] md:gap-x-6 md:px-5 lg:grid-cols-[11rem_1fr]"
              href={signal.href}
              initial={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.62, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-80px" }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs uppercase tracking-[0.22em] text-muted">{signal.kind}</p>
              <div>
                <h3 className="text-2xl leading-tight text-text-primary md:text-3xl">
                  {signal.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                  {signal.summary}
                </p>
              </div>
              <span className="inline-flex min-h-8 items-center gap-2 text-sm font-medium text-text-primary md:col-start-2">
                {signal.cta}
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </span>
            </m.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Journal() {
  return (
    <section id="journal" className="scroll-mt-24 bg-bg py-16 md:scroll-mt-28 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          action={<GradientAction href={UPDATES_URL}>View archive</GradientAction>}
          eyebrow="Technical notes"
          italic="drops"
          text="The latest published notes are linked directly from the archive rather than described with placeholder claims."
          title="Recent"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {latestJournalEntries.map((entry, index) => (
            <m.a
              key={entry.title}
              aria-label={`Read ${entry.title}`}
              className="group flex h-full flex-col justify-between rounded-2xl border border-stroke bg-surface/30 p-5 text-left transition-colors duration-300 hover:border-text-primary/30 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg md:p-6"
              href={entry.url}
              initial={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.6, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-80px" }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div>
                <p className="mb-4 text-xs uppercase tracking-[0.22em] text-muted">
                  {formatUpdateDate(entry.date)} / Daily Drop
                </p>
                <h3 className="text-xl leading-snug text-text-primary md:text-2xl">{entry.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted">{entry.preview}</p>
              </div>
              <span className="mt-6 inline-flex min-h-8 items-center gap-2 text-sm font-medium text-text-primary">
                Read drop
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </span>
            </m.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-bg pt-16 md:pt-20">
      <div className="absolute inset-0">
        <img
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-90"
          loading="lazy"
          sizes="100vw"
          src={HERO_IMAGE}
          srcSet={HERO_IMAGE_SRCSET}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(78,133,191,0.34),transparent_36%),linear-gradient(180deg,rgba(5,5,5,0.24)_0%,rgba(5,5,5,0.58)_54%,#050505_100%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg to-transparent" />
      </div>

      <div className="relative z-10">
        <div className="overflow-hidden py-8">
          <div
            className="marquee-track flex w-max whitespace-nowrap font-display text-6xl italic leading-none text-text-primary/10 md:text-8xl lg:text-9xl"
          >
            {Array.from({ length: 2 }).map((_, groupIndex) => (
              <span key={groupIndex}>
                {Array.from({ length: 10 }).map((__, index) => (
                  <span key={`${groupIndex}-${index}`}>OPERATIONAL CLARITY {"\u2022"} </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto flex max-w-[1200px] flex-col items-center px-6 py-16 text-center md:px-10 lg:px-16">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-muted">Contact</p>
          <h2 className="mb-8 max-w-3xl text-5xl leading-none tracking-tight text-text-primary md:text-7xl">
            Start with the artifact. <span className="font-display italic">Then bring context</span>.
          </h2>
          <p className="mb-8 max-w-xl text-sm leading-7 text-muted md:text-base">
            Use the product, archive, dashboard, and code links above to inspect fit. Email when
            there is a real system, product, or technical decision to work through.
          </p>
          <a
            className="gradient-ring group rounded-full"
            href={`mailto:${CONTACT_EMAIL}?subject=AI%20strategy%20inquiry`}
          >
            <span className="relative inline-flex items-center gap-2 rounded-full border border-stroke bg-bg px-6 py-3.5 text-sm text-text-primary transition-colors group-hover:border-transparent">
              {CONTACT_EMAIL}
              <ArrowIcon className="h-4 w-4" />
            </span>
          </a>
        </div>

        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 border-t border-white/10 px-6 pb-8 pt-6 text-xs uppercase tracking-[0.22em] text-muted md:flex-row md:items-center md:justify-between md:px-10 md:pb-12 lg:px-16">
          <div className="flex flex-wrap gap-4">
            {socialLinks.map(([label, href]) => (
              <a key={label} className="transition-colors hover:text-text-primary" href={href}>
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span>Available for advisory cycles</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PortfolioPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <SelectedWorks />
      <EngineeringLedger />
      <Journal />
      <Footer />
    </>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    document.title = "Zach Wright | Software Engineering Portfolio";
  }, [location.pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <AnimatePresence mode="wait">
          <m.main
            key={location.pathname}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <PortfolioPage />
          </m.main>
        </AnimatePresence>
      </LazyMotion>
    </MotionConfig>
  );
}
