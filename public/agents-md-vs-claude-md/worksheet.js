(() => {
  "use strict";

  const canonicalInput = document.querySelector("#canonical-instructions");
  const companionInput = document.querySelector("#companion-instructions");
  const tool = document.querySelector(".drift-tool");
  const verdict = document.querySelector("#drift-verdict");
  const summary = document.querySelector("#drift-summary");
  const duplicateCount = document.querySelector("#duplicate-rule-count");
  const volatileCount = document.querySelector("#volatile-rule-count");
  const pointerState = document.querySelector("#canonical-pointer-state");
  const byteCount = document.querySelector("#combined-byte-count");
  const copyButton = document.querySelector("#copy-drift-summary");
  const clearButton = document.querySelector("#clear-drift-worksheet");
  const actionStatus = document.querySelector("#drift-action-status");
  const encoder = new TextEncoder();

  if (
    !canonicalInput ||
    !companionInput ||
    !tool ||
    !verdict ||
    !summary ||
    !duplicateCount ||
    !volatileCount ||
    !pointerState ||
    !byteCount ||
    !copyButton ||
    !clearButton ||
    !actionStatus
  ) {
    return;
  }

  const volatileRulePattern =
    /\b(?:build|branch|commit|deploy|install|merge|publish|release|test|verify)\b|(?:^|\s)(?:git|make|npm|npx|pnpm|pytest|uv|yarn)\s|(?:scripts?|docs?|\.github)\//i;

  let currentReport = "";

  function normalizedRules(value) {
    return new Set(
      value
        .split(/\r?\n/)
        .map((line) =>
          line
            .trim()
            .replace(/^[-*+]\s+/, "")
            .replace(/^\d+[.)]\s+/, "")
            .replace(/\s+/g, " "),
        )
        .filter(
          (line) =>
            line.length >= 24 &&
            !line.startsWith("#") &&
            !line.startsWith("```") &&
            !line.startsWith("<!--"),
        )
        .map((line) => line.toLocaleLowerCase("en-US")),
    );
  }

  function setEmptyState() {
    tool.dataset.state = "empty";
    verdict.textContent = "Add both files";
    summary.textContent =
      "Nothing leaves this browser. Add both instruction files to inspect their relationship.";
    duplicateCount.textContent = "—";
    volatileCount.textContent = "—";
    pointerState.textContent = "—";
    byteCount.textContent = "—";
    copyButton.disabled = true;
    currentReport = "";
  }

  function render() {
    const canonicalValue = canonicalInput.value.trim();
    const companionValue = companionInput.value.trim();
    actionStatus.textContent = "";

    if (!canonicalValue || !companionValue) {
      setEmptyState();
      return;
    }

    const canonicalRules = normalizedRules(canonicalValue);
    const companionRules = normalizedRules(companionValue);
    const repeatedRules = [...canonicalRules].filter((rule) =>
      companionRules.has(rule),
    );
    const volatileRules = repeatedRules.filter((rule) =>
      volatileRulePattern.test(rule),
    );
    const hasCanonicalPointer = /\bagents\.md\b/i.test(companionValue);
    const combinedBytes =
      encoder.encode(canonicalValue).length +
      encoder.encode(companionValue).length;

    duplicateCount.textContent = String(repeatedRules.length);
    volatileCount.textContent = String(volatileRules.length);
    pointerState.textContent = hasCanonicalPointer ? "Named" : "Missing";
    byteCount.textContent = combinedBytes.toLocaleString("en-US");
    copyButton.disabled = false;

    if (volatileRules.length > 0) {
      tool.dataset.state = "review";
      verdict.textContent = "Review volatile copies";
      summary.textContent =
        "At least one repeated command, path, workflow, or release rule can drift in two places.";
    } else if (repeatedRules.length > 0) {
      tool.dataset.state = "review";
      verdict.textContent = "Review duplicated policy";
      summary.textContent =
        "The companion repeats shared instruction text. Name one owner before the copies diverge.";
    } else if (!hasCanonicalPointer) {
      tool.dataset.state = "review";
      verdict.textContent = "Name the canonical owner";
      summary.textContent =
        "No exact repeated rule was found, but the companion does not point readers to AGENTS.md.";
    } else {
      tool.dataset.state = "thin";
      verdict.textContent = "Thin-adapter signal";
      summary.textContent =
        "No exact repeated rule was found and the companion names AGENTS.md as the shared source.";
    }

    currentReport = [
      "WrightOps browser-local instruction drift worksheet",
      `State: ${verdict.textContent}`,
      `Exact repeated rules: ${repeatedRules.length}`,
      `Volatile duplicates: ${volatileRules.length}`,
      `Companion names AGENTS.md: ${hasCanonicalPointer ? "yes" : "no"}`,
      `Combined UTF-8 bytes: ${combinedBytes}`,
      "Boundary: exact-line evidence only; no semantic validation, upload, storage, or repository execution.",
    ].join("\n");
  }

  async function copyReport() {
    if (!currentReport) {
      return;
    }

    try {
      await navigator.clipboard.writeText(currentReport);
      actionStatus.textContent = "Evidence summary copied.";
    } catch {
      actionStatus.textContent =
        "Clipboard access failed. Keep the worksheet open and copy the visible metrics.";
    }
  }

  function clearWorksheet() {
    canonicalInput.value = "";
    companionInput.value = "";
    setEmptyState();
    actionStatus.textContent = "Local inputs cleared.";
    canonicalInput.focus();
  }

  canonicalInput.addEventListener("input", render);
  companionInput.addEventListener("input", render);
  copyButton.addEventListener("click", copyReport);
  clearButton.addEventListener("click", clearWorksheet);
  setEmptyState();
})();
