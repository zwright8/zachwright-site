import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  useReducedMotion,
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
const PRODUCT_URL = "/products/ai-operator-kit/";
const DASHBOARD_URL = "/dashboard.html";
const UPDATES_URL = "/updates/index.html";
const PLAYGROUND_URL = "/agent-playground";

const roles = ["AI Systems Engineer", "Product Engineer", "Frontend Builder", "Automation Operator"];

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

const proofSurfaces = [
  {
    title: "Physical AI Playground",
    cta: "Run robot simulations",
    href: PLAYGROUND_URL,
    kind: "Interactive lab",
    summary:
      "A visual test bench for robotics scenarios, model eval gates, synthetic data plans, and Omniverse/Isaac handoffs.",
    image: "/assets/hero-material-1200.webp",
    span: "md:col-span-12",
    ratio: "aspect-[2.15/1]",
  },
  {
    title: "AI Operator Kit",
    cta: "Open product surface",
    href: PRODUCT_URL,
    kind: "Product",
    summary: "A real product page with package tiers, fulfillment files, policy docs, and checkout wiring.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
    span: "md:col-span-7",
    ratio: "aspect-[1.18/1]",
  },
  {
    title: "Daily Drop Archive",
    cta: "Read dated technical notes",
    href: UPDATES_URL,
    kind: "Archive",
    summary: "A dated archive of AI-era engineering notes with source links and concrete operating takeaways.",
    image:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1100&q=80",
    span: "md:col-span-5",
    ratio: "aspect-[0.86/1]",
  },
  {
    title: "Operations Dashboard",
    cta: "Open dashboard",
    href: DASHBOARD_URL,
    kind: "Dashboard",
    summary: "A site-owned dashboard surface for checking the portfolio's data presentation and supporting assets.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1100&q=80",
    span: "md:col-span-5",
    ratio: "aspect-[0.86/1]",
  },
  {
    title: "GitHub Implementation Trail",
    cta: "View repository work",
    href: GITHUB_URL,
    kind: "Code record",
    summary: "Public code history for inspecting how the site and related software work are actually built.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
    span: "md:col-span-7",
    ratio: "aspect-[1.18/1]",
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
  ["Run Physical AI Playground", PLAYGROUND_URL],
  ["Read Daily Drop archive", UPDATES_URL],
  ["Open AI Operator Kit", PRODUCT_URL],
  ["View GitHub work", GITHUB_URL],
  ["Book 30-min call", CAL_URL],
];

type PlaygroundTone = "pass" | "watch";

type PlaygroundTraceStep = {
  agent: string;
  detail: string;
  evidence: string;
  kind: string;
  position: { x: number; y: number };
  telemetry: Array<{ label: string; tone?: PlaygroundTone; value: string }>;
  title: string;
};

type PlaygroundScenario = {
  artifacts: Array<{ href: string; label: string; metric: string }>;
  capabilities: string[];
  evals: Array<{ label: string; result: string; tone: PlaygroundTone }>;
  id: string;
  intent: string;
  memory: string[];
  model: string;
  nvidiaPath: string;
  outcome: string;
  scene: string;
  tests: Array<{ label: string; status: string; tone: PlaygroundTone }>;
  title: string;
  tools: Array<{ label: string; status: string }>;
  trace: PlaygroundTraceStep[];
};

const playgroundScenarios: PlaygroundScenario[] = [
  {
    id: "route",
    title: "AMR route validation",
    scene: "Warehouse aisle digital twin",
    model: "Nav policy + occupancy planner",
    nvidiaPath: "Omniverse libraries -> Isaac Sim -> Isaac Lab policy eval",
    intent:
      "Stress-test an autonomous mobile robot through a warehouse route with blocked aisles, pallet shadows, and a human crossing zone.",
    outcome: "Pass when the robot reroutes without entering the safety envelope",
    capabilities: ["OpenUSD scene", "PhysX contacts", "LiDAR + RGB", "ROS2 bridge"],
    tools: [
      { label: "world.usd", status: "Shelf rows, dock lane, occluders" },
      { label: "policy.eval", status: "Navigation model candidate" },
      { label: "sensor.replay", status: "LiDAR sweep plus RGB frames" },
      { label: "safety.gate", status: "Stop distance and route deviation" },
    ],
    memory: [
      "Treat every collision-free route as provisional until safety margins are checked.",
      "Log blocked-aisle seeds that cause policy oscillation.",
      "Keep the browser animation as a demo; production evidence comes from Isaac/Dojo run artifacts.",
    ],
    tests: [
      { label: "Static obstacle avoidance", status: "pass", tone: "pass" },
      { label: "Human crossing envelope", status: "watch", tone: "watch" },
      { label: "Dock arrival tolerance", status: "pass", tone: "pass" },
    ],
    trace: [
      {
        agent: "Scene Builder",
        detail:
          "Loads the warehouse USD stage, applies physics materials, and seeds pallet occluders near the middle aisle.",
        evidence: "World seed W-042, shelf rows A-D, obstacle pallet P-17",
        kind: "sim",
        position: { x: 13, y: 75 },
        telemetry: [
          { label: "Sim", value: "00:00" },
          { label: "Clearance", value: "1.8 m", tone: "pass" },
          { label: "Route", value: "planned", tone: "pass" },
        ],
        title: "Assemble the route world",
      },
      {
        agent: "Policy Runner",
        detail:
          "Runs the navigation policy against LiDAR and RGB sensor feeds while the planner follows the dock-to-pick path.",
        evidence: "Policy candidate nav-amr-07, 30 Hz control loop",
        kind: "sensor",
        position: { x: 36, y: 60 },
        telemetry: [
          { label: "Sim", value: "00:18" },
          { label: "Speed", value: "1.2 m/s", tone: "pass" },
          { label: "Path error", value: "0.19 m", tone: "pass" },
        ],
        title: "Run the baseline route",
      },
      {
        agent: "Adversary",
        detail:
          "Injects a blocked pallet and crossing worker into the aisle to test whether the policy hesitates, stops, or reroutes.",
        evidence: "Dynamic actor H-03 enters at 00:28, pallet P-17 blocks lane B",
        kind: "risk",
        position: { x: 58, y: 46 },
        telemetry: [
          { label: "Sim", value: "00:31" },
          { label: "Min range", value: "0.74 m", tone: "watch" },
          { label: "Action", value: "reroute", tone: "pass" },
        ],
        title: "Inject a safety edge case",
      },
      {
        agent: "Verifier",
        detail:
          "Scores clearance, time-to-stop, route recovery, and arrival error before marking the candidate as deployable or blocked.",
        evidence: "No contact, stop margin 0.42 m, final dock error 0.08 m",
        kind: "gate",
        position: { x: 82, y: 29 },
        telemetry: [
          { label: "Sim", value: "00:49" },
          { label: "Score", value: "91/100", tone: "pass" },
          { label: "Gate", value: "pass", tone: "pass" },
        ],
        title: "Gate the route policy",
      },
    ],
    evals: [
      { label: "Collision count", result: "0", tone: "pass" },
      { label: "Min safety margin", result: "0.42 m", tone: "watch" },
      { label: "Dock error", result: "0.08 m", tone: "pass" },
    ],
    artifacts: [
      { href: "https://developer.nvidia.com/isaac/sim", label: "Isaac Sim reference", metric: "runtime" },
      {
        href: "https://developer.nvidia.com/omniverse?size=n_12_n&sort-field=featured&sort-direction=desc",
        label: "Omniverse libraries",
        metric: "toolchain",
      },
    ],
  },
  {
    id: "pick",
    title: "Manipulation pick test",
    scene: "Bin picking cell",
    model: "Vision-language grasp planner",
    nvidiaPath: "GR00T-Mimic style synthetic motion -> Isaac Sim manipulation eval",
    intent:
      "Compare grasp candidates for a cluttered bin where reflective parts, bad normals, and occluded edges break naive pick policies.",
    outcome: "Pass when the robot picks the target without disturbing adjacent parts",
    capabilities: ["RGB-D camera", "Articulation", "Contact sensors", "Synthetic motion"],
    tools: [
      { label: "grasp.sample", status: "Candidate wrist poses" },
      { label: "contact.solve", status: "Finger contacts and slip" },
      { label: "vision.mask", status: "Target segmentation" },
      { label: "motion.score", status: "Pick success and disturbance" },
    ],
    memory: [
      "Separate detection confidence from grasp success.",
      "Flag policies that succeed only on a single lighting seed.",
      "Prefer synthetic data expansion when occlusion, glare, or part orientation fails.",
    ],
    tests: [
      { label: "Grasp reachability", status: "pass", tone: "pass" },
      { label: "Reflective part mask", status: "watch", tone: "watch" },
      { label: "Neighbor disturbance", status: "pass", tone: "pass" },
    ],
    trace: [
      {
        agent: "Perception",
        detail:
          "Segments the target from an RGB-D frame and marks occluded edge regions as uncertain instead of overconfident.",
        evidence: "Mask confidence 0.86, edge uncertainty band 14 px",
        kind: "sensor",
        position: { x: 24, y: 36 },
        telemetry: [
          { label: "Mask", value: "0.86", tone: "pass" },
          { label: "Depth gap", value: "3.1 cm", tone: "watch" },
          { label: "Glare", value: "high", tone: "watch" },
        ],
        title: "Read the bin",
      },
      {
        agent: "Planner",
        detail: "Samples grasp poses that avoid the bin wall and preserve wrist clearance for the retreat motion.",
        evidence: "18 grasps scored, 5 reachable, 2 preferred",
        kind: "plan",
        position: { x: 42, y: 48 },
        telemetry: [
          { label: "Candidates", value: "18" },
          { label: "Reachable", value: "5", tone: "pass" },
          { label: "Top pose", value: "G-11", tone: "pass" },
        ],
        title: "Choose a grasp",
      },
      {
        agent: "Physics",
        detail:
          "Runs contact and slip checks so the planner does not accept a visually plausible but unstable pick.",
        evidence: "Contact normal stable, slip probability 0.08",
        kind: "sim",
        position: { x: 58, y: 59 },
        telemetry: [
          { label: "Grip force", value: "12 N", tone: "pass" },
          { label: "Slip", value: "8%", tone: "pass" },
          { label: "Impact", value: "none", tone: "pass" },
        ],
        title: "Simulate contact",
      },
      {
        agent: "Verifier",
        detail:
          "Scores pick success, placement accuracy, and neighbor motion before deciding whether to expand synthetic coverage.",
        evidence: "Pick success 96%, disturbance 1.2 cm, glare seed needs more samples",
        kind: "gate",
        position: { x: 75, y: 43 },
        telemetry: [
          { label: "Success", value: "96%", tone: "pass" },
          { label: "Disturb", value: "1.2 cm", tone: "pass" },
          { label: "Next", value: "augment", tone: "watch" },
        ],
        title: "Score the manipulation policy",
      },
    ],
    evals: [
      { label: "Pick success", result: "96%", tone: "pass" },
      { label: "Mask confidence", result: "0.86", tone: "pass" },
      { label: "Glare seeds", result: "expand", tone: "watch" },
    ],
    artifacts: [
      { href: "https://developer.nvidia.com/isaac/lab", label: "Isaac Lab reference", metric: "policy" },
      {
        href: "https://developer.nvidia.com/omniverse?size=n_12_n&sort-field=featured&sort-direction=desc",
        label: "Agent skills",
        metric: "SDG",
      },
    ],
  },
  {
    id: "safety",
    title: "Human safety stop",
    scene: "Mixed human-robot aisle",
    model: "Safety supervisor + local planner",
    nvidiaPath: "Isaac Sim software-in-the-loop -> hardware-in-the-loop checklist",
    intent:
      "Demonstrate a supervisor that detects a human entering the route and switches from navigation to controlled stop before recovery.",
    outcome: "Pass when stop time and restart conditions satisfy the safety case",
    capabilities: ["Actor injection", "Safety envelope", "Supervisor state", "Recovery policy"],
    tools: [
      { label: "actor.inject", status: "Human crossing event" },
      { label: "envelope.watch", status: "Proximity zones" },
      { label: "controller.stop", status: "Brake curve" },
      { label: "restart.guard", status: "Resume only after clear" },
    ],
    memory: [
      "A graceful stop is better than a clever dodge when a human enters the envelope.",
      "Resume conditions must be visible in the trace.",
      "Report watch states even when the final gate passes.",
    ],
    tests: [
      { label: "Time-to-stop", status: "pass", tone: "pass" },
      { label: "Envelope breach", status: "watch", tone: "watch" },
      { label: "Clear restart", status: "pass", tone: "pass" },
    ],
    trace: [
      {
        agent: "Supervisor",
        detail:
          "Runs the nominal route while watching dynamic actor distance, velocity, and predicted intersection.",
        evidence: "Supervisor state: NAVIGATE, predicted intersection clear",
        kind: "sensor",
        position: { x: 18, y: 70 },
        telemetry: [
          { label: "State", value: "NAV" },
          { label: "Human", value: "4.9 m", tone: "pass" },
          { label: "Brake", value: "armed", tone: "pass" },
        ],
        title: "Watch the envelope",
      },
      {
        agent: "Adversary",
        detail: "Adds a human crossing event at the aisle pinch point and raises the local planner cost around the actor.",
        evidence: "Actor H-11 enters yellow zone at 00:21",
        kind: "risk",
        position: { x: 42, y: 58 },
        telemetry: [
          { label: "State", value: "CAUTION", tone: "watch" },
          { label: "Human", value: "1.7 m", tone: "watch" },
          { label: "TTC", value: "2.4 s", tone: "watch" },
        ],
        title: "Cross the route",
      },
      {
        agent: "Controller",
        detail: "Commands a controlled stop before the red envelope, then holds the robot until the aisle clears.",
        evidence: "Stop time 1.1 s, red-zone entry false",
        kind: "gate",
        position: { x: 53, y: 49 },
        telemetry: [
          { label: "State", value: "STOP", tone: "watch" },
          { label: "Margin", value: "0.64 m", tone: "pass" },
          { label: "Contact", value: "0", tone: "pass" },
        ],
        title: "Hold safe stop",
      },
      {
        agent: "Recovery",
        detail:
          "Resumes at capped speed only after the supervisor verifies a clear corridor and no predicted re-entry.",
        evidence: "Restart gate clear for 2.0 s, speed cap 0.6 m/s",
        kind: "handoff",
        position: { x: 78, y: 33 },
        telemetry: [
          { label: "State", value: "RESUME", tone: "pass" },
          { label: "Speed", value: "0.6 m/s", tone: "pass" },
          { label: "Gate", value: "pass", tone: "pass" },
        ],
        title: "Resume under guard",
      },
    ],
    evals: [
      { label: "Stop time", result: "1.1 s", tone: "pass" },
      { label: "Envelope entry", result: "0", tone: "pass" },
      { label: "Restart guard", result: "2.0 s", tone: "pass" },
    ],
    artifacts: [
      { href: "https://developer.nvidia.com/isaac/sim", label: "SIL/HIL workflow", metric: "testing" },
      { href: "https://developer.nvidia.com/isaac/lab", label: "Robot learning", metric: "training" },
    ],
  },
  {
    id: "dataset",
    title: "Synthetic data capture",
    scene: "Randomized inspection station",
    model: "Vision model dataset builder",
    nvidiaPath: "Omniverse Replicator / physical AI skills -> dataset review",
    intent:
      "Generate a test packet for perception models by randomizing lights, camera pose, object color, defects, and background clutter.",
    outcome: "Pass when coverage expands the hard cases without corrupt labels",
    capabilities: ["Domain randomization", "RGB + depth labels", "Defect injection", "Dataset QA"],
    tools: [
      { label: "replicator.seed", status: "Lighting and material ranges" },
      { label: "defect.inject", status: "Scratch, dent, contamination" },
      { label: "labels.export", status: "COCO/KITTI-style packet" },
      { label: "dataset.audit", status: "Coverage and label integrity" },
    ],
    memory: [
      "Synthetic data is useful only when the label contract is inspectable.",
      "Keep randomization ranges tied to physical constraints.",
      "Generate examples for failure clusters, not just pretty frames.",
    ],
    tests: [
      { label: "Coverage delta", status: "pass", tone: "pass" },
      { label: "Label integrity", status: "pass", tone: "pass" },
      { label: "Unrealistic lighting", status: "watch", tone: "watch" },
    ],
    trace: [
      {
        agent: "Dataset Planner",
        detail:
          "Chooses randomization ranges from recent model misses, focusing on glare, dark edges, and partial occlusion.",
        evidence: "Failure clusters F-02 glare, F-07 dark edge, F-11 occlusion",
        kind: "plan",
        position: { x: 18, y: 34 },
        telemetry: [
          { label: "Seeds", value: "128" },
          { label: "Targets", value: "3 clusters", tone: "pass" },
          { label: "Labels", value: "locked", tone: "pass" },
        ],
        title: "Pick coverage targets",
      },
      {
        agent: "Renderer",
        detail:
          "Randomizes object pose, light position, material response, and camera intrinsics while preserving label provenance.",
        evidence: "128 frame plan, 4 lights, 6 material bands",
        kind: "sim",
        position: { x: 36, y: 48 },
        telemetry: [
          { label: "Frames", value: "128" },
          { label: "Light", value: "4 rigs", tone: "pass" },
          { label: "Pose", value: "wide", tone: "pass" },
        ],
        title: "Render synthetic variants",
      },
      {
        agent: "Label QA",
        detail:
          "Audits bounding boxes, masks, and depth labels against the scene graph before the packet becomes training input.",
        evidence: "127/128 labels pass, one glare seed quarantined",
        kind: "gate",
        position: { x: 59, y: 56 },
        telemetry: [
          { label: "Labels", value: "99.2%", tone: "pass" },
          { label: "Quarantine", value: "1", tone: "watch" },
          { label: "Depth", value: "ok", tone: "pass" },
        ],
        title: "Audit label integrity",
      },
      {
        agent: "Verifier",
        detail:
          "Compares the new packet against the model's failure set and marks which physical scene ranges should be expanded next.",
        evidence: "Hard-case recall +14%, unrealistic light seed removed",
        kind: "dataset",
        position: { x: 81, y: 65 },
        telemetry: [
          { label: "Recall", value: "+14%", tone: "pass" },
          { label: "Packet", value: "ready", tone: "pass" },
          { label: "Next", value: "edge glare", tone: "watch" },
        ],
        title: "Package the dataset",
      },
    ],
    evals: [
      { label: "Hard-case recall", result: "+14%", tone: "pass" },
      { label: "Label pass rate", result: "99.2%", tone: "pass" },
      { label: "Quarantined seed", result: "1", tone: "watch" },
    ],
    artifacts: [
      {
        href: "https://developer.nvidia.com/omniverse?size=n_12_n&sort-field=featured&sort-direction=desc",
        label: "SDG agent skills",
        metric: "workflow",
      },
      { href: "https://developer.nvidia.com/isaac/sim", label: "Synthetic data", metric: "capture" },
    ],
  },
];

const kindStyles: Record<string, string> = {
  dataset: "border-lime-300/30 bg-lime-300/10 text-lime-100",
  gate: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  handoff: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
  plan: "border-white/15 bg-white/10 text-text-primary",
  risk: "border-amber-200/30 bg-amber-200/10 text-amber-100",
  sensor: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
  sim: "border-[#76B900]/35 bg-[#76B900]/10 text-[#d6ff99]",
};

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
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
        src={surface.image}
      />
      <div
        className="absolute inset-0 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-bg via-bg/50 to-transparent p-5 md:p-7">
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-text-primary/70">
          {surface.kind}
        </p>
        <h3 className="text-2xl leading-tight text-text-primary md:text-3xl">
          {surface.title}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted">{surface.summary}</p>
        <span className="mt-5 inline-flex min-h-8 items-center gap-2 text-sm font-medium text-text-primary">
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
          action={<GradientAction href={PRODUCT_URL}>Open product surface</GradientAction>}
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

function toneClasses(tone?: PlaygroundTone) {
  return tone === "watch"
    ? "border-amber-200/25 bg-amber-200/10 text-amber-100"
    : "border-emerald-300/25 bg-emerald-300/10 text-emerald-100";
}

function SimulationStage({
  activeStep,
  isRunning,
  prefersReducedMotion,
  scenario,
}: {
  activeStep: number;
  isRunning: boolean;
  prefersReducedMotion: boolean | null;
  scenario: PlaygroundScenario;
}) {
  const activeTrace = scenario.trace[activeStep] ?? scenario.trace[0];
  const routePoints = scenario.trace.map((step) => `${step.position.x},${step.position.y}`).join(" ");
  const completedPoints = scenario.trace
    .slice(0, activeStep + 1)
    .map((step) => `${step.position.x},${step.position.y}`)
    .join(" ");
  const robotColor = scenario.id === "dataset" ? "#67e8f9" : "#76B900";
  const showHuman = scenario.id === "route" || scenario.id === "safety";
  const showBin = scenario.id === "pick" || scenario.id === "dataset";

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#070907]/88 backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-white/10 p-4 md:flex-row md:items-start md:justify-between md:p-5">
        <div>
          <p className="text-xs uppercase text-muted">Simulation stage</p>
          <h2 className="mt-2 text-3xl leading-tight text-text-primary md:text-4xl">
            {activeTrace.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{activeTrace.detail}</p>
        </div>
        <div className="grid min-w-48 gap-2 text-sm">
          <div className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">
            <p className="text-xs uppercase text-muted">Scene</p>
            <p className="mt-1 text-text-primary">{scenario.scene}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">
            <p className="text-xs uppercase text-muted">Model</p>
            <p className="mt-1 text-text-primary">{scenario.model}</p>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-5">
        <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-[#050705] md:min-h-[520px]">
          <div className="simulation-grid absolute inset-0" />
          <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#76B900]/35 bg-[#76B900]/10 px-3 py-1.5 text-xs text-[#d6ff99]">
              Browser demo
            </span>
            <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-100">
              {isRunning ? "Sim running" : "Ready"}
            </span>
          </div>

          <svg
            aria-label={`${scenario.title} simulation visualization`}
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            role="img"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`floor-${scenario.id}`} x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#0b0f0b" />
                <stop offset="62%" stopColor="#0a1412" />
                <stop offset="100%" stopColor="#050705" />
              </linearGradient>
              <filter id={`soft-glow-${scenario.id}`} x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur result="coloredBlur" stdDeviation="1.4" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect fill={`url(#floor-${scenario.id})`} height="100" width="100" />

            <g opacity="0.9">
              <rect fill="#101710" height="8" rx="1.2" width="64" x="16" y="17" />
              <rect fill="#101710" height="8" rx="1.2" width="56" x="28" y="35" />
              <rect fill="#101710" height="8" rx="1.2" width="66" x="12" y="53" />
              <rect fill="#101710" height="8" rx="1.2" width="50" x="24" y="72" />
              <g stroke="#263326" strokeWidth="0.35">
                {Array.from({ length: 8 }).map((_, index) => (
                  <line key={`rack-${index}`} x1={19 + index * 7} x2={19 + index * 7} y1="17" y2="25" />
                ))}
                {Array.from({ length: 7 }).map((_, index) => (
                  <line key={`rack-mid-${index}`} x1={31 + index * 7} x2={31 + index * 7} y1="35" y2="43" />
                ))}
                {Array.from({ length: 8 }).map((_, index) => (
                  <line key={`rack-low-${index}`} x1={15 + index * 7.5} x2={15 + index * 7.5} y1="53" y2="61" />
                ))}
              </g>
            </g>

            <g opacity="0.72">
              <rect fill="rgba(251,191,36,0.16)" height="16" rx="2" stroke="#fbbf24" strokeDasharray="2 2" strokeWidth="0.45" width="18" x="49" y="41" />
              <rect fill="rgba(118,185,0,0.12)" height="18" rx="2" stroke="#76B900" strokeWidth="0.45" width="18" x="75" y="20" />
              <rect fill="rgba(34,211,238,0.1)" height="16" rx="2" stroke="#67e8f9" strokeWidth="0.45" width="18" x="9" y="67" />
            </g>

            {showBin ? (
              <g opacity="0.95">
                <rect fill="#141a16" height="17" rx="2" stroke="#3f4b42" strokeWidth="0.7" width="18" x="31" y="27" />
                <circle cx="36" cy="34" fill="#76B900" opacity="0.72" r="2.3" />
                <circle cx="42" cy="36" fill="#67e8f9" opacity="0.62" r="1.8" />
                <path d="M62 69h14l-3 8H59z" fill="#111913" stroke="#3f4b42" strokeWidth="0.6" />
              </g>
            ) : null}

            {showHuman ? (
              <g filter={`url(#soft-glow-${scenario.id})`} opacity="0.9">
                <circle cx="56" cy="44" fill="rgba(251,191,36,0.14)" r="8" stroke="#fbbf24" strokeDasharray="2 2" strokeWidth="0.55" />
                <circle cx="56" cy="44" fill="#fbbf24" r="1.8" />
                <path d="M56 46v5m-3-2 3-3 3 3" stroke="#fef3c7" strokeLinecap="round" strokeWidth="0.8" />
              </g>
            ) : null}

            <polyline fill="none" opacity="0.5" points={routePoints} stroke="#6b7280" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
            <polyline className={isRunning ? "route-flow" : ""} fill="none" points={routePoints} stroke="#67e8f9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.7" />
            <polyline fill="none" points={completedPoints} stroke={robotColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />

            {scenario.trace.map((step, index) => (
              <g key={step.title} opacity={index <= activeStep ? 1 : 0.35}>
                <circle cx={step.position.x} cy={step.position.y} fill={index <= activeStep ? robotColor : "#64748b"} r="1.3" />
                <text fill="#cbd5e1" fontSize="2.2" x={step.position.x + 2.2} y={step.position.y - 1.8}>
                  {index + 1}
                </text>
              </g>
            ))}

            <m.g
              animate={{ x: activeTrace.position.x, y: activeTrace.position.y }}
              initial={false}
              transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
            >
              <circle className={isRunning ? "sensor-ring" : ""} fill="none" r="9" stroke={robotColor} strokeOpacity="0.34" strokeWidth="0.7" />
              <path className={isRunning ? "sensor-sweep" : ""} d="M0 0 13 -5 A14 14 0 0 1 13 5Z" fill="rgba(103,232,249,0.16)" />
              <rect fill="#0f172a" height="7" rx="1.6" stroke={robotColor} strokeWidth="0.8" width="9" x="-4.5" y="-3.5" />
              <circle cx="2.4" cy="0" fill={robotColor} r="1.1" />
              <path d="M-2.6-1.6h2.8M-2.6 1.6h2.8" stroke="#d1fae5" strokeLinecap="round" strokeWidth="0.55" />
            </m.g>
          </svg>

          <div className="absolute bottom-4 left-4 right-4 z-10 grid gap-2 md:grid-cols-3">
            {activeTrace.telemetry.map((item) => (
              <div key={item.label} className="rounded-lg border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-md">
                <p className="text-xs uppercase text-muted">{item.label}</p>
                <p className={item.tone === "watch" ? "mt-1 text-sm text-amber-100" : "mt-1 text-sm text-text-primary"}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 border-l border-white/15 pl-3 text-sm leading-6 text-text-primary/80">
          {activeTrace.evidence}
        </p>
      </div>
    </section>
  );
}

function AgentPlaygroundPage() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState(playgroundScenarios[0].id);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const selectedScenario =
    playgroundScenarios.find((scenario) => scenario.id === selectedId) ?? playgroundScenarios[0];
  const visibleSteps = isRunning
    ? selectedScenario.trace.slice(0, activeStep + 1)
    : selectedScenario.trace;
  const activeTrace = selectedScenario.trace[activeStep] ?? selectedScenario.trace[0];

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    if (prefersReducedMotion) {
      setActiveStep(selectedScenario.trace.length - 1);
      setIsRunning(false);
      return undefined;
    }

    if (activeStep >= selectedScenario.trace.length - 1) {
      const timer = window.setTimeout(() => setIsRunning(false), 520);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setActiveStep((step) => Math.min(step + 1, selectedScenario.trace.length - 1));
    }, 760);

    return () => window.clearTimeout(timer);
  }, [activeStep, isRunning, prefersReducedMotion, selectedScenario.trace.length]);

  const selectScenario = (scenarioId: string) => {
    setSelectedId(scenarioId);
    setIsRunning(false);
    setActiveStep(0);
  };

  const runScenario = () => {
    setActiveStep(0);
    setIsRunning(true);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-bg text-text-primary">
      <div className="fixed inset-0 -z-10">
        <img alt="" className="h-full w-full object-cover opacity-32" src={HERO_IMAGE} srcSet={HERO_IMAGE_SRCSET} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.76),#050505_66%),radial-gradient(circle_at_64%_18%,rgba(118,185,0,0.18),transparent_32%)]" />
      </div>

      <header className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-5 md:px-8">
        <a
          aria-label="Back to Zach Wright portfolio"
          className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/10 bg-bg/80 px-3 py-2 text-sm text-text-primary backdrop-blur-md transition-colors hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary"
          href="/"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#76B900] p-[1px]">
            <span className="grid h-full w-full place-items-center rounded-full bg-bg font-display text-[11px] italic leading-none">
              ZW
            </span>
          </span>
          <span>Physical AI Playground</span>
        </a>
        <div className="flex items-center gap-2">
          <a
            className="hidden min-h-11 items-center gap-2 rounded-full border border-white/10 bg-bg/70 px-4 py-2 text-sm text-muted backdrop-blur-md transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary sm:inline-flex"
            href="https://developer.nvidia.com/omniverse?size=n_12_n&sort-field=featured&sort-direction=desc"
          >
            NVIDIA Omniverse
            <ArrowIcon className="h-4 w-4" />
          </a>
          <a
            className="hidden min-h-11 items-center gap-2 rounded-full border border-white/10 bg-bg/70 px-4 py-2 text-sm text-muted backdrop-blur-md transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary md:inline-flex"
            href={GITHUB_URL}
          >
            Code record
            <ArrowIcon className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-5 px-5 pb-10 md:px-8 xl:grid-cols-[20rem_minmax(0,1fr)_23rem]">
        <aside className="grid content-start gap-5">
          <section className="rounded-lg border border-white/10 bg-bg/78 p-4 backdrop-blur-xl">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-muted">Scenario queue</p>
                <h1 className="mt-2 text-2xl leading-tight md:text-3xl">Robot test bench</h1>
              </div>
              <span className="rounded-full border border-[#76B900]/25 bg-[#76B900]/10 px-2.5 py-1 text-xs text-[#d6ff99]">
                Local demo
              </span>
            </div>

            <div className="space-y-2">
              {playgroundScenarios.map((scenario) => {
                const selected = scenario.id === selectedScenario.id;
                return (
                  <button
                    key={scenario.id}
                    className={`w-full rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary ${
                      selected
                        ? "border-[#76B900]/45 bg-[#76B900]/10 text-text-primary"
                        : "border-white/10 bg-white/[0.03] text-muted hover:border-white/20 hover:text-text-primary"
                    }`}
                    onClick={() => selectScenario(scenario.id)}
                    type="button"
                  >
                    <span className="block text-sm font-medium">{scenario.title}</span>
                    <span className="mt-2 block text-xs leading-5 text-muted">{scenario.scene}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="text-xs uppercase text-muted">Test objective</p>
              <p className="mt-3 text-sm leading-6 text-text-primary/85">{selectedScenario.intent}</p>
              <button
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#76B900] px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                onClick={runScenario}
                type="button"
              >
                {isRunning ? "Running simulation" : "Run simulation"}
                <ArrowIcon className="h-4 w-4" />
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-bg/78 p-4 backdrop-blur-xl">
            <p className="text-xs uppercase text-muted">NVIDIA handoff path</p>
            <p className="mt-3 text-sm leading-6 text-text-primary/85">{selectedScenario.nvidiaPath}</p>
          </section>
        </aside>

        <div className="grid min-w-0 content-start gap-5">
          <section className="rounded-lg border border-white/10 bg-bg/78 p-4 backdrop-blur-xl md:p-5">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase text-muted">Active model test</p>
                <h2 className="mt-2 text-4xl leading-tight md:text-5xl">{selectedScenario.title}</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">{selectedScenario.outcome}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {selectedScenario.capabilities.map((capability) => (
                  <span key={capability} className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-text-primary/85">
                    {capability}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <SimulationStage
            activeStep={activeStep}
            isRunning={isRunning}
            prefersReducedMotion={prefersReducedMotion}
            scenario={selectedScenario}
          />

          <section className="rounded-lg border border-white/10 bg-bg/78 p-4 backdrop-blur-xl md:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-muted">Run timeline</p>
                <h2 className="mt-2 text-2xl leading-tight">Trace and evidence</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-muted">
                Step {activeStep + 1}/{selectedScenario.trace.length}
              </span>
            </div>

            <div className="grid gap-3">
              {visibleSteps.map((step, index) => {
                const current = index === activeStep;
                return (
                  <m.article
                    key={`${selectedScenario.id}-${step.title}`}
                    animate={{ opacity: 1, y: 0 }}
                    className={`grid gap-4 rounded-lg border p-4 transition-colors md:grid-cols-[8rem_1fr] ${
                      current ? "border-[#76B900]/35 bg-[#76B900]/10" : "border-white/10 bg-white/[0.025]"
                    }`}
                    initial={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div>
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${kindStyles[step.kind] ?? kindStyles.plan}`}>
                        {step.kind}
                      </span>
                      <p className="mt-3 text-xs uppercase text-muted">{step.agent}</p>
                    </div>
                    <div>
                      <h3 className="text-xl leading-tight text-text-primary">{step.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-muted">{step.detail}</p>
                      <p className="mt-4 border-l border-white/15 pl-3 text-sm text-text-primary/85">{step.evidence}</p>
                    </div>
                  </m.article>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="grid content-start gap-5">
          <section className="rounded-lg border border-white/10 bg-bg/78 p-4 backdrop-blur-xl">
            <p className="text-xs uppercase text-muted">Test design</p>
            <div className="mt-4 grid gap-2">
              {selectedScenario.tests.map((test) => (
                <div key={test.label} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                  <span className="text-sm text-muted">{test.label}</span>
                  <span className={`rounded-full border px-2.5 py-1 text-xs ${toneClasses(test.tone)}`}>{test.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-bg/78 p-4 backdrop-blur-xl">
            <p className="text-xs uppercase text-muted">Tool stack</p>
            <div className="mt-4 space-y-3">
              {selectedScenario.tools.map((tool) => (
                <div key={tool.label} className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-mono text-sm text-text-primary">{tool.label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{tool.status}</p>
                  </div>
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#76B900]" />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-bg/78 p-4 backdrop-blur-xl">
            <p className="text-xs uppercase text-muted">Eval gates</p>
            <div className="mt-4 grid gap-2">
              {selectedScenario.evals.map((evaluation) => (
                <div key={evaluation.label} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                  <span className="text-sm text-muted">{evaluation.label}</span>
                  <span className={`rounded-full border px-2.5 py-1 text-xs ${toneClasses(evaluation.tone)}`}>
                    {evaluation.result}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-bg/78 p-4 backdrop-blur-xl">
            <p className="text-xs uppercase text-muted">Artifacts</p>
            <div className="mt-4 grid gap-2">
              {selectedScenario.artifacts.map((artifact) => (
                <a
                  key={artifact.href}
                  className="group flex min-h-11 items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm transition-colors hover:border-text-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary"
                  href={artifact.href}
                >
                  <span>{artifact.label}</span>
                  <span className="inline-flex items-center gap-2 text-xs text-muted">
                    {artifact.metric}
                    <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-bg/78 p-4 backdrop-blur-xl">
            <p className="text-xs uppercase text-muted">Scoped memory</p>
            <ul className="mt-4 space-y-3">
              {selectedScenario.memory.map((memory) => (
                <li key={memory} className="text-sm leading-6 text-text-primary/85">
                  {memory}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </main>
    </div>
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
  const isPlayground = location.pathname.startsWith(PLAYGROUND_URL);

  useEffect(() => {
    document.title = isPlayground
      ? "Physical AI Playground | Zach Wright"
      : "Zach Wright | Software Engineering Portfolio";
  }, [isPlayground]);

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
            {isPlayground ? <AgentPlaygroundPage /> : <PortfolioPage />}
          </m.main>
        </AnimatePresence>
      </LazyMotion>
    </MotionConfig>
  );
}
