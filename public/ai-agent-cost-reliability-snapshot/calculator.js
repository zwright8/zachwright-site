(() => {
  const form = document.querySelector("#cost-estimator");
  if (!form) return;

  const fields = {
    weeklyStarts: form.querySelector("#weekly-starts"),
    attemptCost: form.querySelector("#attempt-cost"),
    averageAttempts: form.querySelector("#average-attempts"),
    failureRate: form.querySelector("#failure-rate"),
  };
  const outputs = {
    monthlySpend: form.querySelector("#monthly-spend"),
    retryOverhead: form.querySelector("#retry-overhead"),
    failedTaskSpend: form.querySelector("#failed-task-spend"),
    feeEquivalent: form.querySelector("#fee-equivalent"),
    note: form.querySelector("#calculator-note"),
  };

  const read = (field, minimum, maximum) => {
    const value = Number.parseFloat(field.value);
    return Number.isFinite(value) && value >= minimum && value <= maximum
      ? value
      : null;
  };
  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  function update() {
    const weeklyStarts = read(fields.weeklyStarts, 0, 10_000_000);
    const attemptCost = read(fields.attemptCost, 0, 1_000_000);
    const averageAttempts = read(fields.averageAttempts, 1, 100);
    const failurePercent = read(fields.failureRate, 0, 100);

    if (
      weeklyStarts === null ||
      attemptCost === null ||
      averageAttempts === null ||
      failurePercent === null
    ) {
      outputs.monthlySpend.textContent = "—";
      outputs.retryOverhead.textContent = "—";
      outputs.failedTaskSpend.textContent = "—";
      outputs.feeEquivalent.textContent = "Complete inputs";
      outputs.note.textContent =
        "Enter four values within the displayed limits to calculate a directional estimate.";
      return;
    }

    const failureRate = failurePercent / 100;
    const monthlyStarts = weeklyStarts * 4.33;
    const monthlySpend = monthlyStarts * averageAttempts * attemptCost;
    const retryOverhead =
      monthlyStarts * Math.max(averageAttempts - 1, 0) * attemptCost;
    const failedTaskSpend =
      monthlyStarts * failureRate * averageAttempts * attemptCost;
    const largerSignal = Math.max(retryOverhead, failedTaskSpend);

    outputs.monthlySpend.textContent = money.format(monthlySpend);
    outputs.retryOverhead.textContent = money.format(retryOverhead);
    outputs.failedTaskSpend.textContent = money.format(failedTaskSpend);

    if (largerSignal === 0) {
      outputs.feeEquivalent.textContent = "No cost signal";
      outputs.note.textContent =
        "These inputs show no retry or failed-task cost signal. A paid snapshot is unlikely to fit this decision.";
      return;
    }

    const months = 495 / largerSignal;
    outputs.feeEquivalent.textContent =
      months < 0.1 ? "< 0.1 months" : `${months.toFixed(1)} months`;
    outputs.note.textContent =
      "Directional estimate only. Retry and failed-task figures may overlap and are not combined.";
  }

  form.addEventListener("input", update);
  update();

  const reconciliationForm = document.querySelector("#cost-reconciliation");
  if (!reconciliationForm) return;

  const reconciliationFields = {
    pathA: reconciliationForm.querySelector("#cost-path-a"),
    pathB: reconciliationForm.querySelector("#cost-path-b"),
    runs: reconciliationForm.querySelector("#reconciliation-runs"),
    threshold: reconciliationForm.querySelector("#reconciliation-threshold"),
  };
  const reconciliationOutputs = {
    gap: reconciliationForm.querySelector("#reconciliation-gap"),
    multiple: reconciliationForm.querySelector("#reconciliation-multiple"),
    monthly: reconciliationForm.querySelector("#reconciliation-monthly"),
    status: reconciliationForm.querySelector("#reconciliation-status"),
    note: reconciliationForm.querySelector("#reconciliation-note"),
  };

  function updateReconciliation() {
    const pathA = read(reconciliationFields.pathA, 0, 1_000_000);
    const pathB = read(reconciliationFields.pathB, 0, 1_000_000);
    const runs = read(reconciliationFields.runs, 0, 10_000_000);
    const threshold = read(
      reconciliationFields.threshold,
      0,
      1_000_000_000,
    );

    if (
      pathA === null ||
      pathB === null ||
      runs === null ||
      threshold === null
    ) {
      reconciliationOutputs.gap.textContent = "—";
      reconciliationOutputs.multiple.textContent = "—";
      reconciliationOutputs.monthly.textContent = "—";
      reconciliationOutputs.status.textContent = "Complete inputs";
      reconciliationOutputs.note.textContent =
        "Enter four non-negative values within the displayed limits to compare the two cost paths.";
      return;
    }

    const gap = Math.abs(pathA - pathB);
    const smaller = Math.min(pathA, pathB);
    const larger = Math.max(pathA, pathB);
    const monthlyGap = gap * runs;
    const thresholdDelta = monthlyGap - threshold;

    reconciliationOutputs.gap.textContent = money.format(gap);
    reconciliationOutputs.monthly.textContent = money.format(monthlyGap);
    reconciliationOutputs.multiple.textContent =
      smaller === 0
        ? larger === 0
          ? "No ratio"
          : "∞"
        : `${(larger / smaller).toFixed(2)}×`;

    if (Math.abs(thresholdDelta) < 0.005) {
      reconciliationOutputs.status.textContent = "At threshold";
    } else if (thresholdDelta > 0) {
      reconciliationOutputs.status.textContent =
        `Above by ${money.format(thresholdDelta)}`;
    } else {
      reconciliationOutputs.status.textContent =
        `Below by ${money.format(Math.abs(thresholdDelta))}`;
    }

    if (gap === 0) {
      reconciliationOutputs.note.textContent =
        "The two paths agree for these inputs. Agreement does not independently verify either path against provider billing.";
      return;
    }

    const higherPath = pathA > pathB ? "Path A" : "Path B";
    reconciliationOutputs.note.textContent =
      `${higherPath} is ${money.format(gap)} higher per comparable run. ` +
      "The mismatch is a control signal; it does not prove which path matches an invoice or prove savings.";
  }

  reconciliationForm.addEventListener("input", updateReconciliation);
  updateReconciliation();
})();
