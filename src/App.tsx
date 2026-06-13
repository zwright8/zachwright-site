import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hls from "hls.js";
import { type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import updatesIndex from "../updates/index.json";

gsap.registerPlugin(ScrollTrigger);

const HLS_SOURCE =
  "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

const CONTACT_EMAIL = "zach@zachwright.xyz";
const CAL_URL = "https://cal.com/zachary-wright-l9sdgm/30min";
const GITHUB_URL = "https://github.com/zwright8";
const UPDATES_URL = "/updates/index.html";

const roles = ["AI Operator", "Venture Builder", "Builder", "Founder"];

type UpdateEntry = {
  date: string;
  slug: string;
  title: string;
  url: string;
  preview: string;
};

const latestJournalEntries = (updatesIndex as UpdateEntry[]).slice(0, 4);

const updateDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

const projects = [
  {
    title: "Strategy to Execution",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
    span: "md:col-span-7",
    ratio: "aspect-[1.18/1]",
  },
  {
    title: "Venture Formation",
    image:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1100&q=80",
    span: "md:col-span-5",
    ratio: "aspect-[0.86/1]",
  },
  {
    title: "Continuous Intelligence",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1100&q=80",
    span: "md:col-span-5",
    ratio: "aspect-[0.86/1]",
  },
  {
    title: "Operating Standards",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
    span: "md:col-span-7",
    ratio: "aspect-[1.18/1]",
  },
];

const explorations = [
  {
    title: "Frame",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80",
    rotate: "-rotate-3",
    drift: -160,
  },
  {
    title: "Prioritize",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    rotate: "rotate-2",
    drift: 140,
  },
  {
    title: "Build",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
    rotate: "rotate-6",
    drift: -110,
  },
  {
    title: "Iterate",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    rotate: "-rotate-2",
    drift: 170,
  },
  {
    title: "Truthful Signals",
    image:
      "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=900&q=80",
    rotate: "rotate-3",
    drift: -140,
  },
  {
    title: "Clarity over Noise",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
    rotate: "-rotate-6",
    drift: 120,
  },
];

const stats = [
  ["3", "Profile Lanes"],
  ["4", "Working Steps"],
  ["Weekly", "Intelligence Cadence"],
];

const socialLinks = [
  ["Email", `mailto:${CONTACT_EMAIL}?subject=AI%20strategy%20inquiry`],
  ["Super Sonic Tsunami", UPDATES_URL],
  ["GitHub", GITHUB_URL],
  ["Book Call", CAL_URL],
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

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["Frame", "Build", "Iterate"];

  useEffect(() => {
    const duration = 2700;
    let frame = 0;
    let startedAt = 0;
    let done = false;
    let completeTimer = 0;

    const tick = (time: number) => {
      if (!startedAt) {
        startedAt = time;
      }

      const progress = Math.min((time - startedAt) / duration, 1);
      setCount(Math.floor(progress * 100));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }

      if (!done) {
        done = true;
        setCount(100);
        completeTimer = window.setTimeout(onComplete, 400);
      }
    };

    frame = requestAnimationFrame(tick);
    const wordTimer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % words.length);
    }, 900);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(completeTimer);
      window.clearInterval(wordTimer);
    };
  }, [onComplete, words.length]);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] bg-bg"
      exit={{ opacity: 0, transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] } }}
      initial={{ opacity: 1 }}
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-6 top-6 text-xs uppercase tracking-[0.3em] text-muted md:left-10 md:top-10"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
      >
        zachwright.xyz
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={words[wordIndex]}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl italic text-text-primary/80 md:text-6xl lg:text-7xl"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.28 } }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
          >
            {words[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 right-6 font-display text-6xl tabular-nums text-text-primary md:bottom-10 md:right-10 md:text-8xl lg:text-9xl">
        {String(count).padStart(3, "0")}
      </div>

      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-stroke/50">
        <div
          className="accent-gradient h-full origin-left"
          style={{
            boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
            transform: `scaleX(${count / 100})`,
          }}
        />
      </div>
    </motion.div>
  );
}

function HlsVideo({ className = "", flipY = false }: { className?: string; flipY?: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return undefined;
    }

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(HLS_SOURCE);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_SOURCE;
    }

    const play = () => {
      void video.play().catch(() => undefined);
    };

    video.addEventListener("loadedmetadata", play);
    play();

    return () => {
      video.removeEventListener("loadedmetadata", play);
      hls?.destroy();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      aria-hidden="true"
      autoPlay
      className={`absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover ${flipY ? "scale-y-[-1]" : ""} ${className}`}
      loop
      muted
      playsInline
    />
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
    ["Capabilities", "work"],
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

function Hero({ isReady }: { isReady: boolean }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % roles.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isReady || prefersReducedMotion) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(".name-reveal", { opacity: 0, y: 50 });
      gsap.set(".blur-in", { opacity: 0, filter: "blur(10px)", y: 20 });

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .to(".name-reveal", { opacity: 1, y: 0, duration: 1.2, delay: 0.1 })
        .to(
          ".blur-in",
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1,
            stagger: 0.1,
            delay: 0.3,
          },
          0,
        );
    });

    return () => ctx.revert();
  }, [isReady, prefersReducedMotion]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      <HlsVideo />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
        <p className="blur-in mb-8 text-xs uppercase tracking-[0.3em] text-muted">
          AI OPERATING SURFACE
        </p>
        <h1 className="name-reveal mb-6 font-display text-6xl italic leading-[0.9] tracking-tight text-text-primary md:text-8xl lg:text-9xl">
          Zach Wright
        </h1>
        <p className="blur-in mb-5 text-base text-text-primary/90 md:text-lg">
          <span
            key={roleIndex}
            className="inline-block animate-role-fade-in font-display italic text-text-primary"
          >
            {roles[roleIndex]}
          </span>{" "}
          for AI-heavy decisions.
        </p>
        <p className="blur-in mb-12 max-w-md text-sm leading-7 text-muted md:text-base">
          Building AI systems, venture tracks, and weekly operating intelligence with
          practical priorities, clear ownership, and truthful signal.
        </p>
        <div className="blur-in inline-flex flex-wrap items-center justify-center gap-4">
          <a
            className="gradient-ring group rounded-full transition-transform duration-300 hover:scale-105"
            href="#work"
            onClick={(event) => scrollToSection(event, "work")}
          >
            <span className="relative inline-flex rounded-full bg-text-primary px-7 py-3.5 text-sm font-medium text-bg transition-colors group-hover:bg-bg group-hover:text-text-primary">
              See Capabilities
            </span>
          </a>
          <a
            className="gradient-ring group rounded-full transition-transform duration-300 hover:scale-105"
            href="#contact"
            onClick={(event) => scrollToSection(event, "contact")}
          >
            <span className="relative inline-flex rounded-full border-2 border-stroke bg-bg px-7 py-3.5 text-sm font-medium text-text-primary transition-colors group-hover:border-transparent">
              Start a conversation
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
    <motion.div
      className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between"
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
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
    </motion.div>
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

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  return (
    <motion.article
      className={`group relative overflow-hidden rounded-3xl border border-stroke bg-surface ${project.ratio} ${project.span}`}
      initial={{ opacity: 0, y: 36 }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <img
        alt=""
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
        src={project.image}
      />
      <div
        className="absolute inset-0 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />
      <div className="absolute inset-0 grid place-items-center bg-bg/70 opacity-0 backdrop-blur-lg transition-opacity duration-300 group-hover:opacity-100">
        <span className="animated-gradient-border rounded-full p-[2px]">
          <span className="inline-flex rounded-full bg-white px-5 py-2 text-sm text-bg">
            View {"\u2014"} <span className="ml-1 font-display italic">{project.title}</span>
          </span>
        </span>
      </div>
    </motion.article>
  );
}

function SelectedWorks() {
  return (
    <section id="work" className="bg-bg py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          action={<GradientAction href={UPDATES_URL}>Read operating signal</GradientAction>}
          eyebrow="Capabilities"
          italic="pillars"
          text="Focused support for leaders and teams navigating AI strategy, execution, and commercialization."
          title="Capability"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} index={index} project={project} />
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
          eyebrow="Super Sonic Tsunami"
          italic="signal"
          text="Latest daily drops and weekly intelligence for teams making AI-heavy decisions."
          title="Latest"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {latestJournalEntries.map((entry, index) => (
            <motion.a
              key={entry.title}
              aria-label={`Read ${entry.title}`}
              className="group flex h-full flex-col justify-between rounded-2xl border border-stroke bg-surface/30 p-5 text-left transition-colors duration-300 hover:border-text-primary/30 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg md:p-6"
              href={entry.url}
              initial={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.7, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
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
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Explorations() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeImage, setActiveImage] = useState<(typeof explorations)[number] | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current || !contentRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: contentRef.current,
        pinSpacing: false,
      });

      cardRefs.current.forEach((card, index) => {
        if (!card) {
          return;
        }

        gsap.to(card, {
          y: explorations[index].drift,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const leftColumn = explorations.filter((_, index) => index % 2 === 0);
  const rightColumn = explorations.filter((_, index) => index % 2 === 1);

  const renderCard = (item: (typeof explorations)[number], columnIndex: number) => {
    const index = explorations.findIndex((exploration) => exploration.title === item.title);

    return (
      <button
        key={item.title}
        ref={(node) => {
          cardRefs.current[index] = node;
        }}
        className={`group pointer-events-auto relative aspect-square w-full max-w-[320px] overflow-hidden rounded-3xl border border-white/10 bg-surface text-left shadow-2xl shadow-black/20 outline-none transition-transform duration-300 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-text-primary ${item.rotate} ${
          columnIndex === 1 ? "self-end" : "self-start"
        }`}
        onClick={() => setActiveImage(item)}
        type="button"
      >
        <img
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          src={item.image}
        />
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-sm text-text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {item.title}
        </span>
      </button>
    );
  };

  return (
    <section ref={sectionRef} className="relative min-h-[300vh] overflow-hidden bg-bg">
      <div ref={contentRef} className="relative z-10 flex h-screen items-center justify-center px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-muted">Proof and Process</p>
          <h2 className="mb-6 text-5xl leading-none tracking-tight text-text-primary md:text-7xl">
            Operating <span className="font-display italic">model</span>
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-sm leading-7 text-muted md:text-base">
            Frame the highest-stakes decisions, prioritize by risk and impact, build with
            checkpoints, then recalibrate through live market signal.
          </p>
          <a className="gradient-ring group inline-flex rounded-full" href={UPDATES_URL}>
            <span className="relative inline-flex items-center gap-2 rounded-full border border-stroke bg-bg px-5 py-3 text-sm text-text-primary transition-colors group-hover:border-transparent">
              Super Sonic Tsunami
              <ArrowIcon className="h-4 w-4" />
            </span>
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 mx-auto grid max-w-[1400px] grid-cols-2 gap-12 px-6 pt-[32vh] md:gap-40 md:px-12">
        <div className="flex flex-col gap-[42vh]">
          {leftColumn.map((item) => renderCard(item, 0))}
        </div>
        <div className="mt-[28vh] flex flex-col gap-[42vh]">
          {rightColumn.map((item) => renderCard(item, 1))}
        </div>
      </div>

      <AnimatePresence>
        {activeImage ? (
          <motion.div
            className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-5 backdrop-blur-md"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            role="dialog"
            animate={{ opacity: 1 }}
          >
            <motion.figure
              className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-surface"
              exit={{ opacity: 0, scale: 0.96 }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(event) => event.stopPropagation()}
            >
              <img alt="" className="max-h-[78vh] w-full object-cover" src={activeImage.image} />
              <figcaption className="flex items-center justify-between p-5 text-sm text-text-primary">
                <span className="font-display text-2xl italic">{activeImage.title}</span>
                <button
                  className="rounded-full border border-stroke px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-text-primary"
                  onClick={() => setActiveImage(null)}
                  type="button"
                >
                  Close
                </button>
              </figcaption>
            </motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function Stats() {
  return (
    <section id="proof" className="bg-bg py-16 md:py-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-px overflow-hidden border border-stroke bg-stroke px-0 md:grid-cols-3">
        {stats.map(([value, label]) => (
          <div key={label} className="bg-bg p-8 text-center md:p-12">
            <div className="mb-3 font-display text-6xl italic leading-none text-text-primary md:text-7xl">
              {value}
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !marqueeRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <footer id="contact" className="relative overflow-hidden bg-bg pt-16 md:pt-20">
      <div className="absolute inset-0">
        <HlsVideo flipY />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg to-transparent" />
      </div>

      <div className="relative z-10">
        <div className="overflow-hidden py-8">
          <div
            ref={marqueeRef}
            className="flex w-max whitespace-nowrap font-display text-6xl italic leading-none text-text-primary/10 md:text-8xl lg:text-9xl"
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
            If execution speed matters, <span className="font-display italic">start now</span>.
          </h2>
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

function PortfolioPage({ isLoading }: { isLoading: boolean }) {
  return (
    <>
      <Navbar />
      <Hero isReady={!isLoading} />
      <SelectedWorks />
      <Journal />
      <Explorations />
      <Stats />
      <Footer />
    </>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  return (
    <>
      <AnimatePresence>
        {isLoading ? <LoadingScreen onComplete={() => setIsLoading(false)} /> : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <PortfolioPage isLoading={isLoading} />
        </motion.main>
      </AnimatePresence>
    </>
  );
}
