# AI Operator Kit — Automation Checklist (v2)

Automation should reduce manual load **without** creating hidden risk.
Use this checklist before, during, and after implementation.

---

## 1) Automation readiness check

Before automating a workflow, confirm:

- [ ] The workflow is already stable and documented (SOP exists).
- [ ] Inputs are standardized (required fields are known).
- [ ] A clear owner is responsible for this automation.
- [ ] Failure handling is defined.
- [ ] A rollback path exists.
- [ ] Success criteria are defined in plain terms.

If two or more boxes are unchecked, fix the workflow first.

---

## 2) Prioritization matrix

Use this table to select what to automate first.

| Workflow | Manual Time Burden | Error Frequency | Business Impact | Complexity | Priority |
|---|---|---|---|---|---|
|  | Low/Med/High | Low/Med/High | Low/Med/High | Low/Med/High |  |
|  | Low/Med/High | Low/Med/High | Low/Med/High | Low/Med/High |  |

Priority rule of thumb:
- Start with **High impact + Low/Medium complexity**.
- Avoid high-complexity automations until the first wins are stable.

---

## 3) Implementation checklist (per automation)

### Design
- [ ] Trigger is explicit (what event starts this?)
- [ ] Required inputs are validated
- [ ] Actions are deterministic (same input => same output)
- [ ] Human approval checkpoint included (if needed)

### Safety
- [ ] Error branch exists (on failure, do what?)
- [ ] Fallback owner is assigned
- [ ] Alert/notification is configured
- [ ] Sensitive actions require confirmation

### Observability
- [ ] Execution logs are retained
- [ ] Status is visible to owner
- [ ] Failures can be traced quickly
- [ ] Version/change notes are documented

---

## 4) Test plan checklist

Run these tests before turning automation on for live operations:

- [ ] Happy-path test (standard input)
- [ ] Missing-data test
- [ ] Invalid-data test
- [ ] Duplicate-trigger test
- [ ] Timeout/API failure simulation
- [ ] Rollback test

Record outcomes:

| Test Case | Result (Pass/Fail) | Notes | Fix Owner | Retest Date |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |

---

## 5) Launch checklist

- [ ] Owner confirms tests complete
- [ ] Stakeholders informed of behavior changes
- [ ] Monitoring window scheduled (first 7 days)
- [ ] Manual backup process remains available
- [ ] Rollback command/process documented and verified

---

## 6) Post-launch monitoring (first 30 days)

Review weekly:

- [ ] Run success/failure counts
- [ ] Top failure reasons
- [ ] Manual interventions required
- [ ] Unexpected side effects
- [ ] Improvement actions for next iteration

Post-launch review template:

| Week | Successes | Failures | Manual Interventions | Key Issues | Next Fix |
|---|---:|---:|---:|---|---|
| 1 |  |  |  |  |  |
| 2 |  |  |  |  |  |
| 3 |  |  |  |  |  |
| 4 |  |  |  |  |  |

---

## 7) Automation boundaries (do not skip)

- Do not automate legal, contractual, or policy exceptions without human approval.
- Do not remove manual QA for critical client deliverables until reliability is proven.
- Do not deploy major changes without a tested rollback.

---

## v2 improvements

- Added readiness gating, implementation safeguards, and post-launch monitoring.
- Converted generic checklist into a full operating control template.
- Removed unverified thresholds and benchmark-style claims.
