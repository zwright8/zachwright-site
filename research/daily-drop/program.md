# Daily Drop Research Program

This is an `autoresearch`-style program for creating the Daily Drop on `zachwright.xyz`.

The point is not to scrape the entire internet. The point is to run a tight, repeatable research loop that produces a short, high-signal brief the publishing step can trust.

## Setup

Before writing anything:

1. Use the current date in `America/New_York`.
2. Read the automation memory at `/Users/zacharywright/.codex/automations/daily-updates/memory.md`.
3. Read `updates/index.json` and inspect the newest 5-7 Daily Drops so today's theme does not repeat the same angle.
4. Check whether `updates/YYYY-MM-DD.html` already exists. If it does, update in place instead of creating a duplicate.
5. Create a scratch brief at `/tmp/daily-drop-research-YYYY-MM-DD.md`. This file is working state only and should not be committed.

## Research Rules

Use these rules for source selection:

- Prefer primary sources: official product blogs, documentation, GitHub repos, changelogs, company announcements, standards pages, and direct project pages.
- Use secondary reporting only when it adds real signal and the underlying primary source is missing.
- Favor links that help an operator decide what matters now.
- Skip items that are too similar to the recent Drops, even if they are new.
- Avoid listless "AI is changing everything" framing. Pick a concrete operational shift.
- Keep the scope tight enough that the finished Drop feels curated, not aggregated.

## Research Loop

Build the scratch brief in this order:

1. Collect 8-12 candidate items.
2. For each item, log:
   - title
   - url
   - source type
   - why it matters in one sentence
   - likely section: `big-thing`, `code-tools`, `tech-impact`, or `meme`
3. Group the candidates by theme.
4. Reject redundant themes that overlap the latest Drops.
5. Pick one theme for `The Big Thing` that has at least 2 strong supporting links.
6. Pick 3-5 `Code & Tools` items that are concrete and linkable.
7. Pick 2-3 `Tech Impact` bullets that explain second-order consequences, not just repeats of the news.
8. Pick one `Meme of the Day` with:
   - a title
   - a stable image URL
   - a stable post URL

## Selection Standard

The final brief should satisfy all of these:

- The main angle is distinct from the last week of Drops.
- The links are recent enough to feel current.
- The story is operator-focused: workflows, tooling, infra, distribution, security, or shipping behavior.
- The tone is concise and signal-heavy.
- Every section can be written without filler.

If the candidates feel weak, keep researching until the theme is strong. Do not settle for the first usable topic.

## Scratch Brief Template

Use this shape inside `/tmp/daily-drop-research-YYYY-MM-DD.md`:

```md
# Daily Drop Research - YYYY-MM-DD

## Candidate Pool
- [section] Title
  - URL:
  - Source type:
  - Why it matters:

## Rejected Themes
- Theme:
  - Why rejected:

## Selected Angle
- Headline direction:
- Core thesis:
- Supporting links:

## Draft Inputs
### The Big Thing
- Point 1
- Point 2

### Code & Tools
- Item 1
- Item 2
- Item 3

### Tech Impact
- Bullet 1
- Bullet 2

### Meme of the Day
- Title:
- Image URL:
- Post URL:
```

## Publishing Handoff

Once the brief is strong:

1. Write or update `updates/YYYY-MM-DD.html` using the existing Daily Drop shell.
2. Update `updates/index.html` by prepending or updating today's card.
3. Update `updates/index.json` by prepending or updating today's entry.
4. Validate:
   - newest update appears first
   - all `/updates/YYYY-MM-DD.html` links resolve
   - no duplicate date entries in `index.html` or `index.json`

The scratch brief is disposable. The published Daily Drop is the artifact that matters.
