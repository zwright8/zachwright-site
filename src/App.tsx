import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  useReducedMotion,
} from "framer-motion";
import type { Material, Mesh, Object3D } from "three";
import { type MouseEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
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
type PlaygroundRenderMode = "rtx" | "segmentation" | "depth" | "sensor";
type ThreeModule = typeof import("three");

type PlaygroundAsset = {
  id: string;
  label: string;
  path: string;
  status: string;
  type: string;
};

type PlaygroundTraceStep = {
  agent: string;
  detail: string;
  evidence: string;
  kind: string;
  position: { x: number; y: number };
  telemetry: Array<{ label: string; tone?: PlaygroundTone; value: string }>;
  title: string;
};

type PlaygroundFact = {
  label: string;
  tone?: PlaygroundTone;
  value: string;
};

type PlaygroundScenario = {
  artifacts: Array<{ href: string; label: string; metric: string }>;
  assets: PlaygroundAsset[];
  capabilities: string[];
  evals: Array<{ label: string; result: string; tone: PlaygroundTone }>;
  failureCriteria?: PlaygroundFact[];
  hardware?: PlaygroundFact[];
  id: string;
  intent: string;
  memory: string[];
  model: string;
  nvidiaPath: string;
  outcome: string;
  primRoot: string;
  runtime: string;
  scene: string;
  simulationMode?: PlaygroundFact[];
  successCriteria?: PlaygroundFact[];
  tests: Array<{ label: string; status: string; tone: PlaygroundTone }>;
  title: string;
  tools: Array<{ label: string; status: string }>;
  trace: PlaygroundTraceStep[];
  trainingMetrics?: PlaygroundFact[];
};

const playgroundScenarios: PlaygroundScenario[] = [
  {
    id: "forklift",
    title: "Robotic forklift stacking trial",
    scene: "High-bay warehouse bay B-12",
    model: "Deterministic demo + Isaac Lab policy plan",
    nvidiaPath: "Isaac Sim full_warehouse.usd -> rigged forklift USD -> ROS 2 sensor graph -> Isaac Lab policy eval -> Replicator SDG expansion",
    primRoot: "/World/ForkliftWarehouse",
    runtime: "Browser WebGL deterministic trace; production run targets Isaac Sim forklift assets and an ovrtx/ovstream viewer",
    intent:
      "Validate an autonomous forklift that retrieves a 480 kg pallet from inbound staging, drives a mixed warehouse aisle, stacks it into rack bay B-12 level 2, then retrieves a return pallet without rack contact, load drop, or safety-zone breach.",
    outcome: "Pass when stacking and retrieval stay inside pose, clearance, load-stability, safety, and cycle-time gates",
    capabilities: ["Rigged 7-DOF forklift", "Prismatic fork lift", "RTX LiDAR + RGB-D", "ROS 2 bridge", "Replicator SDG", "Isaac Lab curriculum"],
    assets: [
      { id: "forklift", label: "Autonomous Forklift F-12", path: "/World/ForkliftWarehouse/Robots/Forklift_Rigged_01", status: "scripted eval", type: "robot articulation" },
      { id: "forks", label: "Fork Carriage + Tines", path: "/World/ForkliftWarehouse/Robots/Forklift_Rigged_01/Forks", status: "0.2-1.6 m lift", type: "actuated prismatic joint" },
      { id: "pallet", label: "Inbound Pallet P-42", path: "/World/ForkliftWarehouse/Pallets/Inbound_Pallet_42", status: "480 kg payload", type: "dynamic rigid body" },
      { id: "rack", label: "Rack Bay B-12 Level 2", path: "/World/ForkliftWarehouse/Racks/Bay_B12/Level_02", status: "target slot", type: "warehouse collider" },
      { id: "scanner", label: "Safety Scanner 270", path: "/World/ForkliftWarehouse/Sensors/SafetyScanner_270", status: "zone armed", type: "safety sensor" },
      { id: "camera", label: "RGB-D Mast Camera", path: "/World/ForkliftWarehouse/Sensors/RGBD_Mast", status: "ROS 2 topics", type: "perception sensor" },
    ],
    tools: [
      { label: "full_warehouse.usd", status: "Isaac Sim warehouse with racks, obstacles, pallets, and forklifts" },
      { label: "forklift_b_rigged_cm.usd", status: "Rigged forklift reference with seven DOF and actuated fork joint" },
      { label: "anim_robot.yaml", status: "Forklift MoveTo, Turn, Idle, and Sequence action graph" },
      { label: "ros2.bridge", status: "RGB, depth, camera info, TF, odometry, and command topics" },
      { label: "replicator.writer", status: "Randomized pallet pose, rack occlusion, lights, labels, and depth" },
      { label: "isaaclab.task", status: "RL/IL curriculum, reward terms, and multi-seed policy gates" },
    ],
    memory: [
      "Treat a visually clean stack as a failure if fork depth, clearance, or load sway misses the physical gate.",
      "Run retrieval after stacking so the policy proves it can recover from the exact rack pose it created.",
      "Keep browser playback as the executive demo; Isaac Sim logs, USD captures, and ROS bags are the deployable evidence.",
    ],
    tests: [
      { label: "Rack approach alignment", status: "pass", tone: "pass" },
      { label: "Fork insertion clearance", status: "watch", tone: "watch" },
      { label: "Lift and pallet stability", status: "pass", tone: "pass" },
      { label: "Retrieval cycle", status: "pass", tone: "pass" },
    ],
    simulationMode: [
      { label: "Website runtime", value: "Deterministic Three.js trace: route points, lift height, sensor volumes, and telemetry are scripted from scenario data.", tone: "pass" },
      { label: "ML status", value: "No trained forklift policy runs in this browser demo; training is the Isaac Lab handoff defined below.", tone: "watch" },
      { label: "Trial result", value: "The scripted single run reaches a pass gate; 94% is the multi-seed policy target that still needs training.", tone: "pass" },
    ],
    successCriteria: [
      { label: "Place pose", value: "<= 5 cm XY and <= 3 deg yaw", tone: "pass" },
      { label: "Fork depth", value: ">= 85% tine insertion before lift", tone: "pass" },
      { label: "Load sway", value: "< 2 deg after stop and lift", tone: "pass" },
      { label: "Contacts", value: "0 rack, fork, human, or pallet-drop contacts", tone: "pass" },
      { label: "Cycle", value: "Stack + retrieve <= 90 s", tone: "watch" },
    ],
    failureCriteria: [
      { label: "Collision", value: "Any rack/fork collision or pallet drop", tone: "watch" },
      { label: "Mis-slot", value: "> 8 cm from rack slot center", tone: "watch" },
      { label: "Under-insert", value: "< 75% tine depth before lift", tone: "watch" },
      { label: "Safety", value: "Human/obstacle within 0.5 m protective field", tone: "watch" },
      { label: "Instability", value: "> 5 deg pallet tilt or > 0.15 g slip spike", tone: "watch" },
    ],
    trainingMetrics: [
      { label: "Reward terms", value: "Pose, fork depth, clearance, load stability, time" },
      { label: "Policy target", value: "94% current / 98% target in Isaac Lab", tone: "watch" },
      { label: "Curriculum", value: "Empty pallet -> 480 kg load -> occluded rack" },
      { label: "Randomization", value: "1,280 seeds for lights, pallet mass, friction, rack pose" },
      { label: "Artifacts", value: "USD capture, ROS bag, Replicator labels, Isaac Lab metrics" },
    ],
    hardware: [
      { label: "Compute", value: "Jetson AGX Orin Industrial or x86 RTX workstation" },
      { label: "Vehicle", value: "Differential-drive forklift sample with mast, carriage, and fork DOF" },
      { label: "Sensors", value: "RTX LiDAR, RGB-D mast camera, IMU, fork-height encoder, load cell" },
      { label: "Safety", value: "270 deg protective scanner plus supervised stop state" },
      { label: "Actuation", value: "Traction drive, steer/drive joints, prismatic fork lift, mast tilt" },
    ],
    trace: [
      {
        agent: "Scene Builder",
        detail:
          "Loads the full warehouse stage, replaces the generic vehicle with the rigged forklift asset, assigns pallet mass/friction, and marks rack bay B-12 level 2 as the target slot.",
        evidence: "full_warehouse.usd, forklift_b_rigged_cm.usd, payload P-42 mass 480 kg",
        kind: "sim",
        position: { x: 34, y: 62 },
        telemetry: [
          { label: "Sim", value: "00:00" },
          { label: "Payload", value: "480 kg", tone: "pass" },
          { label: "Fork", value: "0.20 m", tone: "pass" },
        ],
        title: "Build the forklift world",
      },
      {
        agent: "Perception",
        detail:
          "Uses RGB-D, LiDAR, and fork-height telemetry to align the tines with the pallet pockets before the lift controller is allowed to raise.",
        evidence: "Pallet pocket offset 1.8 cm, tine insertion 92%, camera + depth topics live",
        kind: "sensor",
        position: { x: 42, y: 58 },
        telemetry: [
          { label: "Offset", value: "1.8 cm", tone: "pass" },
          { label: "Tine", value: "92%", tone: "pass" },
          { label: "Slip", value: "0.04 g", tone: "pass" },
        ],
        title: "Acquire the pallet",
      },
      {
        agent: "Lift Controller",
        detail:
          "Approaches the rack, raises the carriage to level 2, nudges the pallet into the target bay, and verifies clearance before backing out.",
        evidence: "Lift 1.62 m, mast tilt 2 deg, rack side clearance 7.5 cm",
        kind: "stack",
        position: { x: 56, y: 52 },
        telemetry: [
          { label: "Lift", value: "1.62 m", tone: "pass" },
          { label: "Clear", value: "7.5 cm", tone: "watch" },
          { label: "Contact", value: "0", tone: "pass" },
        ],
        title: "Stack level B-12",
      },
      {
        agent: "Recovery Policy",
        detail:
          "Runs the inverse maneuver against the placed pallet, proving the policy can retrieve its own stack without dragging the rack or tipping the load.",
        evidence: "Pose error 3.2 cm, load sway 1.1 deg, no rack contact",
        kind: "retrieve",
        position: { x: 64, y: 47 },
        telemetry: [
          { label: "Error", value: "3.2 cm", tone: "pass" },
          { label: "Sway", value: "1.1 deg", tone: "pass" },
          { label: "Rack", value: "clear", tone: "pass" },
        ],
        title: "Retrieve the return pallet",
      },
      {
        agent: "Verifier",
        detail:
          "Scores success rate, intervention count, pose error, load stability, cycle time, and the randomization seeds that should become the next training batch.",
        evidence: "94% multi-seed success, 0 interventions, cycle 82 s, next batch expands tight-clearance racks",
        kind: "gate",
        position: { x: 76, y: 38 },
        telemetry: [
          { label: "Success", value: "94%", tone: "watch" },
          { label: "Cycle", value: "82 s", tone: "pass" },
          { label: "Gate", value: "trial pass", tone: "pass" },
        ],
        title: "Score the experiment",
      },
    ],
    evals: [
      { label: "Scripted trial result", result: "pass", tone: "pass" },
      { label: "Placement error", result: "3.2 cm", tone: "pass" },
      { label: "Rack/fork contacts", result: "0", tone: "pass" },
      { label: "Policy target", result: "94%", tone: "watch" },
    ],
    artifacts: [
      { href: "https://docs.isaacsim.omniverse.nvidia.com/5.1.0/assets/usd_assets_environments.html", label: "Warehouse USD assets", metric: "scene" },
      { href: "https://docs.isaacsim.omniverse.nvidia.com/5.1.0/robot_setup_tutorials/rig_mobile_robot.html", label: "Forklift rigging", metric: "robot" },
      { href: "https://docs.isaacsim.omniverse.nvidia.com/6.0.0/action_and_event_data_generation/ext_replicator-agent/ext_isaacsim_anim_robot.html", label: "Forklift action graph", metric: "control" },
      { href: "https://docs.isaacsim.omniverse.nvidia.com/6.0.0/replicator_tutorials/tutorial_replicator_scene_based_sdg.html", label: "Replicator SDG", metric: "dataset" },
      { href: "https://developer.nvidia.com/isaac/lab", label: "Isaac Lab", metric: "training" },
    ],
  },
  {
    id: "route",
    title: "AMR route validation",
    scene: "Warehouse aisle digital twin",
    model: "Nav policy + occupancy planner",
    nvidiaPath: "Omniverse libraries -> Isaac Sim -> Isaac Lab policy eval",
    primRoot: "/World/Warehouse_A",
    runtime: "Browser WebGL demo; ovrtx/ovstream runtime not connected",
    intent:
      "Stress-test an autonomous mobile robot through a warehouse route with blocked aisles, pallet shadows, and a human crossing zone.",
    outcome: "Pass when the robot reroutes without entering the safety envelope",
    capabilities: ["OpenUSD scene", "PhysX contacts", "LiDAR + RGB", "ROS2 bridge"],
    assets: [
      { id: "amr", label: "AMR-07", path: "/World/Warehouse_A/Robots/AMR_07", status: "navigating", type: "robot" },
      { id: "rack", label: "Rack Row B", path: "/World/Warehouse_A/Racks/Row_B", status: "static collider", type: "warehouse asset" },
      { id: "pallet", label: "Blocked Pallet P-17", path: "/World/Warehouse_A/Props/Pallet_P17", status: "dynamic obstacle", type: "prop" },
      { id: "human", label: "Worker H-03", path: "/World/Warehouse_A/Actors/Worker_H03", status: "crossing zone", type: "actor" },
    ],
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
    primRoot: "/World/PickCell_A",
    runtime: "Browser WebGL demo; Isaac manipulation runtime not connected",
    intent:
      "Compare grasp candidates for a cluttered bin where reflective parts, bad normals, and occluded edges break naive pick policies.",
    outcome: "Pass when the robot picks the target without disturbing adjacent parts",
    capabilities: ["RGB-D camera", "Articulation", "Contact sensors", "Synthetic motion"],
    assets: [
      { id: "arm", label: "Manipulator UR-Style Arm", path: "/World/PickCell_A/Robots/Arm_01", status: "planning grasp", type: "robot articulation" },
      { id: "bin", label: "Mixed Part Bin", path: "/World/PickCell_A/Bins/Tote_04", status: "segmented", type: "container" },
      { id: "target", label: "Reflective Target Part", path: "/World/PickCell_A/Parts/Target_11", status: "grasp candidate", type: "part" },
      { id: "camera", label: "RGBD Camera", path: "/World/PickCell_A/Sensors/RGBD_Top", status: "streaming", type: "sensor" },
    ],
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
    primRoot: "/World/SafetyAisle",
    runtime: "Browser WebGL demo; SIL/HIL runtime not connected",
    intent:
      "Demonstrate a supervisor that detects a human entering the route and switches from navigation to controlled stop before recovery.",
    outcome: "Pass when stop time and restart conditions satisfy the safety case",
    capabilities: ["Actor injection", "Safety envelope", "Supervisor state", "Recovery policy"],
    assets: [
      { id: "amr", label: "AMR Safety Runner", path: "/World/SafetyAisle/Robots/AMR_Safe", status: "supervised", type: "robot" },
      { id: "human", label: "Worker Crossing", path: "/World/SafetyAisle/Actors/Worker_H11", status: "yellow zone", type: "actor" },
      { id: "zone", label: "Safety Envelope", path: "/World/SafetyAisle/Safety/Envelope", status: "armed", type: "safety volume" },
      { id: "gate", label: "Restart Gate", path: "/World/SafetyAisle/Controls/RestartGate", status: "clear pending", type: "control" },
    ],
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
    primRoot: "/World/InspectionStation",
    runtime: "Browser WebGL demo; Replicator runtime not connected",
    intent:
      "Generate a test packet for perception models by randomizing lights, camera pose, object color, defects, and background clutter.",
    outcome: "Pass when coverage expands the hard cases without corrupt labels",
    capabilities: ["Domain randomization", "RGB + depth labels", "Defect injection", "Dataset QA"],
    assets: [
      { id: "camera", label: "Synthetic Camera Rig", path: "/World/InspectionStation/Sensors/CameraRig", status: "128-frame sweep", type: "sensor" },
      { id: "target", label: "Inspection Target", path: "/World/InspectionStation/Parts/TargetPanel", status: "defect variants", type: "asset" },
      { id: "light", label: "Randomized Light Rig", path: "/World/InspectionStation/Lights/AreaRig", status: "domain randomized", type: "light" },
      { id: "dataset", label: "Label Export Packet", path: "/World/InspectionStation/Outputs/DatasetPacket", status: "QA running", type: "dataset" },
    ],
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
  retrieve: "border-blue-300/30 bg-blue-300/10 text-blue-100",
  risk: "border-amber-200/30 bg-amber-200/10 text-amber-100",
  sensor: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
  sim: "border-[#76B900]/35 bg-[#76B900]/10 text-[#d6ff99]",
  stack: "border-orange-200/30 bg-orange-200/10 text-orange-100",
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

function scenarioPointToVector(THREE: ThreeModule, step: PlaygroundTraceStep) {
  return new THREE.Vector3((step.position.x - 50) / 7.5, 0.28, (step.position.y - 50) / 7.5);
}

function getPlaygroundScenarioById(scenarioId: string | null | undefined) {
  return playgroundScenarios.find((scenario) => scenario.id === scenarioId) ?? playgroundScenarios[0];
}

function readInitialPlaygroundScenario() {
  if (typeof window === "undefined") {
    return playgroundScenarios[0];
  }

  return getPlaygroundScenarioById(new URLSearchParams(window.location.search).get("scenario"));
}

function readInitialPlaygroundStep(scenario: PlaygroundScenario) {
  if (typeof window === "undefined") {
    return 0;
  }

  const stepParam = new URLSearchParams(window.location.search).get("step");
  if (stepParam === "final") {
    return scenario.trace.length - 1;
  }

  const parsedStep = Number.parseInt(stepParam ?? "", 10);
  if (!Number.isFinite(parsedStep)) {
    return 0;
  }

  return Math.min(Math.max(parsedStep - 1, 0), scenario.trace.length - 1);
}

function replacePlaygroundScenarioParam(scenarioId: string) {
  if (typeof window === "undefined") {
    return;
  }

  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("scenario", scenarioId);
  nextUrl.searchParams.delete("step");
  window.history.replaceState(null, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
}

function materialForMode(THREE: ThreeModule, color: number, renderMode: PlaygroundRenderMode, index = 0) {
  if (renderMode === "segmentation") {
    const colors = [0x76b900, 0x22d3ee, 0xfbbf24, 0xf472b6, 0xa3e635, 0x60a5fa];
    return new THREE.MeshStandardMaterial({
      color: colors[index % colors.length],
      emissive: colors[index % colors.length],
      emissiveIntensity: 0.08,
      roughness: 0.58,
      metalness: 0.05,
    });
  }

  if (renderMode === "depth") {
    const shade = 0x333a3f + index * 0x111111;
    return new THREE.MeshStandardMaterial({
      color: shade,
      emissive: 0x0b1113,
      roughness: 0.82,
      metalness: 0.02,
    });
  }

  if (renderMode === "sensor") {
    return new THREE.MeshStandardMaterial({
      color,
      emissive: 0x052a2f,
      emissiveIntensity: 0.22,
      roughness: 0.5,
      metalness: 0.12,
      wireframe: index % 3 === 0,
    });
  }

  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.48,
    metalness: 0.18,
  });
}

function addSelectable(
  mesh: Object3D,
  assetId: string,
  selectable: Object3D[],
  label?: string,
) {
  mesh.userData.assetId = assetId;
  mesh.userData.assetLabel = label ?? assetId;
  selectable.push(mesh);
  return mesh;
}

function createBox(
  THREE: ThreeModule,
  size: [number, number, number],
  position: [number, number, number],
  material: Material,
  assetId: string,
  selectable: Object3D[],
  label?: string,
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return addSelectable(mesh, assetId, selectable, label);
}

function ThreeSimulationViewport({
  activeStep,
  isRunning,
  onSelectAsset,
  prefersReducedMotion,
  renderMode,
  resetSignal,
  scenario,
  selectedAssetId,
}: {
  activeStep: number;
  isRunning: boolean;
  onSelectAsset: (assetId: string) => void;
  prefersReducedMotion: boolean | null;
  renderMode: PlaygroundRenderMode;
  resetSignal: number;
  scenario: PlaygroundScenario;
  selectedAssetId: string;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const activeStepRef = useRef(activeStep);
  const runningRef = useRef(isRunning);
  const selectedAssetRef = useRef(selectedAssetId);

  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep]);

  useEffect(() => {
    runningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    selectedAssetRef.current = selectedAssetId;
  }, [selectedAssetId]);

  useEffect(() => {
    let cleanupScene: (() => void) | undefined;
    let cancelled = false;

    void import("three").then((THREE) => {
      if (cancelled) {
        return;
      }

      const mount = mountRef.current;
      if (!mount) {
        return;
      }

      mount.replaceChildren();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050706);
    scene.fog = new THREE.Fog(0x050706, 10, 31);

    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.className = "h-full w-full";
    renderer.domElement.dataset.testid = "omniverse-3d-canvas";
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0x93a19a, 0.55);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(7, 11, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    scene.add(key);

    const cyanLight = new THREE.PointLight(0x22d3ee, 2.2, 15);
    cyanLight.position.set(-5, 4, 3);
    scene.add(cyanLight);

    const greenLight = new THREE.PointLight(0x76b900, 2.5, 18);
    greenLight.position.set(5, 5, -5);
    scene.add(greenLight);

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: renderMode === "depth" ? 0x111820 : 0x0a0d0a,
      roughness: 0.72,
      metalness: 0.06,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 18), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(24, 24, renderMode === "sensor" ? 0x22d3ee : 0x31402f, 0x152014);
    grid.position.y = 0.012;
    scene.add(grid);

    const selectable: Object3D[] = [];
    const assetObjects = new Map<string, Object3D[]>();
    const registerAsset = (object: Object3D, assetId: string) => {
      const current = assetObjects.get(assetId) ?? [];
      current.push(object);
      assetObjects.set(assetId, current);
      return object;
    };

    const rackMaterial = materialForMode(THREE, 0x1c271f, renderMode, 1);
    const palletMaterial = materialForMode(THREE, 0x7a5432, renderMode, 2);
    const binMaterial = materialForMode(THREE, 0x172332, renderMode, 3);

    for (let row = 0; row < 4; row += 1) {
      const z = -6 + row * 3.7;
      const rack = createBox(THREE, [10.5, 0.55, 0.62], [-0.7, 1.1, z], rackMaterial, "rack", selectable, "Rack Row");
      registerAsset(rack, "rack");
      for (let bay = 0; bay < 6; bay += 1) {
        const shelf = createBox(
          THREE,
          [0.1, 1.7, 0.72],
          [-5.2 + bay * 1.85, 1.12, z],
          rackMaterial,
          "rack",
          selectable,
          "Rack Upright",
        );
        registerAsset(shelf, "rack");
      }
    }

    for (let index = 0; index < 7; index += 1) {
      const pallet = createBox(
        THREE,
        [1.05, 0.42, 0.8],
        [-5.7 + index * 1.75, 0.24, -2.4 + (index % 2) * 0.5],
        palletMaterial,
        index === 3 ? "pallet" : "rack",
        selectable,
        "Pallet Stack",
      );
      registerAsset(pallet, index === 3 ? "pallet" : "rack");
    }

    const route = scenario.trace.map((step) => scenarioPointToVector(THREE, step));
    const isForkliftScenario = scenario.id === "forklift";
    const isPickCellScenario = scenario.id === "pick";
    const isDatasetScenario = scenario.id === "dataset";
    const isMobileRobotScenario = isForkliftScenario || scenario.id === "route" || scenario.id === "safety";
    const stationaryRigPosition = isPickCellScenario
      ? new THREE.Vector3(2.8, 0, -1.4)
      : isDatasetScenario
        ? new THREE.Vector3(-2.8, 0, 2.6)
        : null;
    const routeGeometry = new THREE.BufferGeometry().setFromPoints(route.map((point) => point.clone().setY(0.08)));
    const routeLine = new THREE.Line(
      routeGeometry,
      new THREE.LineBasicMaterial({ color: renderMode === "depth" ? 0x94a3b8 : 0x76b900, linewidth: 2 }),
    );
    scene.add(routeLine);

    const breadcrumbMaterial = new THREE.MeshStandardMaterial({
      color: 0x76b900,
      emissive: 0x76b900,
      emissiveIntensity: 0.35,
      roughness: 0.4,
    });
    route.forEach((point, index) => {
      const marker = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), breadcrumbMaterial);
      marker.position.copy(point).setY(0.12);
      marker.scale.setScalar(index <= activeStepRef.current ? 1.2 : 0.72);
      scene.add(marker);
    });

    const robotGroup = new THREE.Group();
    const robotAssetId = isPickCellScenario ? "arm" : isForkliftScenario ? "forklift" : isDatasetScenario ? "camera" : "amr";
    const robotBaseSize: [number, number, number] =
      isForkliftScenario
        ? [1.78, 0.38, 1.14]
        : isPickCellScenario
          ? [0.8, 0.36, 0.8]
          : isDatasetScenario
            ? [0.82, 0.22, 0.72]
            : [1.45, 0.34, 1.02];
    const robotTopSize: [number, number, number] =
      isForkliftScenario
        ? [0.82, 0.72, 0.74]
        : isPickCellScenario
          ? [0.5, 0.32, 0.5]
          : isDatasetScenario
            ? [0.62, 0.38, 0.46]
            : [1.08, 0.56, 0.76];
    const robotTopBaseY = isForkliftScenario ? 0.78 : isPickCellScenario || isDatasetScenario ? 0.52 : 0.72;
    const robotTopPosition: [number, number, number] =
      isForkliftScenario ? [-0.28, robotTopBaseY, 0.08] : [0.04, robotTopBaseY, 0];
    let forkliftLiftGroup: Object3D | null = null;
    let sensorCone: Mesh | null = null;
    let safetyZone: Mesh | null = null;
    const robotBase = createBox(
      THREE,
      robotBaseSize,
      [0, 0.23, 0],
      materialForMode(THREE, 0x162034, renderMode, 0),
      robotAssetId,
      selectable,
      isForkliftScenario ? "Forklift Chassis" : isPickCellScenario ? "Manipulator Pedestal" : isDatasetScenario ? "Camera Rig Base" : "Autonomous Robot",
    );
    const robotTop = createBox(
      THREE,
      robotTopSize,
      robotTopPosition,
      materialForMode(THREE, 0x76b900, renderMode, 4),
      robotAssetId,
      selectable,
      isForkliftScenario ? "Forklift Counterweight" : isPickCellScenario ? "Arm Rotary Base" : isDatasetScenario ? "Capture Controller" : "Robot Body",
    );
    robotGroup.add(robotBase, robotTop);

    if (isMobileRobotScenario) {
      const wheelMaterial = materialForMode(THREE, 0x050607, renderMode, 5);
      for (const x of isForkliftScenario ? [-0.66, 0.66] : [-0.52, 0.52]) {
        for (const z of isForkliftScenario ? [-0.46, 0.46] : [-0.42, 0.42]) {
          const wheelRadius = isForkliftScenario ? 0.22 : 0.17;
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.18, 18), wheelMaterial);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(x, 0.16, z);
          robotGroup.add(wheel);
        }
      }
    }

    if (isForkliftScenario) {
      const mastMaterial = materialForMode(THREE, 0x334155, renderMode, 6);
      const forkMaterial = materialForMode(THREE, 0xd8dee9, renderMode, 7);
      const scannerMaterial = materialForMode(THREE, 0x22d3ee, renderMode, 8);
      const mastParts = [
        createBox(THREE, [0.08, 1.85, 0.08], [-0.44, 1.04, -0.62], mastMaterial, "forks", selectable, "Left Mast Rail"),
        createBox(THREE, [0.08, 1.85, 0.08], [0.44, 1.04, -0.62], mastMaterial, "forks", selectable, "Right Mast Rail"),
        createBox(THREE, [0.98, 0.08, 0.08], [0, 1.84, -0.62], mastMaterial, "forks", selectable, "Mast Crossbar"),
      ];
      mastParts.forEach((part) => {
        registerAsset(part, "forks");
        robotGroup.add(part);
      });

      const liftGroup = new THREE.Group();
      forkliftLiftGroup = liftGroup;
      const liftParts = [
        createBox(THREE, [0.92, 0.12, 0.1], [0, 0.38, -0.7], forkMaterial, "forks", selectable, "Fork Carriage"),
        createBox(THREE, [0.16, 0.08, 1.25], [-0.34, 0.2, -1.22], forkMaterial, "forks", selectable, "Left Fork Tine"),
        createBox(THREE, [0.16, 0.08, 1.25], [0.34, 0.2, -1.22], forkMaterial, "forks", selectable, "Right Fork Tine"),
      ];
      liftParts.forEach((part) => {
        registerAsset(part, "forks");
        liftGroup.add(part);
      });

      const carriedPallet = createBox(
        THREE,
        [1.18, 0.46, 0.92],
        [0, 0.54, -1.52],
        palletMaterial,
        "pallet",
        selectable,
        "Carried Pallet P-42",
      );
      registerAsset(carriedPallet, "pallet");
      liftGroup.add(carriedPallet);
      robotGroup.add(liftGroup);

      const scanner = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.18, 24), scannerMaterial);
      scanner.position.set(0, 0.62, -0.72);
      scanner.castShadow = true;
      scanner.rotation.x = Math.PI / 2;
      addSelectable(scanner, "scanner", selectable, "Safety Scanner");
      registerAsset(scanner, "scanner");
      robotGroup.add(scanner);

      const bodyCamera = createBox(
        THREE,
        [0.22, 0.16, 0.28],
        [0.32, 1.25, -0.58],
        scannerMaterial,
        "camera",
        selectable,
        "Mast RGB-D Camera",
      );
      registerAsset(bodyCamera, "camera");
      robotGroup.add(bodyCamera);
    }

    robotGroup.position.copy(stationaryRigPosition ?? route[0] ?? new THREE.Vector3());
    registerAsset(robotGroup, robotAssetId);
    scene.add(robotGroup);

    if (isForkliftScenario) {
      const targetMaterial = materialForMode(THREE, 0x9dff3a, renderMode, 9);
      const slotParts = [
        createBox(THREE, [1.85, 0.08, 0.12], [0.92, 1.62, 0.36], targetMaterial, "rack", selectable, "Target Slot Front Beam"),
        createBox(THREE, [1.85, 0.08, 0.12], [0.92, 1.18, 0.36], targetMaterial, "rack", selectable, "Target Slot Lower Beam"),
        createBox(THREE, [0.1, 1.0, 0.16], [0.02, 1.4, 0.36], targetMaterial, "rack", selectable, "Target Slot Left Upright"),
        createBox(THREE, [0.1, 1.0, 0.16], [1.82, 1.4, 0.36], targetMaterial, "rack", selectable, "Target Slot Right Upright"),
      ];
      slotParts.forEach((part) => {
        registerAsset(part, "rack");
        scene.add(part);
      });

      const targetPallet = createBox(
        THREE,
        [1.18, 0.38, 0.86],
        [0.92, 1.38, 0.78],
        new THREE.MeshStandardMaterial({
          color: 0x76b900,
          emissive: 0x3a5e00,
          emissiveIntensity: renderMode === "sensor" ? 0.32 : 0.12,
          opacity: 0.42,
          transparent: true,
          roughness: 0.42,
        }),
        "rack",
        selectable,
        "Target Pallet Ghost",
      );
      registerAsset(targetPallet, "rack");
      scene.add(targetPallet);
    }

    if (isPickCellScenario) {
      const armMaterial = materialForMode(THREE, 0xcbd5e1, renderMode, 6);
      const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.42, 24), armMaterial);
      shoulder.position.set(0, 0.45, 0);
      shoulder.castShadow = true;
      addSelectable(shoulder, "arm", selectable, "Manipulator Shoulder");
      registerAsset(shoulder, "arm");
      robotGroup.add(shoulder);
      const upper = createBox(THREE, [0.26, 1.8, 0.26], [0.38, 1.32, 0.25], armMaterial, "arm", selectable, "Manipulator Link");
      upper.rotation.z = -0.44;
      registerAsset(upper, "arm");
      robotGroup.add(upper);
      const forearm = createBox(THREE, [0.24, 1.46, 0.24], [0.98, 1.25, 1.3], armMaterial, "arm", selectable, "Manipulator Forearm");
      forearm.rotation.z = 0.68;
      registerAsset(forearm, "arm");
      robotGroup.add(forearm);
    }

    if (isPickCellScenario || isDatasetScenario) {
      const binAssetId = isDatasetScenario ? "target" : "bin";
      const bin = createBox(
        THREE,
        [2.4, 0.52, 1.55],
        [2.8, 0.34, 1.7],
        binMaterial,
        binAssetId,
        selectable,
        isDatasetScenario ? "Inspection Target Tray" : "Part Bin",
      );
      registerAsset(bin, binAssetId);
      scene.add(bin);
      for (let i = 0; i < 8; i += 1) {
        const partAssetId = isDatasetScenario ? "target" : i === 2 ? "target" : "bin";
        const part = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18 + (i % 3) * 0.04), materialForMode(THREE, 0x22d3ee, renderMode, i));
        part.position.set(2.1 + (i % 4) * 0.42, 0.76, 1.28 + Math.floor(i / 4) * 0.46);
        part.castShadow = true;
        addSelectable(part, partAssetId, selectable, isDatasetScenario ? "Defect Variant" : "Pick Part");
        registerAsset(part, partAssetId);
        scene.add(part);
      }
    }

    if (isPickCellScenario || isDatasetScenario) {
      const cameraMaterial = materialForMode(THREE, 0x4b5563, renderMode, 8);
      const mast = createBox(THREE, [0.12, 2.2, 0.12], [-2.8, 1.12, 2.6], cameraMaterial, "camera", selectable, "Camera Mast");
      registerAsset(mast, "camera");
      scene.add(mast);

      const cameraHousing = createBox(THREE, [0.64, 0.34, 0.42], [-2.8, 2.28, 1.72], cameraMaterial, "camera", selectable, "RGBD Camera");
      cameraHousing.rotation.x = -0.32;
      registerAsset(cameraHousing, "camera");
      scene.add(cameraHousing);

      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.16, 24), materialForMode(THREE, 0x020617, renderMode, 9));
      lens.rotation.x = Math.PI / 2;
      lens.position.set(-2.8, 2.18, 1.48);
      lens.castShadow = true;
      addSelectable(lens, "camera", selectable, "Camera Lens");
      registerAsset(lens, "camera");
      scene.add(lens);

      const frustum = new THREE.Mesh(
        new THREE.ConeGeometry(0.86, 1.8, 36, 1, true),
        new THREE.MeshBasicMaterial({ color: 0x22d3ee, opacity: renderMode === "sensor" ? 0.22 : 0.12, transparent: true, wireframe: renderMode === "sensor" }),
      );
      frustum.rotation.x = -Math.PI / 2;
      frustum.position.set(-2.8, 1.9, 0.68);
      addSelectable(frustum, "camera", selectable, "Camera Frustum");
      registerAsset(frustum, "camera");
      scene.add(frustum);
    }

    if (scenario.id === "route" || scenario.id === "safety") {
      const humanMaterial = materialForMode(THREE, 0xfbbf24, renderMode, 7);
      const human = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.72, 8, 16), humanMaterial);
      body.position.y = 0.78;
      body.castShadow = true;
      addSelectable(body, "human", selectable, "Worker Actor");
      human.add(body);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), humanMaterial);
      head.position.y = 1.32;
      addSelectable(head, "human", selectable, "Worker Head");
      human.add(head);
      human.position.set(1.25, 0, -0.5);
      registerAsset(human, "human");
      scene.add(human);
    }

    if (scenario.id === "safety") {
      const gateMaterial = materialForMode(THREE, 0xfbbf24, renderMode, 10);
      const gateLeft = createBox(THREE, [0.16, 1.25, 0.16], [3.55, 0.65, -2.6], gateMaterial, "gate", selectable, "Restart Gate Post");
      const gateRight = createBox(THREE, [0.16, 1.25, 0.16], [4.65, 0.65, -2.6], gateMaterial, "gate", selectable, "Restart Gate Post");
      const gateBar = createBox(THREE, [1.28, 0.12, 0.14], [4.1, 1.24, -2.6], gateMaterial, "gate", selectable, "Restart Gate Bar");
      const gatePanel = createBox(THREE, [0.56, 0.4, 0.08], [4.1, 0.58, -2.45], materialForMode(THREE, 0x162034, renderMode, 11), "gate", selectable, "Restart Gate Panel");
      [gateLeft, gateRight, gateBar, gatePanel].forEach((part) => {
        registerAsset(part, "gate");
        scene.add(part);
      });
    }

    if (isDatasetScenario) {
      const lightRig = createBox(THREE, [0.92, 0.08, 0.54], [-3.85, 3.18, -1.35], materialForMode(THREE, 0xf8fafc, renderMode, 12), "light", selectable, "Randomized Area Light");
      lightRig.rotation.z = 0.18;
      registerAsset(lightRig, "light");
      scene.add(lightRig);

      const lightBeam = new THREE.Mesh(
        new THREE.ConeGeometry(1.24, 2.55, 36, 1, true),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24, opacity: renderMode === "sensor" ? 0.18 : 0.1, transparent: true }),
      );
      lightBeam.position.set(-3.85, 1.78, -1.35);
      addSelectable(lightBeam, "light", selectable, "Light Randomization Cone");
      registerAsset(lightBeam, "light");
      scene.add(lightBeam);

      const datasetPacket = createBox(THREE, [1.44, 0.82, 0.08], [-2.1, 1.02, 3.25], materialForMode(THREE, 0x22d3ee, renderMode, 13), "dataset", selectable, "Label Export Packet");
      registerAsset(datasetPacket, "dataset");
      scene.add(datasetPacket);
    }

    if (isMobileRobotScenario) {
      const zoneAssetId = scenario.id === "safety" ? "zone" : isForkliftScenario ? "scanner" : "human";
      const zoneMaterial = new THREE.MeshBasicMaterial({
        color: scenario.id === "safety" ? 0xfbbf24 : isForkliftScenario ? 0x76b900 : 0x22d3ee,
        transparent: true,
        opacity: renderMode === "sensor" ? 0.22 : 0.13,
        side: THREE.DoubleSide,
      });
      safetyZone = new THREE.Mesh(
        new THREE.RingGeometry(isForkliftScenario ? 1.45 : 1.0, isForkliftScenario ? 2.35 : 1.8, 48),
        zoneMaterial,
      );
      safetyZone.rotation.x = -Math.PI / 2;
      safetyZone.position.set(isForkliftScenario ? 0 : 1.25, 0.045, isForkliftScenario ? 0 : -0.5);
      safetyZone.userData.assetId = zoneAssetId;
      selectable.push(safetyZone);
      registerAsset(safetyZone, zoneAssetId);
      if (isForkliftScenario) {
        robotGroup.add(safetyZone);
      } else {
        scene.add(safetyZone);
      }

      sensorCone = new THREE.Mesh(
        new THREE.ConeGeometry(1.7, 3.4, 48, 1, true),
        new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.16, wireframe: renderMode === "sensor" }),
      );
      sensorCone.rotation.x = Math.PI / 2;
      sensorCone.position.set(0, 0.52, -1.72);
      robotGroup.add(sensorCone);
    }

    const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x9dff3a, transparent: true, opacity: 0.95 });
    const selectionOutline = new THREE.BoxHelper(robotGroup, 0x9dff3a);
    selectionOutline.material = outlineMaterial;
    scene.add(selectionOutline);

    let radius = 13;
    let theta = 0.74;
    let phi = 0.95;
    const target = new THREE.Vector3(0, 0.45, 0);

    const updateCamera = () => {
      const x = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.cos(theta);
      camera.position.set(x, y, z);
      camera.lookAt(target);
    };
    updateCamera();

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      renderer.setSize(Math.max(rect.width, 1), Math.max(rect.height, 1), false);
      camera.aspect = Math.max(rect.width, 1) / Math.max(rect.height, 1);
      camera.updateProjectionMatrix();
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let dragging = false;
    let moved = false;
    let previousX = 0;
    let previousY = 0;

    const pointerToRay = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
    };

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      moved = false;
      previousX = event.clientX;
      previousY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) {
        return;
      }

      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;
      if (Math.abs(dx) + Math.abs(dy) > 3) {
        moved = true;
      }
      theta -= dx * 0.0075;
      phi = Math.min(Math.PI * 0.48, Math.max(0.38, phi + dy * 0.006));
      previousX = event.clientX;
      previousY = event.clientY;
      updateCamera();
    };

    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      renderer.domElement.releasePointerCapture(event.pointerId);

      if (moved) {
        return;
      }

      pointerToRay(event);
      const hits = raycaster.intersectObjects(selectable, true);
      const hit = hits.find((item) => item.object.userData.assetId);
      const assetId = hit?.object.userData.assetId;
      if (typeof assetId === "string") {
        onSelectAsset(assetId);
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      radius = Math.min(22, Math.max(6, radius + event.deltaY * 0.012));
      updateCamera();
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    let frameId = 0;
    const startedAt = window.performance.now();
    const targetPosition = new THREE.Vector3();

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const elapsed = (window.performance.now() - startedAt) / 1000;
      const nextPoint = route[activeStepRef.current] ?? route[0] ?? new THREE.Vector3();
      targetPosition.copy(nextPoint);
      if (isMobileRobotScenario) {
        robotGroup.position.lerp(targetPosition, prefersReducedMotion ? 1 : 0.055);
        const lookPoint = route[Math.min(activeStepRef.current + 1, route.length - 1)] ?? nextPoint;
        robotGroup.lookAt(lookPoint.x, robotGroup.position.y, lookPoint.z);
      } else if (stationaryRigPosition) {
        robotGroup.position.copy(stationaryRigPosition);
      }

      if (isMobileRobotScenario && runningRef.current && !prefersReducedMotion) {
        robotTop.position.y = robotTopBaseY + Math.sin(elapsed * 7) * 0.025;
        if (sensorCone) {
          sensorCone.rotation.z = Math.sin(elapsed * 2.4) * 0.24;
        }
      } else {
        robotTop.position.y = robotTopBaseY;
      }

      if (forkliftLiftGroup) {
        const liftTarget = activeStepRef.current >= 2 ? 0.92 : activeStepRef.current >= 1 ? 0.18 : 0;
        forkliftLiftGroup.position.y += (liftTarget - forkliftLiftGroup.position.y) * (prefersReducedMotion ? 1 : 0.08);
        forkliftLiftGroup.rotation.x = runningRef.current && !prefersReducedMotion ? Math.sin(elapsed * 4.2) * 0.015 : 0;
      }

      if (safetyZone) {
        safetyZone.rotation.z += runningRef.current && !prefersReducedMotion ? 0.006 : 0;
      }
      cyanLight.intensity = 1.8 + Math.sin(elapsed * 1.7) * 0.4;

      const selectedObjects = assetObjects.get(selectedAssetRef.current) ?? [robotGroup];
      const selectedObject = selectedObjects[0] ?? robotGroup;
      selectionOutline.setFromObject(selectedObject);
      selectionOutline.visible = true;
      renderer.render(scene, camera);
    };
    animate();

      cleanupScene = () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      const geometries = new Set<{ dispose: () => void }>();
      const materials = new Set<Material>();
      scene.traverse((object) => {
        const mesh = object as Mesh;
        if (mesh.geometry) {
          geometries.add(mesh.geometry);
        }
        const material = mesh.material;
        if (Array.isArray(material)) {
          material.forEach((item) => materials.add(item));
        } else if (material) {
          materials.add(material);
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      mount.replaceChildren();
      };
    });

    return () => {
      cancelled = true;
      cleanupScene?.();
    };
  }, [onSelectAsset, prefersReducedMotion, renderMode, resetSignal, scenario]);

  return (
    <div
      ref={mountRef}
      aria-label={`${scenario.title} interactive 3D simulation viewport`}
      className="h-[58vh] min-h-[420px] max-h-[620px] w-full cursor-grab overflow-hidden rounded-lg bg-black active:cursor-grabbing"
      data-render-mode={renderMode}
    />
  );
}

function AgentPlaygroundPage() {
  const prefersReducedMotion = useReducedMotion();
  const initialScenarioRef = useRef<PlaygroundScenario | null>(null);
  if (!initialScenarioRef.current) {
    initialScenarioRef.current = readInitialPlaygroundScenario();
  }

  const initialScenario = initialScenarioRef.current;
  const initialStep = readInitialPlaygroundStep(initialScenario);
  const [selectedId, setSelectedId] = useState(initialScenario.id);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(initialStep);
  const [renderMode, setRenderMode] = useState<PlaygroundRenderMode>("rtx");
  const [resetSignal, setResetSignal] = useState(0);
  const [selectedAssetId, setSelectedAssetId] = useState(initialScenario.assets[0].id);
  const selectedScenario = getPlaygroundScenarioById(selectedId);
  const activeTrace = selectedScenario.trace[activeStep] ?? selectedScenario.trace[0];
  const selectedAsset =
    selectedScenario.assets.find((asset) => asset.id === selectedAssetId) ?? selectedScenario.assets[0];
  const renderModes: Array<{ id: PlaygroundRenderMode; label: string }> = [
    { id: "rtx", label: "RTX preview" },
    { id: "segmentation", label: "Segmentation" },
    { id: "depth", label: "Depth" },
    { id: "sensor", label: "Sensors" },
  ];
  const experimentPanels: Array<{ items: PlaygroundFact[]; title: string }> = [];
  if (selectedScenario.simulationMode?.length) {
    experimentPanels.push({ items: selectedScenario.simulationMode, title: "Simulation structure" });
  }
  if (selectedScenario.hardware?.length) {
    experimentPanels.push({ items: selectedScenario.hardware, title: "Hardware model" });
  }
  if (selectedScenario.successCriteria?.length) {
    experimentPanels.push({ items: selectedScenario.successCriteria, title: "Success criteria" });
  }
  if (selectedScenario.failureCriteria?.length) {
    experimentPanels.push({ items: selectedScenario.failureCriteria, title: "Failure criteria" });
  }
  if (selectedScenario.trainingMetrics?.length) {
    experimentPanels.push({ items: selectedScenario.trainingMetrics, title: "Training metrics" });
  }

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
      setIsRunning(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setActiveStep((step) => Math.min(step + 1, selectedScenario.trace.length - 1));
    }, 1100);

    return () => window.clearTimeout(timer);
  }, [activeStep, isRunning, prefersReducedMotion, selectedScenario.trace.length]);

  const selectScenario = (scenarioId: string) => {
    const nextScenario = getPlaygroundScenarioById(scenarioId);
    setSelectedId(nextScenario.id);
    setIsRunning(false);
    setActiveStep(0);
    setSelectedAssetId(nextScenario.assets[0].id);
    setResetSignal((value) => value + 1);
    replacePlaygroundScenarioParam(nextScenario.id);
  };

  const togglePlayback = () => {
    if (!isRunning && activeStep >= selectedScenario.trace.length - 1) {
      setActiveStep(0);
      setResetSignal((value) => value + 1);
    }
    setIsRunning((running) => !running);
  };

  const resetScenario = () => {
    setIsRunning(false);
    setActiveStep(0);
    setSelectedAssetId(selectedScenario.assets[0].id);
    setResetSignal((value) => value + 1);
  };

  const handleSelectAsset = useCallback((assetId: string) => {
    setSelectedAssetId(assetId);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#030403] text-text-primary">
      <div className="fixed inset-0 -z-10">
        <img alt="" className="h-full w-full object-cover opacity-20" src={HERO_IMAGE} srcSet={HERO_IMAGE_SRCSET} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.86),#030403_58%),radial-gradient(circle_at_64%_18%,rgba(118,185,0,0.2),transparent_30%)]" />
      </div>

      <header className="mx-auto flex max-w-[1840px] flex-col items-start justify-between gap-3 px-4 py-4 sm:flex-row sm:items-center md:px-6">
        <a
          aria-label="Back to Zach Wright portfolio"
          className="inline-flex min-h-10 items-center gap-3 rounded-full border border-white/10 bg-black/70 px-3 py-2 text-sm text-text-primary backdrop-blur-md transition-colors hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary"
          href="/"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#76B900] p-[1px]">
            <span className="grid h-full w-full place-items-center rounded-full bg-bg font-display text-[11px] italic leading-none">
              ZW
            </span>
          </span>
          <span>Physical AI Playground</span>
        </a>

        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          <span className="inline-flex min-h-10 items-center rounded-full border border-[#76B900]/25 bg-[#76B900]/10 px-4 py-2 text-xs text-[#d6ff99]">
            WebGL 3D demo active
          </span>
          <span className="hidden min-h-10 items-center rounded-full border border-amber-200/25 bg-amber-200/10 px-4 py-2 text-xs text-amber-100 md:inline-flex">
            Omniverse stream not connected
          </span>
          <a
            className="hidden min-h-10 items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-muted backdrop-blur-md transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary sm:inline-flex"
            href="https://developer.nvidia.com/omniverse?size=n_12_n&sort-field=featured&sort-direction=desc"
          >
            NVIDIA Omniverse
            <ArrowIcon className="h-4 w-4" />
          </a>
          <a
            className="hidden min-h-10 items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-muted backdrop-blur-md transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary lg:inline-flex"
            href={GITHUB_URL}
          >
            Code record
            <ArrowIcon className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1840px] gap-5 px-4 pb-8 md:px-6 xl:grid-cols-[18rem_minmax(0,1fr)] min-[1850px]:grid-cols-[18rem_minmax(0,1fr)_20rem]">
        <aside className="grid min-w-0 content-start gap-4">
          <section className="rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-muted">Stage browser</p>
                <h1 className="mt-2 text-2xl leading-tight">3D robot lab</h1>
              </div>
              <span className="rounded-full border border-[#76B900]/25 bg-[#76B900]/10 px-2.5 py-1 text-xs text-[#d6ff99]">Live</span>
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
          </section>

          <section className="rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
            <p className="text-xs uppercase text-muted">OpenUSD-style prims</p>
            <p className="mt-2 font-mono text-xs text-[#d6ff99]">{selectedScenario.primRoot}</p>
            <div className="mt-4 grid gap-2">
              {selectedScenario.assets.map((asset) => (
                <button
                  key={asset.id}
                  className={`rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary ${
                    asset.id === selectedAsset.id
                      ? "border-[#76B900]/45 bg-[#76B900]/10 text-text-primary"
                      : "border-white/10 bg-white/[0.03] text-muted hover:border-white/20 hover:text-text-primary"
                  }`}
                  onClick={() => setSelectedAssetId(asset.id)}
                  type="button"
                >
                  <span className="block text-sm font-medium">{asset.label}</span>
                  <span className="mt-1 block break-all font-mono text-[11px] leading-4 text-muted">{asset.path}</span>
                </button>
              ))}
            </div>
          </section>
        </aside>

        <div className="grid min-w-0 content-start gap-4 overflow-hidden">
          <section className="overflow-hidden rounded-lg border border-white/10 bg-black/75 backdrop-blur-xl">
            <div className="grid gap-4 border-b border-white/10 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
              <div className="min-w-0">
                <p className="text-xs uppercase text-muted">Interactive physical-AI scene</p>
                <h2 className="mt-2 break-words text-3xl leading-tight md:text-5xl">{selectedScenario.title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{selectedScenario.outcome}</p>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <button
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#76B900] px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary"
                  onClick={togglePlayback}
                  type="button"
                >
                  {isRunning ? "Pause" : "Play scenario"}
                </button>
                <button
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-text-primary transition-colors hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary"
                  onClick={resetScenario}
                  type="button"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="relative">
              <ThreeSimulationViewport
                activeStep={activeStep}
                isRunning={isRunning}
                onSelectAsset={handleSelectAsset}
                prefersReducedMotion={prefersReducedMotion}
                renderMode={renderMode}
                resetSignal={resetSignal}
                scenario={selectedScenario}
                selectedAssetId={selectedAsset.id}
              />

              <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#76B900]/35 bg-black/65 px-3 py-1.5 text-xs text-[#d6ff99] backdrop-blur-md">
                  {renderModes.find((mode) => mode.id === renderMode)?.label}
                </span>
                <span className="rounded-full border border-cyan-300/25 bg-black/65 px-3 py-1.5 text-xs text-cyan-100 backdrop-blur-md">
                  {isRunning ? "Playback running" : "Playback paused"}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-10 grid gap-2 md:grid-cols-3">
                {activeTrace.telemetry.map((item) => (
                  <div key={item.label} className="rounded-lg border border-white/10 bg-black/70 px-3 py-2 backdrop-blur-md">
                    <p className="text-xs uppercase text-muted">{item.label}</p>
                    <p className={item.tone === "watch" ? "mt-1 text-sm text-amber-100" : "mt-1 text-sm text-text-primary"}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
            <div className="grid gap-4 lg:grid-cols-[1fr_0.82fr]">
              <div>
                <p className="text-xs uppercase text-muted">Scenario objective</p>
                <p className="mt-3 text-sm leading-6 text-text-primary/85">{selectedScenario.intent}</p>
                <p className="mt-3 border-l border-white/15 pl-3 text-sm leading-6 text-text-primary/80">{activeTrace.evidence}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted">Render modes</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {renderModes.map((mode) => (
                    <button
                      key={mode.id}
                      className={`rounded-lg border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary ${
                        mode.id === renderMode
                          ? "border-[#76B900]/45 bg-[#76B900]/10 text-text-primary"
                          : "border-white/10 bg-white/[0.03] text-muted hover:text-text-primary"
                      }`}
                      onClick={() => setRenderMode(mode.id)}
                      type="button"
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-muted">Timeline</p>
                <h2 className="mt-2 text-2xl leading-tight">{activeTrace.title}</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-muted">
                Step {activeStep + 1}/{selectedScenario.trace.length}
              </span>
            </div>

            <div className="grid gap-2 md:grid-cols-4">
              {selectedScenario.trace.map((step, index) => (
                <button
                  key={`${selectedScenario.id}-${step.title}`}
                  className={`rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary ${
                    index === activeStep ? "border-[#76B900]/45 bg-[#76B900]/10" : "border-white/10 bg-white/[0.03] hover:border-white/25"
                  }`}
                  onClick={() => {
                    setActiveStep(index);
                    setIsRunning(false);
                  }}
                  type="button"
                >
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] ${kindStyles[step.kind] ?? kindStyles.plan}`}>
                    {step.kind}
                  </span>
                  <span className="mt-3 block text-sm font-medium text-text-primary">{step.title}</span>
                  <span className="mt-2 block text-xs leading-5 text-muted">{step.agent}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="grid min-w-0 content-start gap-4 xl:col-start-2 min-[1850px]:col-start-auto">
          <section className="rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
            <p className="text-xs uppercase text-muted">Selected asset</p>
            <h2 className="mt-2 text-2xl leading-tight">{selectedAsset.label}</h2>
            <div className="mt-4 grid gap-3">
              <div>
                <p className="text-xs uppercase text-muted">Prim path</p>
                <p className="mt-1 break-all font-mono text-xs leading-5 text-text-primary/85">{selectedAsset.path}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">
                  <p className="text-xs uppercase text-muted">Type</p>
                  <p className="mt-1 text-sm text-text-primary">{selectedAsset.type}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">
                  <p className="text-xs uppercase text-muted">Status</p>
                  <p className="mt-1 text-sm text-[#d6ff99]">{selectedAsset.status}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
            <p className="text-xs uppercase text-muted">Omniverse runtime</p>
            <p className="mt-3 text-sm leading-6 text-text-primary/85">{selectedScenario.runtime}</p>
            <div className="mt-4 grid gap-2 text-sm">
              {[
                ["USD renderer", "ovrtx required"],
                ["Browser delivery", "ovstream WebRTC"],
                ["Current viewport", "deterministic Three.js"],
                ["ML policy", selectedScenario.simulationMode?.length ? "Isaac Lab handoff" : "not connected"],
                ["Isaac runtime", "not connected"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 border-b border-white/10 pb-2 last:border-b-0 last:pb-0">
                  <span className="text-muted">{label}</span>
                  <span className={value.includes("not") || value.includes("required") ? "text-amber-100" : "text-text-primary"}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
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

          <section className="rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
            <p className="text-xs uppercase text-muted">Capabilities</p>
            <div className="mt-4 grid gap-2">
              {selectedScenario.capabilities.map((capability) => (
                <span key={capability} className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-text-primary/85">
                  {capability}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
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

          {experimentPanels.map((panel) => (
            <section key={panel.title} className="rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
              <p className="text-xs uppercase text-muted">{panel.title}</p>
              <div className="mt-4 grid gap-2">
                {panel.items.map((item) => (
                  <div key={`${panel.title}-${item.label}`} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-text-primary/90">{item.label}</span>
                      {item.tone ? (
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] ${toneClasses(item.tone)}`}>
                          {item.tone === "pass" ? "target" : "watch"}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
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

          <section className="rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
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

          <section className="rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
            <p className="text-xs uppercase text-muted">NVIDIA handoff path</p>
            <p className="mt-3 text-sm leading-6 text-text-primary/85">{selectedScenario.nvidiaPath}</p>
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
