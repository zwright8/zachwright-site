(function initializeAgentsBuilder(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  root.WrightOpsAgentsBuilder = api;

  if (root.document) {
    api.mount(root.document);
  }
})(typeof globalThis === "object" ? globalThis : window, function agentsBuilderFactory() {
  "use strict";

  const BASE_WORKING_AGREEMENTS = [
    "Read the nearest applicable instruction file before editing.",
    "Keep changes limited to the requested scope.",
    "Preserve unrelated work and existing behavior.",
    "Reuse established project patterns before adding new abstractions.",
    "Do not add dependencies, change public interfaces, or modify deployment settings without explicit approval.",
    "Never add credentials, private URLs, customer data, or other sensitive information to the repository.",
  ];

  const BASE_CHANGE_BOUNDARIES = [
    "Ask before destructive, irreversible, production, credentialed, or paid actions.",
    "Do not broaden a task into unrelated cleanup.",
    "Report missing evidence instead of guessing paths, commands, ownership, or release procedures.",
  ];

  const BASE_COMPLETION = [
    "Summarize the files changed and the behavior affected.",
    "Report the exact verification performed and its result.",
    "Call out anything not tested, any unresolved risk, and any follow-up that still needs an owner.",
  ];

  function cleanText(value) {
    return String(value || "")
      .replace(/\r\n?/g, "\n")
      .trim();
  }

  function nonEmptyLines(value) {
    return cleanText(value)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function bulletLines(value) {
    return nonEmptyLines(value).map((line) =>
      /^[-*]\s+/.test(line) ? line.replace(/^\*\s+/, "- ") : `- ${line}`,
    );
  }

  function commandBlock(heading, value) {
    const lines = nonEmptyLines(value);
    if (!lines.length) {
      return [];
    }

    return [`## ${heading}`, "", "```sh", ...lines, "```", ""];
  }

  function buildAgentsFile(input) {
    const name = cleanText(input.projectName);
    const purpose = cleanText(input.purpose);
    const map = bulletLines(input.repositoryMap);
    const verificationRequirements = bulletLines(input.verificationRequirements);
    const projectBoundaries = bulletLines(input.projectBoundaries);
    const heading = name ? `# ${name} repository instructions` : "# Repository instructions";
    const output = [heading, ""];

    if (purpose) {
      output.push("## Purpose", "", purpose, "");
    }

    if (map.length) {
      output.push("## Repository map", "", ...map, "");
    }

    if (input.nestedInstructions) {
      output.push(
        "## Instruction scope",
        "",
        "- This repository uses nested `AGENTS.md` files.",
        "- Read the nearest applicable file before editing; the closest file to the changed path takes precedence.",
        "",
      );
    }

    output.push(
      "## Working agreements",
      "",
      ...BASE_WORKING_AGREEMENTS.map((line) => `- ${line}`),
      "",
      ...commandBlock("Setup", input.setupCommands),
      ...commandBlock("Verification", input.verificationCommands),
    );

    if (verificationRequirements.length) {
      output.push(
        "## Verification requirements",
        "",
        ...verificationRequirements,
        "",
      );
    }

    if (projectBoundaries.length) {
      output.push("## Project-specific boundaries", "", ...projectBoundaries, "");
    }

    output.push(
      "## Change boundaries",
      "",
      ...BASE_CHANGE_BOUNDARIES.map((line) => `- ${line}`),
      "",
      "## Completion",
      "",
      ...BASE_COMPLETION.map((line) => `- ${line}`),
    );

    return `${output.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
  }

  function evidenceScore(input) {
    return [
      cleanText(input.purpose),
      nonEmptyLines(input.repositoryMap).length,
      nonEmptyLines(input.setupCommands).length,
      nonEmptyLines(input.verificationCommands).length,
      nonEmptyLines(input.verificationRequirements).length,
      nonEmptyLines(input.projectBoundaries).length,
    ].filter(Boolean).length;
  }

  function mount(document) {
    const form = document.querySelector("#agents-builder");
    if (!form) {
      return;
    }

    const elements = {
      projectName: document.querySelector("#project-name"),
      purpose: document.querySelector("#project-purpose"),
      repositoryMap: document.querySelector("#repository-map"),
      setupCommands: document.querySelector("#setup-commands"),
      verificationCommands: document.querySelector("#verification-commands"),
      verificationRequirements: document.querySelector("#verification-requirements"),
      projectBoundaries: document.querySelector("#project-boundaries"),
      nestedInstructions: document.querySelector("#nested-instructions"),
      output: document.querySelector("#generated-agents"),
      score: document.querySelector("#builder-score"),
      meter: document.querySelector("#builder-meter"),
      guidance: document.querySelector("#builder-guidance"),
      lines: document.querySelector("#generated-lines"),
      status: document.querySelector("#builder-status"),
      copy: document.querySelector("#copy-generated"),
      download: document.querySelector("#download-generated"),
    };

    function readInput() {
      return {
        projectName: elements.projectName.value,
        purpose: elements.purpose.value,
        repositoryMap: elements.repositoryMap.value,
        setupCommands: elements.setupCommands.value,
        verificationCommands: elements.verificationCommands.value,
        verificationRequirements: elements.verificationRequirements.value,
        projectBoundaries: elements.projectBoundaries.value,
        nestedInstructions: elements.nestedInstructions.checked,
      };
    }

    function render() {
      const input = readInput();
      const output = buildAgentsFile(input);
      const score = evidenceScore(input);
      const lineCount = output.trimEnd().split("\n").length;

      elements.output.textContent = output;
      elements.score.textContent = `${score} / 6`;
      elements.meter.style.width = `${(score / 6) * 100}%`;
      elements.lines.textContent = `${lineCount} ${lineCount === 1 ? "line" : "lines"}`;
      elements.guidance.textContent =
        score === 6
          ? "All six evidence areas are represented. Verify the generated file before committing it."
          : "Missing evidence stays omitted. Add only facts and commands you have verified.";
      return output;
    }

    form.addEventListener("input", () => {
      elements.status.textContent = "";
      render();
    });

    form.addEventListener("reset", () => {
      window.setTimeout(() => {
        elements.status.textContent = "Builder reset. No data was stored.";
        render();
      }, 0);
    });

    elements.copy.addEventListener("click", async () => {
      const output = render();
      try {
        await navigator.clipboard.writeText(output);
        elements.status.textContent = "Generated AGENTS.md copied to the clipboard.";
      } catch {
        elements.status.textContent = "Copy was unavailable. Use Download AGENTS.md.";
      }
    });

    elements.download.addEventListener("click", () => {
      const output = render();
      const blob = new Blob([output], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "AGENTS.md";
      anchor.hidden = true;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      elements.status.textContent = "Generated AGENTS.md downloaded locally.";
    });

    render();
  }

  return {
    buildAgentsFile,
    evidenceScore,
    mount,
    nonEmptyLines,
  };
});
