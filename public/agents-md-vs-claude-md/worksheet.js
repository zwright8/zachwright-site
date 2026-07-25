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
  const referenceInput = document.querySelector("#reference-instructions");
  const referenceTool = document.querySelector(".reference-tool");
  const referenceResults = document.querySelector(".reference-tool-results");
  const referenceVerdict = document.querySelector("#reference-verdict");
  const referenceSummary = document.querySelector("#reference-summary");
  const referenceCount = document.querySelector("#reference-count");
  const referenceReachableCount = document.querySelector(
    "#reference-reachable-count",
  );
  const referenceMissingCount = document.querySelector(
    "#reference-missing-count",
  );
  const referenceUnavailableCount = document.querySelector(
    "#reference-unavailable-count",
  );
  const referenceResultList = document.querySelector(
    "#reference-result-list",
  );
  const referenceCheckButton = document.querySelector(
    "#check-public-github-references",
  );
  const referenceCopyButton = document.querySelector(
    "#copy-reference-summary",
  );
  const referenceClearButton = document.querySelector(
    "#clear-reference-check",
  );
  const referenceActionStatus = document.querySelector(
    "#reference-action-status",
  );
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
    !actionStatus ||
    !referenceInput ||
    !referenceTool ||
    !referenceResults ||
    !referenceVerdict ||
    !referenceSummary ||
    !referenceCount ||
    !referenceReachableCount ||
    !referenceMissingCount ||
    !referenceUnavailableCount ||
    !referenceResultList ||
    !referenceCheckButton ||
    !referenceCopyButton ||
    !referenceClearButton ||
    !referenceActionStatus
  ) {
    return;
  }

  const volatileRulePattern =
    /\b(?:build|branch|commit|deploy|install|merge|publish|release|test|verify)\b|(?:^|\s)(?:git|make|npm|npx|pnpm|pytest|uv|yarn)\s|(?:scripts?|docs?|\.github)\//i;

  let currentReport = "";
  let currentReferenceReport = "";
  let activeReferenceController = null;
  let referenceRunId = 0;

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

  function extractPublicGitHubRepositories(value) {
    const pattern =
      /https?:\/\/github\.com\/([a-z0-9](?:[a-z0-9.-]{0,38}))\/([a-z0-9_.-]+)/gi;
    const repositories = [];
    const seen = new Set();
    let match = pattern.exec(value);

    while (match) {
      const owner = match[1];
      const repository = match[2]
        .replace(/\.git$/i, "")
        .replace(/[.,;:!?]+$/, "");
      const key = `${owner}/${repository}`.toLocaleLowerCase("en-US");

      if (repository && !seen.has(key)) {
        seen.add(key);
        repositories.push({
          owner,
          repository,
          key,
          publicUrl: `https://github.com/${owner}/${repository}`,
        });
      }

      match = pattern.exec(value);
    }

    return {
      repositories: repositories.slice(0, 10),
      total: repositories.length,
      truncated: repositories.length > 10,
    };
  }

  function setReferenceEmptyState() {
    referenceTool.dataset.state = "empty";
    referenceResults.setAttribute("aria-busy", "false");
    referenceVerdict.textContent = "Add one file";
    referenceSummary.textContent =
      "Nothing leaves this browser until you run the public check.";
    referenceCount.textContent = "—";
    referenceReachableCount.textContent = "—";
    referenceMissingCount.textContent = "—";
    referenceUnavailableCount.textContent = "—";
    referenceResultList.replaceChildren();
    referenceCheckButton.disabled = true;
    referenceCopyButton.disabled = true;
    referenceActionStatus.textContent = "";
    currentReferenceReport = "";
  }

  function renderReferenceInputState() {
    const value = referenceInput.value.trim();
    referenceResults.setAttribute("aria-busy", "false");
    referenceActionStatus.textContent = "";
    referenceResultList.replaceChildren();
    currentReferenceReport = "";
    referenceCopyButton.disabled = true;
    referenceReachableCount.textContent = "—";
    referenceMissingCount.textContent = "—";
    referenceUnavailableCount.textContent = "—";

    if (!value) {
      setReferenceEmptyState();
      return;
    }

    const extracted = extractPublicGitHubRepositories(value);
    referenceCount.textContent = String(extracted.repositories.length);

    if (extracted.repositories.length === 0) {
      referenceTool.dataset.state = "review";
      referenceVerdict.textContent = "No repository URLs";
      referenceSummary.textContent =
        "Add at least one complete https://github.com/owner/repository reference.";
      referenceCheckButton.disabled = true;
      return;
    }

    referenceTool.dataset.state = "ready";
    referenceVerdict.textContent = "Ready for public read";
    referenceSummary.textContent = extracted.truncated
      ? `Ten of ${extracted.total} unique repository references are ready. The bounded check stops at ten.`
      : `${extracted.repositories.length} unique public repository reference${extracted.repositories.length === 1 ? " is" : "s are"} ready to check.`;
    referenceCheckButton.disabled = false;
  }

  function renderReferenceResults(results, extracted, complete) {
    const reachable = results.filter(
      (result) => result.state === "reachable",
    ).length;
    const missing = results.filter((result) => result.state === "missing").length;
    const unavailable = results.filter(
      (result) => result.state === "unavailable",
    ).length;

    referenceCount.textContent = String(extracted.repositories.length);
    referenceReachableCount.textContent = String(reachable);
    referenceMissingCount.textContent = String(missing);
    referenceUnavailableCount.textContent = String(unavailable);
    referenceResultList.replaceChildren(
      ...results.map((result) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        const state = document.createElement("span");

        item.dataset.state = result.state;
        link.href = result.publicUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = result.key;
        state.textContent =
          result.state === "reachable"
            ? "Exact public match"
            : result.state === "missing"
              ? "No exact public match"
              : `Unavailable · HTTP ${result.httpStatus || "network"}`;
        item.append(link, state);
        return item;
      }),
    );

    if (!complete) {
      referenceTool.dataset.state = "checking";
      referenceVerdict.textContent = `Checking ${results.length}/${extracted.repositories.length}`;
      referenceSummary.textContent =
        "Searching public GitHub repository metadata without credentials.";
      return;
    }

    referenceResults.setAttribute("aria-busy", "false");
    referenceCopyButton.disabled = false;

    if (missing > 0) {
      referenceTool.dataset.state = "review";
      referenceVerdict.textContent = "Missing references found";
      referenceSummary.textContent =
        "At least one repository has no exact public search match. Confirm the route and intent with the repository owner before rewriting instructions.";
    } else if (unavailable > 0) {
      referenceTool.dataset.state = "review";
      referenceVerdict.textContent = "Some checks unavailable";
      referenceSummary.textContent =
        "Rate limiting or a network response prevented a complete verdict. Do not treat unavailable as missing.";
    } else {
      referenceTool.dataset.state = "thin";
      referenceVerdict.textContent = "Public routes reachable";
      referenceSummary.textContent =
        "Every checked repository has an exact public search match. This does not validate file paths, branches, permissions, or dependency intent.";
    }

    currentReferenceReport = [
      "WrightOps browser-local public GitHub reference check",
      `State: ${referenceVerdict.textContent}`,
      `Unique repository references checked: ${extracted.repositories.length}`,
      `Exact public matches: ${reachable}`,
      `No exact public match: ${missing}`,
      `Unavailable: ${unavailable}`,
      ...results.map(
        (result) =>
          `${result.key}: ${
            result.state === "reachable"
              ? "exact public match"
              : result.state === "missing"
                ? "no exact public match"
                : `unavailable (HTTP ${result.httpStatus || "network"})`
          }`,
      ),
      extracted.truncated
        ? `Limit: checked the first 10 of ${extracted.total} unique repository references.`
        : "Limit: no more than 10 public repository references per run.",
      "Boundary: exact public repository search only; no file-path, branch, permission, collaborator-access, dependency-intent, security, or semantic validation.",
    ].join("\n");
  }

  async function readPublicRepository(repository, signal) {
    const query = encodeURIComponent(
      `${repository.owner}/${repository.repository} in:name`,
    );
    const apiUrl = `https://api.github.com/search/repositories?q=${query}&per_page=10`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        credentials: "omit",
        headers: {
          Accept: "application/vnd.github+json",
        },
        signal,
      });

      if (response.status === 200) {
        const body = await response.json();
        const exactMatch =
          body.incomplete_results === false &&
          Array.isArray(body.items) &&
          body.items.some(
            (item) =>
              typeof item.full_name === "string" &&
              item.full_name.toLowerCase() === repository.key.toLowerCase(),
          );

        return {
          ...repository,
          state:
            body.incomplete_results === false && Array.isArray(body.items)
              ? exactMatch
                ? "reachable"
                : "missing"
              : "unavailable",
          httpStatus: 200,
        };
      }

      return {
        ...repository,
        state: "unavailable",
        httpStatus: response.status,
      };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }

      return {
        ...repository,
        state: "unavailable",
        httpStatus: null,
      };
    }
  }

  async function checkPublicReferences() {
    const extracted = extractPublicGitHubRepositories(referenceInput.value);

    if (extracted.repositories.length === 0) {
      renderReferenceInputState();
      return;
    }

    activeReferenceController?.abort();
    activeReferenceController = new AbortController();
    referenceRunId += 1;
    const thisRunId = referenceRunId;
    const results = [];

    referenceResults.setAttribute("aria-busy", "true");
    referenceCheckButton.disabled = true;
    referenceCopyButton.disabled = true;
    referenceActionStatus.textContent = "";
    renderReferenceResults(results, extracted, false);

    try {
      for (const repository of extracted.repositories) {
        const result = await readPublicRepository(
          repository,
          activeReferenceController.signal,
        );

        if (thisRunId !== referenceRunId) {
          return;
        }

        results.push(result);
        renderReferenceResults(
          results,
          extracted,
          results.length === extracted.repositories.length,
        );
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        referenceResults.setAttribute("aria-busy", "false");
        referenceTool.dataset.state = "review";
        referenceVerdict.textContent = "Check interrupted";
        referenceSummary.textContent =
          "The public read ended before a complete result was available.";
      }
    } finally {
      if (thisRunId === referenceRunId) {
        referenceCheckButton.disabled = false;
        activeReferenceController = null;
      }
    }
  }

  async function copyReferenceReport() {
    if (!currentReferenceReport) {
      return;
    }

    try {
      await navigator.clipboard.writeText(currentReferenceReport);
      referenceActionStatus.textContent = "Reference evidence copied.";
    } catch {
      referenceActionStatus.textContent =
        "Clipboard access failed. Keep the checker open and copy the visible results.";
    }
  }

  function clearReferenceCheck() {
    activeReferenceController?.abort();
    activeReferenceController = null;
    referenceRunId += 1;
    referenceInput.value = "";
    setReferenceEmptyState();
    referenceActionStatus.textContent = "Local input cleared.";
    referenceInput.focus();
  }

  function handleReferenceInput() {
    activeReferenceController?.abort();
    activeReferenceController = null;
    referenceRunId += 1;
    renderReferenceInputState();
  }

  canonicalInput.addEventListener("input", render);
  companionInput.addEventListener("input", render);
  copyButton.addEventListener("click", copyReport);
  clearButton.addEventListener("click", clearWorksheet);
  referenceInput.addEventListener("input", handleReferenceInput);
  referenceCheckButton.addEventListener("click", checkPublicReferences);
  referenceCopyButton.addEventListener("click", copyReferenceReport);
  referenceClearButton.addEventListener("click", clearReferenceCheck);
  setEmptyState();
  setReferenceEmptyState();
})();
