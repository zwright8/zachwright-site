# Synthetic AI Agent Cost & Reliability Snapshot

This complete sample uses seven synthetic, prompt-free attempts across six pseudonymous task IDs. It is product proof, not a customer result, savings claim, revenue claim, or forecast.

- Input format: JSONL
- Normalized input SHA-256: `2ec0de17fbedc36b98862fd41ce57011feab2933142ab3e1d07fbd6a9b023259`
- Evidence: 7 attempts across 6 task IDs

## Reliability

| Metric | Observed value | Evidence |
| --- | ---: | ---: |
| Attempt outcome coverage | 100.00% | 7/7 |
| Attempt success rate | 71.43% | 5/7 |
| Task completion rate | 83.33% | 5/6 |
| First-attempt outcome coverage | 100.00% | 6/6 |
| First-pass success rate | 66.67% | 4/6 |
| Retry-task rate | 16.67% | 1/6 |
| Retry recovery rate | 100.00% | 1/1 |
| Mean attempts per eligible task | 1.166667 | 6 eligible tasks |

## Observed run cost

Primary cost status: **complete**.

| Metric | Observed value |
| --- | ---: |
| Known cost lower bound | $0.55 |
| Total cost | $0.55 |
| Blended cost per completed task | $0.11 |
| Cost per successful attempt | $0.11 |
| Failed-run waste proxy | $0.15 |
| Failed-task cost | $0.07 |
| Retry cost | $0.10 |
| Cancelled cost | $0.00 |
| Failed-run waste share | 27.27% |

“Waste” is an operational proxy; failed attempts can retain diagnostic value.

## Latency cohorts

Nearest-rank percentiles are reported only for records with duration evidence.

| Cohort | Coverage | N | P50 | P90 | P95 | P99 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| All attempts | 100.00% | 7 | 2200 ms | 4000 ms | 4000 ms | 4000 ms |
| Successful attempts | 100.00% | 5 | 1800 ms | 3200 ms | 3200 ms | 3200 ms |
| Eligible task elapsed | 100.00% | 6 | 1800 ms | 5200 ms | 5200 ms | 5200 ms |

P95 and P99 values carry small-sample warnings because this synthetic fixture contains fewer than 20 and 100 observations respectively.

## Outcome evidence

| Outcome | Attempts |
| --- | ---: |
| Succeeded | 5 |
| Failed | 1 |
| Timed out | 1 |

Final task failure category: `tool_error` for one task.

## Usage evidence

| Field | Known total | Coverage |
| --- | ---: | ---: |
| Cached input tokens | 400 | 100.00% |
| Input tokens | 5700 | 100.00% |
| Model calls | 7 | 100.00% |
| Output tokens | 600 | 100.00% |
| Tool calls | 10 | 100.00% |

## Break-even scenario

| Scenario input or result | Value |
| --- | ---: |
| Investment | $495.00 |
| Assumed reduction | 20.00% |
| Baseline cost per run | $0.078571 |
| Modeled savings per run | $0.015714 |
| Assumed runs per period | 1000 |
| Modeled savings per period | $15.714286 |
| Break-even runs | 31500 |
| Break-even periods | 31.500000 |

> Scenario only; not a forecast, guarantee, revenue figure, or profit.

## Prioritized observation

1. Review the leading final failure category `tool_error` before scaling the workflow.

## Fixed limitations

- This is an observational summary of supplied normalized records, not causal attribution.
- `outcome_basis` is a supplied classification; even `external_verifier` labels are independently proven only after human review of source evidence outside the aggregate input.
- The report does not ingest prompts, responses, tool arguments, or results and is not a security, privacy, compliance, legal, accounting, or billing-reconciliation audit.
- Missing evidence is never treated as zero; unavailable primary metrics remain explicitly unavailable.
- Break-even values are user-supplied scenarios, not forecasts, savings guarantees, revenue, or profit.
