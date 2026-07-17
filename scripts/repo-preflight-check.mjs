import assert from "node:assert/strict";

import {
  RepositoryPreflightError,
  parseRepositoryInput,
  runRepositoryPreflight,
  scoreRepositorySnapshot,
} from "../src/repoPreflight.mjs";

const parsedUrl = parseRepositoryInput(
  "https://github.com/wrightops-ai/agent-ready-repo-auditor/",
);
assert.deepEqual(parsedUrl, {
  owner: "wrightops-ai",
  repository: "agent-ready-repo-auditor",
  slug: "wrightops-ai/agent-ready-repo-auditor",
});
assert.equal(parseRepositoryInput("owner/repo.git").slug, "owner/repo");

for (const invalid of [
  "",
  "https://gitlab.com/owner/repo",
  "https://github.com/owner/repo/tree/main",
  "owner",
  "-owner/repo",
]) {
  assert.throws(
    () => parseRepositoryInput(invalid),
    RepositoryPreflightError,
    invalid,
  );
}

const revisionSha = "a".repeat(40);
const treeSha = "b".repeat(40);
const filePaths = [
  "README.md",
  "AGENTS.md",
  ".env.example",
  ".github/workflows/ci.yml",
  ".github/ISSUE_TEMPLATE/bug.yml",
  ".github/pull_request_template.md",
  "package.json",
  "tests/example.test.js",
];
const files = new Map(
  filePaths.map((path, index) => [
    path,
    {
      path,
      sha: String(index + 1).padStart(40, "0"),
      size: 100,
    },
  ]),
);
const snapshot = {
  archived: false,
  defaultBranch: "main",
  files,
  fullName: "owner/repo",
  revisionSha,
  treeSha,
  webUrl: "https://github.com/owner/repo",
};
const source = (path) =>
  `https://github.com/owner/repo/blob/${revisionSha}/${path}`;
const textFiles = new Map([
  [
    "README.md",
    {
      path: "README.md",
      sourceUrl: source("README.md"),
      text: "# Repo\n\n## Setup\n\nRun `npm install`.\n\n## Tests\n\nRun `npm test`.",
    },
  ],
  [
    "AGENTS.md",
    {
      path: "AGENTS.md",
      sourceUrl: source("AGENTS.md"),
      text: "Run npm test. Do not deploy without explicit approval.",
    },
  ],
  [
    ".github/workflows/ci.yml",
    {
      path: ".github/workflows/ci.yml",
      sourceUrl: source(".github/workflows/ci.yml"),
      text: "name: Tests\nsteps:\n  - run: npm test\n",
    },
  ],
  [
    "package.json",
    {
      path: "package.json",
      sourceUrl: source("package.json"),
      text: '{"scripts":{"test":"node --test"}}',
    },
  ],
]);

const complete = scoreRepositorySnapshot(snapshot, textFiles);
assert.equal(complete.score.earned, 100);
assert.equal(complete.score.percentage, 100);
assert.equal(complete.score.band, "well_evidenced");
assert.equal(complete.checks.length, 7);
assert.equal(complete.nextSteps.length, 0);
assert.ok(
  complete.checks
    .flatMap((check) => check.evidence)
    .every((evidence) => evidence.sourceUrl.includes(revisionSha)),
);

const limitedFiles = new Map([
  [
    "README.md",
    {
      path: "README.md",
      sha: "1".repeat(40),
      size: 50,
    },
  ],
]);
const limited = scoreRepositorySnapshot(
  { ...snapshot, files: limitedFiles },
  new Map([
    [
      "README.md",
      {
        path: "README.md",
        sourceUrl: source("README.md"),
        text: "# Repo\n",
      },
    ],
  ]),
);
assert.equal(limited.score.earned, 8);
assert.equal(limited.score.band, "limited_public_evidence");
assert.ok(
  limited.nextSteps.some((step) => step.includes("root AGENTS.md")),
);

function jsonResponse(status, payload, headers = {}) {
  return {
    headers: new Headers(headers),
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return payload;
    },
  };
}

const apiCalls = [];
const fakeFetch = async (url) => {
  const parsed = new URL(url);
  apiCalls.push(`${parsed.pathname}${parsed.search}`);
  if (parsed.pathname === "/repos/owner/repo") {
    return jsonResponse(200, {
      archived: false,
      default_branch: "main",
      full_name: "owner/repo",
      html_url: "https://github.com/owner/repo",
      private: false,
    });
  }
  if (parsed.pathname === "/repos/owner/repo/commits/main") {
    return jsonResponse(200, {
      commit: { tree: { sha: treeSha } },
      sha: revisionSha,
    });
  }
  if (parsed.pathname === `/repos/owner/repo/git/trees/${treeSha}`) {
    return jsonResponse(200, {
      tree: [
        {
          path: "README.md",
          sha: "c".repeat(40),
          size: 48,
          type: "blob",
        },
      ],
      truncated: false,
    });
  }
  if (parsed.pathname === `/repos/owner/repo/git/blobs/${"c".repeat(40)}`) {
    return jsonResponse(200, {
      content: btoa("# Repo\n\n## Setup\n\nRun `npm install`.\n"),
      encoding: "base64",
      size: 42,
    });
  }
  throw new Error(`Unexpected fake API request: ${url}`);
};

const liveShape = await runRepositoryPreflight("owner/repo", {
  fetchImpl: fakeFetch,
});
assert.equal(liveShape.repository.revisionSha, revisionSha);
assert.equal(liveShape.score.earned, 20);
assert.deepEqual(apiCalls, [
  "/repos/owner/repo",
  "/repos/owner/repo/commits/main",
  `/repos/owner/repo/git/trees/${treeSha}?recursive=1`,
  `/repos/owner/repo/git/blobs/${"c".repeat(40)}`,
]);

await assert.rejects(
  runRepositoryPreflight("owner/missing", {
    fetchImpl: async () => jsonResponse(404, {}),
  }),
  (error) =>
    error instanceof RepositoryPreflightError &&
    error.code === "repository_inaccessible",
);

await assert.rejects(
  runRepositoryPreflight("owner/rate-limited", {
    fetchImpl: async () =>
      jsonResponse(403, {}, { "x-ratelimit-remaining": "0" }),
  }),
  (error) =>
    error instanceof RepositoryPreflightError && error.code === "rate_limit",
);

console.log(
  JSON.stringify(
    {
      ok: true,
      parserCases: 7,
      scoreChecks: complete.checks.length,
      completeScore: complete.score.earned,
      fetchCalls: apiCalls.length,
      limitedScore: limited.score.earned,
    },
    null,
    2,
  ),
);
