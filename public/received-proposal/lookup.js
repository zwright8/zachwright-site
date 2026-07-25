(() => {
  "use strict";

  const proposals = [
    {
      issue: "https://github.com/Liatrio-Labs/claude-code-gauntlet/issues/37",
      label: "Liatrio Labs / claude-code-gauntlet #37",
      offer: "Agent-Ready Repository Audit",
      price: "$750 USD",
      offerUrl: "/agent-ready-repository-audit/",
      scopeUrl: "/agent-ready-repository-audit/#scope-builder",
    },
    {
      issue: "https://github.com/RESOStandards/reso-tools/issues/240",
      label: "RESOStandards / reso-tools #240",
      offer: "Agent-Ready Repository Audit",
      price: "$750 USD",
      offerUrl: "/agent-ready-repository-audit/",
      scopeUrl: "/agent-ready-repository-audit/#scope-builder",
    },
    {
      issue: "https://github.com/AIClarityAU/minspec/issues/889",
      label: "AIClarityAU / minspec #889",
      offer: "Agent-Ready Repository Audit",
      price: "$750 USD",
      offerUrl: "/agent-ready-repository-audit/",
      scopeUrl: "/agent-ready-repository-audit/#scope-builder",
    },
    {
      issue: "https://github.com/Extra-Chill/homeboy/issues/9653",
      label: "Extra-Chill / homeboy #9653",
      offer: "AI Agent Cost & Reliability Snapshot",
      price: "$495 USD",
      offerUrl: "/ai-agent-cost-reliability-snapshot/",
      scopeUrl:
        "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=cost-reliability-snapshot-request.yml",
    },
    {
      issue: "https://github.com/momentiq-ai/cerebe/issues/58",
      label: "Momentiq AI / cerebe #58",
      offer: "AI Agent Cost & Reliability Snapshot",
      price: "$495 USD",
      offerUrl: "/ai-agent-cost-reliability-snapshot/",
      scopeUrl:
        "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=cost-reliability-snapshot-request.yml",
    },
    {
      issue: "https://github.com/BasedHardware/omi/issues/10338",
      label: "BasedHardware / omi #10338",
      offer: "AI Agent Cost & Reliability Snapshot",
      price: "$495 USD",
      offerUrl: "/ai-agent-cost-reliability-snapshot/",
      scopeUrl:
        "https://github.com/wrightops-ai/agent-ready-repo-auditor/issues/new?template=cost-reliability-snapshot-request.yml",
    },
    {
      issue: "https://github.com/DYB-Development/event_engine/issues/235",
      label: "DYB-Development / event_engine #235",
      offer: "Single-File Agent Instructions Correction",
      price: "$149 USD",
      offerUrl: "/single-file-agent-instructions-correction/",
      scopeUrl: "/single-file-agent-instructions-correction/#scope-builder",
    },
  ];

  const issueInput = document.querySelector("#proposal-issue-url");
  const verifyButton = document.querySelector("#verify-proposal");
  const clearButton = document.querySelector("#clear-proposal");
  const status = document.querySelector("#proposal-status");
  const result = document.querySelector("#proposal-result");
  const resultTitle = document.querySelector("#proposal-result-title");
  const issueLink = document.querySelector("#proposal-issue-link");
  const offer = document.querySelector("#proposal-offer");
  const price = document.querySelector("#proposal-price");
  const scopeLink = document.querySelector("#proposal-scope-link");
  const offerLink = document.querySelector("#proposal-offer-link");
  const acceptanceBrief = document.querySelector("#proposal-acceptance-brief");
  const acceptanceState = document.querySelector("#acceptance-state");
  const copyAcceptance = document.querySelector("#copy-acceptance");
  const copyStatus = document.querySelector("#copy-acceptance-status");
  const heroRegisterStatus = document.querySelector("#hero-register-status");

  const normalizeIssueUrl = (rawValue) => {
    try {
      const url = new URL(rawValue.trim());
      if (url.hostname.toLowerCase() !== "github.com") return "";
      const match = url.pathname.match(
        /^\/([^/]+)\/([^/]+)\/issues\/(\d+)\/?$/i,
      );
      if (!match) return "";
      return `https://github.com/${match[1].toLowerCase()}/${match[2].toLowerCase()}/issues/${match[3]}`;
    } catch {
      return "";
    }
  };

  const normalizeKnownIssue = (issue) => issue.toLowerCase();

  const buildAcceptanceBrief = (proposal) =>
    [
      "WrightOps proposal — request for written scope confirmation",
      "",
      `Public issue: ${proposal.issue}`,
      `Fixed offer: ${proposal.offer}`,
      `Published price: ${proposal.price}`,
      "",
      "Canonical public repository URL:",
      "Immutable revision:",
      "Decision or workflow to prioritize:",
      "Acceptance checks:",
      "Handoff preference:",
      "",
      "I confirm that I am authorized to request this ordinary public-software work and will provide public-only inputs.",
      "",
      "I understand this is a non-binding request for written scope confirmation. It is not authorization to start work and creates no payment obligation.",
      "",
      "Please confirm the exact scope, exclusions, delivery timing, and correct private PayPal Business Goods & Services checkout through the existing business reply channel.",
      "",
      "Do not include credentials, payment details, private files, personal data, customer data, production access, security work, regulated work, or professional-advice requests.",
    ].join("\n");

  const resetResult = () => {
    result.hidden = true;
    result.removeAttribute("data-state");
    resultTitle.textContent = "";
    issueLink.removeAttribute("href");
    issueLink.textContent = "";
    offer.textContent = "";
    price.textContent = "";
    scopeLink.removeAttribute("href");
    offerLink.removeAttribute("href");
    acceptanceBrief.value = "";
    acceptanceState.textContent = "locked_until_verified";
    copyAcceptance.disabled = true;
    copyStatus.textContent = "";
    heroRegisterStatus.textContent = "ready_for_lookup";
  };

  const showUnlisted = (message) => {
    resetResult();
    result.hidden = false;
    result.dataset.state = "unlisted";
    resultTitle.textContent = "Not in the current public register";
    status.textContent = message;
    heroRegisterStatus.textContent = "not_listed";
  };

  const verify = () => {
    const normalizedInput = normalizeIssueUrl(issueInput.value);
    if (!normalizedInput) {
      showUnlisted(
        "Enter a canonical public GitHub issue URL in the form https://github.com/owner/repository/issues/123. No lookup data was submitted.",
      );
      return;
    }

    const proposal = proposals.find(
      (item) => normalizeKnownIssue(item.issue) === normalizedInput,
    );
    if (!proposal) {
      showUnlisted(
        "That public issue is not in the current WrightOps proposal register. Do not pay, send private information, or infer a WrightOps offer from this result.",
      );
      return;
    }

    resetResult();
    result.hidden = false;
    result.dataset.state = "verified";
    resultTitle.textContent = proposal.label;
    issueLink.href = proposal.issue;
    issueLink.textContent = proposal.issue;
    offer.textContent = proposal.offer;
    price.textContent = proposal.price;
    scopeLink.href = proposal.scopeUrl;
    offerLink.href = proposal.offerUrl;
    acceptanceBrief.value = buildAcceptanceBrief(proposal);
    acceptanceState.textContent = "ready_to_copy";
    copyAcceptance.disabled = false;
    status.textContent =
      "Current proposal reference verified. This confirms only the public reference, fixed offer, and price—not acceptance, authorization, payment, or customer status.";
    heroRegisterStatus.textContent = "reference_verified";
  };

  const copyBrief = async () => {
    if (!acceptanceBrief.value || copyAcceptance.disabled) return;
    try {
      await navigator.clipboard.writeText(acceptanceBrief.value);
    } catch {
      acceptanceBrief.focus();
      acceptanceBrief.select();
      document.execCommand("copy");
      acceptanceBrief.setSelectionRange(0, 0);
    }
    copyStatus.textContent = "Acceptance brief copied.";
  };

  verifyButton.addEventListener("click", verify);
  clearButton.addEventListener("click", () => {
    issueInput.value = "";
    resetResult();
    status.textContent =
      "Lookup cleared. Nothing was submitted, stored, tracked, or authenticated.";
    issueInput.focus();
  });
  issueInput.addEventListener("input", () => {
    resetResult();
    status.textContent =
      "Input changed. Verify again to compare the exact public issue.";
  });
  issueInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      verify();
    }
  });
  copyAcceptance.addEventListener("click", copyBrief);

  resetResult();
})();
