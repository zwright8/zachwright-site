const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const page = fs.readFileSync(
  path.join(root, "public", "agents-md-starter-template", "index.html"),
  "utf8",
);
const script = fs.readFileSync(
  path.join(root, "public", "agents-md-starter-template", "builder.js"),
  "utf8",
);
const { buildAgentsFile, evidenceScore, nonEmptyLines } = require(path.join(
  root,
  "public",
  "agents-md-starter-template",
  "builder.js",
));

const empty = buildAgentsFile({});
assert.match(empty, /^# Repository instructions\n/);
assert.match(empty, /## Working agreements/);
assert.match(empty, /## Change boundaries/);
assert.match(empty, /## Completion/);
assert.doesNotMatch(empty, /## Purpose/);
assert.doesNotMatch(empty, /## Setup/);
assert.doesNotMatch(empty, /## Verification/);
assert.doesNotMatch(empty, /## Verification requirements/);
assert.doesNotMatch(empty, /\[verified/);

const completeInput = {
  projectName: "Acme API",
  purpose: "Serves public catalog requests.",
  repositoryMap: "src/ — application source\n* tests/ — automated checks",
  setupCommands: "npm ci",
  verificationCommands: "npm test\nnpm run build",
  verificationRequirements:
    "MongoDB — run the complete database suite\nPostgres — run the complete database suite\nGenerated output — rebuild lib/ before testing",
  projectBoundaries:
    "Do not edit generated/ by hand.\nAsk before changing the public API.",
  nestedInstructions: true,
};
const complete = buildAgentsFile(completeInput);

assert.match(complete, /^# Acme API repository instructions\n/);
assert.match(complete, /## Purpose\n\nServes public catalog requests\./);
assert.match(
  complete,
  /## Repository map\n\n- src\/ — application source\n- tests\/ — automated checks/,
);
assert.match(complete, /## Instruction scope/);
assert.match(complete, /the closest file to the changed path takes precedence/);
assert.match(complete, /## Setup\n\n```sh\nnpm ci\n```/);
assert.match(
  complete,
  /## Verification\n\n```sh\nnpm test\nnpm run build\n```/,
);
assert.match(
  complete,
  /## Verification requirements\n\n- MongoDB — run the complete database suite\n- Postgres — run the complete database suite\n- Generated output — rebuild lib\/ before testing/,
);
assert.match(complete, /## Project-specific boundaries/);
assert.equal(evidenceScore(completeInput), 6);
assert.equal(evidenceScore({ purpose: "Known purpose" }), 1);
assert.deepEqual(nonEmptyLines(" one \n\n two\r\n"), ["one", "two"]);

for (const marker of [
  'id="agents-builder"',
  'id="generated-agents"',
  'id="copy-generated"',
  'id="download-generated"',
  'id="builder-score"',
  'id="builder-meter"',
  'id="builder-status"',
  'id="verification-requirements"',
  'src="/agents-md-starter-template/builder.js"',
  "Nothing is submitted, stored, or sent to WrightOps",
  "Missing evidence stays out of the generated file",
  "Multi-backend, generated-output, and full-suite obligations",
  "WrightOps AGENTS.md Builder",
  '"@type": "WebApplication"',
]) {
  assert.ok(page.includes(marker), `Starter page is missing ${marker}`);
}

for (const forbidden of [
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "<script src=\"http",
  "fetch(",
  "XMLHttpRequest",
  "navigator.sendBeacon",
  "localStorage",
  "sessionStorage",
  "document.cookie",
]) {
  const source = forbidden.startsWith("fonts.") || forbidden.startsWith("<script")
    ? page
    : script;
  assert.ok(!source.includes(forbidden), `Builder must remain browser-local: ${forbidden}`);
}

assert.ok(script.includes("elements.output.textContent = output"));
assert.ok(script.includes('anchor.download = "AGENTS.md"'));
assert.ok(script.includes('new Blob([output], { type: "text/markdown;charset=utf-8" })'));

console.log(
  "AGENTS.md builder check passed: 2 generation cases, 6 evidence gates, browser-local contract.",
);
