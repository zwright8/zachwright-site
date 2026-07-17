const API_BASE = "https://api.github.com";
const MAX_FILE_BYTES = 256_000;
const REQUEST_TIMEOUT_MS = 15_000;

const README_NAMES = ["readme.md", "readme.rst", "readme.txt", "readme"];
const AGENT_INSTRUCTION_PATHS = [
  "agents.md",
  "claude.md",
  ".github/copilot-instructions.md",
  ".cursorrules",
];
const ENV_EXAMPLE_NAMES = [
  ".env.example",
  ".env.sample",
  ".env.template",
  "env.example",
  "example.env",
];
const VERIFY_CONFIG_NAMES = [
  "makefile",
  "justfile",
  "package.json",
  "pyproject.toml",
  "tox.ini",
  "noxfile.py",
  "cargo.toml",
  "go.mod",
  "pom.xml",
  "build.gradle",
  "build.gradle.kts",
];

const SETUP_RE =
  /\b(install|installation|setup|getting started|quickstart|requirements|prerequisites)\b/i;
const COMMAND_RE =
  /(?:^|[\s`])(?:python(?:3)?|pytest|npm|pnpm|yarn|bun|make|just|cargo|go|mvn|gradle|dotnet)\s+[^\s`]/i;
const VERIFY_RE =
  /\b(test|tests|testing|lint|typecheck|type-check|verify|verification|check)\b/i;
const NO_RUNTIME_ENV_RE =
  /^\s*(?:[-*+]\s+)?(?:\*\*|__)?(?:no\s+(?:runtime\s+)?environment(?:\s+variables?|\s+configuration)\s+(?:is|are)\s+(?:required|needed)|(?:runtime\s+)?environment(?:\s+variables?|\s+configuration)\s+(?:is|are)\s+not\s+(?:required|needed)|(?:this|the)\s+(?:project|package|tool|action|application)\s+(?:does\s+not|doesn't)\s+require\s+(?:any\s+)?(?:runtime\s+)?environment(?:\s+variables?|\s+configuration))(?:\*\*|__)?[.!]?\s*$/i;

const RISK_ACTION =
  "deploy|publish|delete|force[- ]push|spend|pay|contact|send|expose|record|download|use credentials?|access production|handle (?:personal|private) data";
const PROHIBITED_ACTION_RE = new RegExp(
  `\\b(?:do not|don't|never|must not)\\s+(?:[a-z-]+\\s+){0,4}(?:${RISK_ACTION})\\b`,
  "i",
);
const APPROVAL_ACTION_RE = new RegExp(
  `(?:\\b(?:${RISK_ACTION})\\b.{0,100}\\b(?:without|requires?|needs?|only after)\\s+(?:explicit\\s+)?(?:approval|permission|confirmation)\\b|\\b(?:ask before|requires? (?:explicit )?(?:approval|permission|confirmation))\\b.{0,100}\\b(?:${RISK_ACTION})\\b)`,
  "i",
);

const NEXT_STEPS = {
  readme_setup:
    "Add or strengthen a root README with prerequisites and copy-paste setup commands.",
  agent_instructions:
    "Add a root AGENTS.md (or another recognized instruction file) with repository-specific coding-agent guidance.",
  environment_example:
    "Add a redacted root environment example, or state explicitly in the root README that runtime environment configuration is not required.",
  continuous_integration:
    "Add a GitHub Actions workflow that runs the repository's documented verification commands.",
  contribution_templates:
    "Add both issue and pull-request templates for structured change requests and reviews.",
  verification:
    "Document and automate repeatable test, lint, or type-check commands.",
  risky_action_boundaries:
    "Document actions that require explicit approval, including destructive, deployment, credential, publishing, or payment operations.",
};

export class RepositoryPreflightError extends Error {
  constructor(message, code = "preflight_error") {
    super(message);
    this.name = "RepositoryPreflightError";
    this.code = code;
  }
}

export function parseRepositoryInput(value) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    throw new RepositoryPreflightError(
      "Enter a public GitHub repository URL or owner/repository.",
      "invalid_repository",
    );
  }

  let parts;
  if (/^https?:\/\//i.test(raw)) {
    let parsed;
    try {
      parsed = new URL(raw);
    } catch {
      throw new RepositoryPreflightError(
        "Enter a valid https://github.com/owner/repository URL.",
        "invalid_repository",
      );
    }
    if (parsed.protocol !== "https:" || parsed.hostname.toLowerCase() !== "github.com") {
      throw new RepositoryPreflightError(
        "Only public github.com repository URLs are supported.",
        "invalid_repository",
      );
    }
    parts = parsed.pathname.split("/").filter(Boolean);
  } else {
    parts = raw
      .replace(/^github\.com\//i, "")
      .replace(/\/+$/, "")
      .split("/")
      .filter(Boolean);
  }

  if (parts.length !== 2) {
    throw new RepositoryPreflightError(
      "Use the repository root URL or owner/repository, without a branch or file path.",
      "invalid_repository",
    );
  }

  const owner = parts[0];
  const repository = parts[1].replace(/\.git$/i, "");
  const validOwner =
    /^(?!-)[A-Za-z0-9-]{1,39}(?<!-)$/.test(owner);
  const validRepository = /^[A-Za-z0-9._-]{1,100}$/.test(repository);

  if (!validOwner || !validRepository || repository === "." || repository === "..") {
    throw new RepositoryPreflightError(
      "That owner/repository value is not a valid public GitHub repository name.",
      "invalid_repository",
    );
  }

  return {
    owner,
    repository,
    slug: `${owner}/${repository}`,
  };
}

export async function runRepositoryPreflight(value, options = {}) {
  const repository = parseRepositoryInput(value);
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  if (typeof fetchImpl !== "function") {
    throw new RepositoryPreflightError(
      "This browser cannot contact the public GitHub API.",
      "fetch_unavailable",
    );
  }

  const owner = encodeURIComponent(repository.owner);
  const name = encodeURIComponent(repository.repository);
  const metadata = await requestJson(
    `/repos/${owner}/${name}`,
    fetchImpl,
    "Repository is private, missing, or unavailable through GitHub's public API.",
  );

  if (metadata.private !== false) {
    throw new RepositoryPreflightError(
      "Private repositories are not supported. Use one public GitHub repository.",
      "private_repository",
    );
  }
  if (
    typeof metadata.full_name !== "string" ||
    typeof metadata.html_url !== "string" ||
    typeof metadata.default_branch !== "string"
  ) {
    throw new RepositoryPreflightError(
      "GitHub returned incomplete repository metadata, so no result was emitted.",
      "invalid_github_response",
    );
  }

  const commit = await requestJson(
    `/repos/${owner}/${name}/commits/${encodeURIComponent(metadata.default_branch)}`,
    fetchImpl,
    "The public default branch could not be resolved.",
  );
  const revisionSha = validSha(commit.sha) ? commit.sha : null;
  const treeSha =
    commit.commit &&
    commit.commit.tree &&
    validSha(commit.commit.tree.sha)
      ? commit.commit.tree.sha
      : null;
  if (!revisionSha || !treeSha) {
    throw new RepositoryPreflightError(
      "GitHub did not return an immutable default-branch revision and tree.",
      "invalid_github_response",
    );
  }

  const tree = await requestJson(
    `/repos/${owner}/${name}/git/trees/${treeSha}?recursive=1`,
    fetchImpl,
    "The public repository tree could not be inspected.",
  );
  if (tree.truncated === true) {
    throw new RepositoryPreflightError(
      "GitHub truncated this repository tree. Missing-file checks would be unreliable, so no partial result was emitted.",
      "truncated_tree",
    );
  }
  if (!Array.isArray(tree.tree)) {
    throw new RepositoryPreflightError(
      "GitHub did not return a complete public file tree.",
      "invalid_github_response",
    );
  }

  const files = new Map();
  for (const entry of tree.tree) {
    if (
      entry &&
      entry.type === "blob" &&
      typeof entry.path === "string" &&
      entry.path &&
      validSha(entry.sha)
    ) {
      files.set(entry.path, {
        path: entry.path,
        sha: entry.sha,
        size: Number.isInteger(entry.size) && entry.size >= 0 ? entry.size : null,
      });
    }
  }

  const snapshot = {
    archived: metadata.archived === true,
    defaultBranch: metadata.default_branch,
    files,
    fullName: metadata.full_name,
    revisionSha,
    treeSha,
    webUrl: metadata.html_url,
  };
  const textFiles = new Map();
  const warnings = [];

  for (const path of contentCandidates(files)) {
    const entry = files.get(path);
    const sourceUrl = immutableFileUrl(snapshot, path);
    if (entry.size !== null && entry.size > MAX_FILE_BYTES) {
      warnings.push(
        `${path}: file exceeds the ${MAX_FILE_BYTES}-byte inspection limit.`,
      );
      textFiles.set(path, { path, sourceUrl, text: null });
      continue;
    }

    try {
      const blob = await requestJson(
        `/repos/${owner}/${name}/git/blobs/${entry.sha}`,
        fetchImpl,
        `GitHub did not return ${path} from the immutable revision.`,
      );
      const decoded = decodeBlob(blob);
      if (decoded.warning) {
        warnings.push(`${path}: ${decoded.warning}`);
      }
      textFiles.set(path, {
        path,
        sourceUrl,
        text: decoded.text,
      });
    } catch (error) {
      if (
        error instanceof RepositoryPreflightError &&
        error.code === "rate_limit"
      ) {
        throw error;
      }
      warnings.push(`${path}: content was not inspectable.`);
      textFiles.set(path, { path, sourceUrl, text: null });
    }
  }

  return scoreRepositorySnapshot(snapshot, textFiles, warnings);
}

export function scoreRepositorySnapshot(snapshot, textFiles = new Map(), warnings = []) {
  const paths = [...snapshot.files.keys()].sort((left, right) =>
    left.localeCompare(right, undefined, { sensitivity: "base" }),
  );
  const pathByLower = new Map(paths.map((path) => [path.toLowerCase(), path]));

  const checks = [
    readmeCheck(snapshot, pathByLower, textFiles),
    agentInstructionsCheck(snapshot, pathByLower, textFiles),
    environmentCheck(snapshot, pathByLower, textFiles),
    continuousIntegrationCheck(snapshot, paths),
    contributionTemplatesCheck(snapshot, paths),
    verificationCheck(snapshot, paths, textFiles),
    riskyActionCheck(snapshot, textFiles),
  ];
  const earned = checks.reduce((sum, check) => sum + check.score, 0);
  const maximum = checks.reduce((sum, check) => sum + check.maxScore, 0);
  const percentage = maximum ? Math.round((earned / maximum) * 100) : 0;
  const inspectionWarnings = [...warnings];
  if (snapshot.archived) {
    inspectionWarnings.push("Repository metadata marks this project as archived.");
  }

  return {
    checks,
    inspectedFiles: [...textFiles.keys()].sort((left, right) =>
      left.localeCompare(right, undefined, { sensitivity: "base" }),
    ),
    inspectionWarnings,
    limitations: [
      "This is an operational coding-agent readiness preflight, not a vulnerability, security, legal, privacy, or compliance assessment.",
      "A missing public artifact means only that this browser did not evidence it in the scanned default-branch snapshot.",
      "The preflight does not execute repository code, verify documentation accuracy, inspect private settings, or prove production safety.",
    ],
    nextSteps: checks
      .filter((check) => check.score < check.maxScore)
      .map((check) => NEXT_STEPS[check.id]),
    repository: {
      archived: snapshot.archived,
      defaultBranch: snapshot.defaultBranch,
      fullName: snapshot.fullName,
      revisionSha: snapshot.revisionSha,
      treeSha: snapshot.treeSha,
      webUrl: snapshot.webUrl,
    },
    score: {
      band: scoreBand(percentage),
      earned,
      maximum,
      percentage,
    },
  };
}

function readmeCheck(snapshot, pathByLower, textFiles) {
  const path = firstPresent(pathByLower, README_NAMES);
  if (!path) {
    return result(
      "readme_setup",
      "README and setup guidance",
      0,
      20,
      "No root README was evidenced.",
    );
  }

  const evidence = [pathEvidence(snapshot, path, "Root README exists.")];
  const item = textFiles.get(path);
  if (!item || item.text === null) {
    return result(
      "readme_setup",
      "README and setup guidance",
      8,
      20,
      "A root README exists, but its setup content was not inspectable.",
      evidence,
    );
  }

  const setupLine = firstLine(item.text, SETUP_RE);
  const commandLine = firstLine(item.text, COMMAND_RE);
  if (setupLine) {
    evidence.push(
      lineEvidence(item, setupLine, "README includes setup-oriented guidance."),
    );
  }
  if (commandLine && commandLine !== setupLine) {
    evidence.push(
      lineEvidence(
        item,
        commandLine,
        "README includes an executable-looking command.",
      ),
    );
  }
  const score = 8 + (setupLine ? 7 : 0) + (commandLine ? 5 : 0);
  return result(
    "readme_setup",
    "README and setup guidance",
    score,
    20,
    score === 20
      ? "Root README and actionable setup evidence were found."
      : "Root README exists, but setup evidence is incomplete.",
    evidence,
  );
}

function agentInstructionsCheck(snapshot, pathByLower, textFiles) {
  const paths = AGENT_INSTRUCTION_PATHS.map((name) =>
    pathByLower.get(name),
  ).filter(Boolean);
  if (!paths.length) {
    return result(
      "agent_instructions",
      "Coding-agent instructions",
      0,
      20,
      "No recognized root coding-agent instruction file was evidenced.",
    );
  }

  const evidence = paths.map((path) =>
    pathEvidence(
      snapshot,
      path,
      "Recognized coding-agent instruction file exists.",
    ),
  );
  const inspectable = paths.some((path) => {
    const item = textFiles.get(path);
    return item && typeof item.text === "string" && item.text.length > 0;
  });
  return result(
    "agent_instructions",
    "Coding-agent instructions",
    inspectable ? 20 : 12,
    20,
    inspectable
      ? "A recognized, inspectable coding-agent instruction file was found."
      : "An instruction file exists, but its content was not inspectable.",
    evidence,
  );
}

function environmentCheck(snapshot, pathByLower, textFiles) {
  const paths = ENV_EXAMPLE_NAMES.map((name) => pathByLower.get(name)).filter(Boolean);
  if (paths.length) {
    return result(
      "environment_example",
      "Runtime environment configuration",
      10,
      10,
      "A root environment example was found.",
      paths.map((path) =>
        pathEvidence(snapshot, path, "Environment example file exists."),
      ),
    );
  }

  const readmePath = firstPresent(pathByLower, README_NAMES);
  const readme = readmePath ? textFiles.get(readmePath) : null;
  if (readme && readme.text !== null) {
    const line = firstLine(readme.text, NO_RUNTIME_ENV_RE);
    if (line) {
      return result(
        "environment_example",
        "Runtime environment configuration",
        10,
        10,
        "The README explicitly states that runtime environment configuration is not required.",
        [
          lineEvidence(
            readme,
            line,
            "README explicitly states that no runtime environment configuration is required.",
          ),
        ],
      );
    }
  }
  return result(
    "environment_example",
    "Runtime environment configuration",
    0,
    10,
    "Neither a recognized root environment example nor an explicit no-configuration statement was evidenced.",
  );
}

function continuousIntegrationCheck(snapshot, paths) {
  const workflows = paths.filter(isWorkflow).slice(0, 5);
  if (!workflows.length) {
    return result(
      "continuous_integration",
      "Continuous integration",
      0,
      15,
      "No GitHub Actions workflow was evidenced.",
    );
  }
  return result(
    "continuous_integration",
    "Continuous integration",
    15,
    15,
    "At least one GitHub Actions workflow was found.",
    workflows.map((path) =>
      pathEvidence(snapshot, path, "GitHub Actions workflow exists."),
    ),
  );
}

function contributionTemplatesCheck(snapshot, paths) {
  const issuePaths = paths
    .filter(
      (path) =>
        path.toLowerCase().startsWith(".github/issue_template/") &&
        !path.endsWith("/"),
    )
    .slice(0, 2);
  const pullRequestPaths = paths
    .filter((path) => {
      const lower = path.toLowerCase();
      return (
        lower === ".github/pull_request_template.md" ||
        lower === "pull_request_template.md" ||
        lower.startsWith(".github/pull_request_template/")
      );
    })
    .slice(0, 2);
  const score = (issuePaths.length ? 5 : 0) + (pullRequestPaths.length ? 5 : 0);
  const summary =
    score === 10
      ? "Issue and pull-request templates were found."
      : score
        ? "Only one of issue or pull-request templates was found."
        : "No issue or pull-request template was evidenced.";
  return result(
    "contribution_templates",
    "Issue and pull-request templates",
    score,
    10,
    summary,
    [
      ...issuePaths.map((path) =>
        pathEvidence(snapshot, path, "Issue template exists."),
      ),
      ...pullRequestPaths.map((path) =>
        pathEvidence(snapshot, path, "Pull-request template exists."),
      ),
    ],
  );
}

function verificationCheck(snapshot, paths, textFiles) {
  const candidates = paths.filter(isVerificationPath).slice(0, 5);
  const contentEvidence = [];
  for (const item of textFiles.values()) {
    if (item.text === null) {
      continue;
    }
    const line = firstLine(item.text, VERIFY_RE);
    if (line) {
      contentEvidence.push(
        lineEvidence(
          item,
          line,
          "Verification-oriented guidance or configuration was found.",
        ),
      );
    }
  }
  const evidence = [
    ...candidates.map((path) =>
      pathEvidence(
        snapshot,
        path,
        "Verification-related file or path exists.",
      ),
    ),
    ...contentEvidence.slice(0, 3),
  ];
  if (candidates.length && contentEvidence.length) {
    return result(
      "verification",
      "Verification commands and automation",
      15,
      15,
      "Verification files and written verification evidence were found.",
      evidence,
    );
  }
  if (candidates.length || contentEvidence.length) {
    return result(
      "verification",
      "Verification commands and automation",
      8,
      15,
      "Some verification evidence was found, but it is incomplete.",
      evidence,
    );
  }
  return result(
    "verification",
    "Verification commands and automation",
    0,
    15,
    "No recognized verification script, configuration, or guidance was evidenced.",
  );
}

function riskyActionCheck(snapshot, textFiles) {
  const evidence = [];
  const ordered = [...textFiles.entries()].sort(([left], [right]) =>
    left.localeCompare(right, undefined, { sensitivity: "base" }),
  );
  for (const [, item] of ordered) {
    if (item.text === null) {
      continue;
    }
    const lines = item.text.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      if (
        PROHIBITED_ACTION_RE.test(lines[index]) ||
        APPROVAL_ACTION_RE.test(lines[index])
      ) {
        evidence.push(
          lineEvidence(
            item,
            index + 1,
            "Explicit risky-action boundary language was found.",
          ),
        );
        break;
      }
    }
  }
  if (evidence.length) {
    return result(
      "risky_action_boundaries",
      "Risky-action boundaries",
      10,
      10,
      "At least one explicit approval or prohibition boundary was evidenced.",
      evidence.slice(0, 5),
    );
  }
  return result(
    "risky_action_boundaries",
    "Risky-action boundaries",
    0,
    10,
    "No explicit approval or prohibition boundary for risky actions was evidenced in inspected guidance.",
  );
}

function result(id, label, score, maxScore, summary, evidence = []) {
  return {
    evidence,
    id,
    label,
    maxScore,
    score,
    status:
      score === maxScore ? "met" : score > 0 ? "partial" : "not_evidenced",
    summary,
  };
}

function pathEvidence(snapshot, path, detail) {
  return {
    detail,
    kind: "path",
    path,
    sourceUrl: immutableFileUrl(snapshot, path),
  };
}

function lineEvidence(item, line, detail) {
  return {
    detail,
    kind: "content",
    line,
    path: item.path,
    sourceUrl: `${item.sourceUrl}#L${line}`,
  };
}

function contentCandidates(files) {
  const paths = [...files.keys()];
  const pathByLower = new Map(paths.map((path) => [path.toLowerCase(), path]));
  const selected = new Set();
  for (const name of [
    ...README_NAMES,
    ...AGENT_INSTRUCTION_PATHS,
    ...VERIFY_CONFIG_NAMES,
  ]) {
    const path = pathByLower.get(name);
    if (path) {
      selected.add(path);
    }
  }
  paths
    .filter(isWorkflow)
    .sort((left, right) =>
      left.localeCompare(right, undefined, { sensitivity: "base" }),
    )
    .slice(0, 5)
    .forEach((path) => selected.add(path));
  for (const path of paths) {
    if (["contributing.md", ".github/contributing.md"].includes(path.toLowerCase())) {
      selected.add(path);
    }
  }
  return [...selected].sort((left, right) =>
    left.localeCompare(right, undefined, { sensitivity: "base" }),
  );
}

function firstPresent(pathByLower, names) {
  for (const name of names) {
    const path = pathByLower.get(name);
    if (path) {
      return path;
    }
  }
  return null;
}

function firstLine(text, pattern) {
  const lines = text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    if (pattern.test(lines[index])) {
      return index + 1;
    }
  }
  return null;
}

function isWorkflow(path) {
  const lower = path.toLowerCase();
  return (
    lower.startsWith(".github/workflows/") &&
    (lower.endsWith(".yml") || lower.endsWith(".yaml"))
  );
}

function isVerificationPath(path) {
  const lower = path.toLowerCase();
  return (
    VERIFY_CONFIG_NAMES.includes(lower) ||
    lower.startsWith("scripts/check") ||
    lower.startsWith("scripts/test") ||
    lower.startsWith("scripts/verify") ||
    lower.startsWith("bin/check") ||
    lower.startsWith("bin/test") ||
    lower.startsWith("bin/verify") ||
    lower.startsWith("test/") ||
    lower.startsWith("tests/")
  );
}

function immutableFileUrl(snapshot, path) {
  const encodedPath = path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${snapshot.webUrl}/blob/${snapshot.revisionSha}/${encodedPath}`;
}

function scoreBand(percentage) {
  if (percentage >= 85) {
    return "well_evidenced";
  }
  if (percentage >= 65) {
    return "partially_evidenced";
  }
  return "limited_public_evidence";
}

function validSha(value) {
  return typeof value === "string" && /^[0-9a-f]{40}$/i.test(value);
}

function decodeBlob(blob) {
  if (
    !Number.isInteger(blob.size) ||
    blob.size < 0 ||
    blob.size > MAX_FILE_BYTES
  ) {
    return {
      text: null,
      warning: `file size was unavailable or exceeded ${MAX_FILE_BYTES} bytes`,
    };
  }
  if (blob.encoding !== "base64" || typeof blob.content !== "string") {
    return {
      text: null,
      warning: "content was not returned as base64 text",
    };
  }
  try {
    const binary = globalThis.atob(blob.content.replace(/\s/g, ""));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    if (bytes.byteLength > MAX_FILE_BYTES) {
      return {
        text: null,
        warning: `decoded content exceeded ${MAX_FILE_BYTES} bytes`,
      };
    }
    return {
      text: new TextDecoder("utf-8", { fatal: true }).decode(bytes),
      warning: null,
    };
  } catch {
    return {
      text: null,
      warning: "content was not valid UTF-8 text",
    };
  }
}

async function requestJson(path, fetchImpl, notFoundMessage) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;
  try {
    response = await fetchImpl(`${API_BASE}${path}`, {
      headers: {
        Accept: "application/vnd.github+json",
      },
      method: "GET",
      signal: controller.signal,
    });
  } catch (error) {
    if (error && error.name === "AbortError") {
      throw new RepositoryPreflightError(
        "GitHub did not respond within 15 seconds. No partial result was emitted.",
        "timeout",
      );
    }
    throw new RepositoryPreflightError(
      "The browser could not reach GitHub's public API. Check the connection and try again.",
      "network_error",
    );
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 404) {
    throw new RepositoryPreflightError(notFoundMessage, "repository_inaccessible");
  }
  if (
    response.status === 429 ||
    (response.status === 403 &&
      response.headers.get("x-ratelimit-remaining") === "0")
  ) {
    throw new RepositoryPreflightError(
      "GitHub's unauthenticated public API limit was reached for this network. Wait for the reset or use the full GitHub Action auditor.",
      "rate_limit",
    );
  }
  if (!response.ok) {
    throw new RepositoryPreflightError(
      `GitHub returned HTTP ${response.status}. No partial result was emitted.`,
      "github_error",
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new RepositoryPreflightError(
      "GitHub returned an unreadable response. No partial result was emitted.",
      "invalid_github_response",
    );
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new RepositoryPreflightError(
      "GitHub returned an unexpected response shape.",
      "invalid_github_response",
    );
  }
  return payload;
}
