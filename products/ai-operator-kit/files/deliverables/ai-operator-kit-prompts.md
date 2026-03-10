# AI Operator Kit — Prompt Pack (v2)

This pack is for operators who need reliable outputs, clear decisions, and execution-ready drafts.

## How to use this pack

1. Choose one prompt tied to your immediate objective.
2. Replace all `[placeholders]` with real context.
3. Keep the requested output format (so review is fast and consistent).
4. Run a human review before anything client-facing.

Optional system message for your AI tool:

```text
You are an operations copilot for a small business team.
Prioritize clarity, execution detail, and realistic constraints.
Do not invent data. If context is missing, ask for it.
Output in clean sections and checklists.
```

---

## A) Sales and pipeline prompts

### 1) Lead fit scoring
```text
Evaluate this lead against our ICP and offer.

Offer: [offer]
ICP criteria: [must-have criteria]
Lead notes: [paste notes]

Output:
1) Fit score (High / Medium / Low)
2) Top reasons (max 3 bullets)
3) Risks/red flags
4) Recommended next action
5) Follow-up draft (under 120 words)
```

### 2) Discovery call prep
```text
Build a discovery prep brief.

Business context: [what we know]
Offer: [offer]
Call objective: [objective]

Output:
- Hypothesized pain points
- 8 discovery questions in priority order
- 3 disqualifying signals
- Suggested next-step CTA if fit is strong
```

### 3) Proposal from call notes
```text
Turn these call notes into a proposal-ready scope.

Call notes: [paste]

Output:
- Objective
- In-scope deliverables
- Out-of-scope boundaries
- Dependencies (client + team)
- Risks and assumptions
```

### 4) Pipeline cleanup
```text
Classify these opportunities into Commit, Nurture, or Close-lost.

Pipeline list: [paste]

Output table:
Opportunity | Category | Reason | Next Action | Owner | Due Date
```

---

## B) Operations and delivery prompts

### 5) SOP generator
```text
Convert this process into an SOP.

Process notes: [paste]

Output sections:
- SOP name
- Purpose
- Trigger
- Inputs
- Owner
- Procedure (numbered)
- QA checks
- Escalation rule
```

### 6) Client onboarding plan
```text
Create a client onboarding plan for this project.

Project details: [paste]
Team roles: [roles]

Output:
- Kickoff agenda
- Required client inputs and due dates
- Internal setup checklist
- Communication cadence
- Risks in first 14 days
```

### 7) QA checklist builder
```text
Create a QA checklist for this deliverable type.

Deliverable type: [type]
Quality expectations: [expectations]

Output:
- Content checks
- Accuracy checks
- Formatting/usability checks
- Final approval checks
- Pass/fail criteria
```

### 8) Weekly client update draft
```text
Draft a weekly client update.

Completed: [items]
In progress: [items]
Blocked: [items]
Needs from client: [items]

Output:
- Progress summary
- Changes since last update
- Risks/blockers
- Requests from client
- Next week plan
Tone: concise and accountable.
```

---

## C) Marketing and messaging prompts

### 9) Offer clarity rewrite
```text
Rewrite this offer so a buyer understands the outcome, scope, and next step in under 20 seconds.

Current copy: [paste]
Audience: [audience]

Output:
- One-line value proposition
- Problem statement
- Outcome statement
- Scope sentence
- CTA

Rules: no hype, no unsupported claims.
```

### 10) Content plan (2 weeks)
```text
Create a 2-week content plan tied to this offer.

Offer: [offer]
Audience: [audience]
Channels: [channels]

Output table:
Date | Theme | Hook | Format | CTA | Asset Needed | Owner
```

### 11) Repurposing engine
```text
Repurpose this source content for multiple channels.

Source content: [paste]
Channels: [list channels]

Output:
- 1 long-form draft
- 3 short posts
- 1 email draft
- 5 hooks
Keep factual consistency across all outputs.
```

---

## D) Leadership and decision prompts

### 12) Weekly operating review
```text
Run a weekly business review from this data.

Data: [KPIs + notes]
Current goals: [goals]

Output:
- Signals that moved this week
- Bottlenecks
- Decisions required
- Top 3 priorities next week
- Owners + deadlines
```

### 13) Decision memo
```text
Create a decision memo.

Decision to make: [decision]
Options: [options]
Constraints: [constraints]

Output:
- Context
- Option analysis (pros/cons)
- Risk and mitigation
- Recommendation
- Next 3 actions
```

### 14) Priority ranking
```text
Rank these tasks by impact and effort.

Task list: [paste]
Business objective: [objective]

Output table:
Task | Impact (H/M/L) | Effort (H/M/L) | Rank | Why | First Step
```

---

## E) Automation prompts

### 15) Automation opportunity map
```text
Identify automation opportunities in this workflow.

Workflow steps: [paste]
Current tools: [tools]

Output table:
Step | Manual Time | Error Risk | Automation Candidate | Complexity | Benefit | Rollback Plan
```

### 16) SOP-to-automation spec
```text
Convert this SOP into an automation specification.

SOP: [paste]

Output:
- Trigger
- Inputs
- Logic
- Outputs
- Error handling
- Human approval checkpoints
- Audit log fields
```

### 17) Automation pre-launch test plan
```text
Create a pre-launch QA plan for this automation.

Automation summary: [paste]

Output:
- Happy-path tests
- Edge-case tests
- Failure simulation tests
- Rollback test
- Launch criteria
- First-week monitoring checklist
```

---

## Prompt quality check (before sending)

- [ ] Goal is specific
- [ ] Context is complete
- [ ] Output format is defined
- [ ] Constraints are stated
- [ ] No invented data requested

---

## v2 improvements

- Replaced generic prompts with structured, operator-grade templates.
- Added consistent output formats for faster team review.
- Removed any implied performance claims and “magic metrics.”
