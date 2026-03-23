# INTERNAL_MD_AUDIT.md

## Scope
Audit and refactor of internal markdown guidance that shapes OpenClaw behavior in this workspace.

Date: 2026-03-07

---

## 1) Inventory of `.md` files found

### A) Core control/instruction docs (high influence)
1. `/Users/macmini/.openclaw/workspace/AGENTS.md`
2. `/Users/macmini/.openclaw/workspace/SOUL.md`
3. `/Users/macmini/.openclaw/workspace/USER.md`
4. `/Users/macmini/.openclaw/workspace/TOOLS.md`
5. `/Users/macmini/.openclaw/workspace/IDENTITY.md`
6. `/Users/macmini/.openclaw/workspace/HEARTBEAT.md`
7. `/Users/macmini/.openclaw/workspace/ops_runbook.md`
8. `/Users/macmini/.openclaw/workspace/MEMORY.md`
9. `/Users/macmini/.openclaw/workspace/BOOTSTRAP.done.md`
10. `/Users/macmini/.openclaw/workspace/README.md`
11. `/Users/macmini/.openclaw/workspace/INTERNAL_MD_INDEX.md` (new)

### B) Memory/log context docs
- `/Users/macmini/.openclaw/workspace/memory/2026-02-27.md`
- `/Users/macmini/.openclaw/workspace/memory/2026-03-02.md`
- `/Users/macmini/.openclaw/workspace/memory/2026-03-03.md`
- `/Users/macmini/.openclaw/workspace/memory/2026-03-04.md`
- `/Users/macmini/.openclaw/workspace/memory/2026-03-06.md`
- `/Users/macmini/.openclaw/workspace/memory/2026-03-07.md`
- `/Users/macmini/.openclaw/workspace/x_memory.md`
- `/Users/macmini/.openclaw/workspace/x_replies_memory.md`

### C) Planning/workflow/content docs
- `/Users/macmini/.openclaw/workspace/growth_scorecard.md`
- `/Users/macmini/.openclaw/workspace/docs/growth/90-day-growth-engine.md`
- `/Users/macmini/.openclaw/workspace/docs/growth/linkedin-4week-pack.md`
- `/Users/macmini/.openclaw/workspace/docs/growth/pillar-article-drafts.md`
- `/Users/macmini/.openclaw/workspace/docs/content-research/insights-sources-2026-03.md`

### D) Specialist role/skill docs
- `/Users/macmini/.openclaw/workspace/skills/automation-workflows/SKILL.md`
- `/Users/macmini/.openclaw/workspace/skills/content-marketing/SKILL.md`
- `/Users/macmini/.openclaw/workspace/skills/content-marketing/funnels.md`
- `/Users/macmini/.openclaw/workspace/skills/content-marketing/memory-template.md`
- `/Users/macmini/.openclaw/workspace/skills/content-marketing/repurposing.md`
- `/Users/macmini/.openclaw/workspace/skills/content-marketing/setup.md`
- `/Users/macmini/.openclaw/workspace/skills/ga4-analytics/SKILL.md`
- `/Users/macmini/.openclaw/workspace/skills/ga4-analytics/references/api-reference.md`
- `/Users/macmini/.openclaw/workspace/skills/github-issue-resolver/SKILL.md`
- `/Users/macmini/.openclaw/workspace/skills/github-issue-resolver/references/guardrails-guide.md`
- `/Users/macmini/.openclaw/workspace/skills/github-issue-resolver/references/quick-reference.md`
- `/Users/macmini/.openclaw/workspace/skills/github-ops/SKILL.md`
- `/Users/macmini/.openclaw/workspace/skills/google-search/SKILL.md`
- `/Users/macmini/.openclaw/workspace/skills/gsc/SKILL.md`
- `/Users/macmini/.openclaw/workspace/skills/pls-seo-audit/SKILL.md`

**Total markdown files reviewed (excluding dependency/vendor markdown): 39**

---

## 2) Top 10 files by influence on behavior (ranked)
1. `AGENTS.md`
2. `SOUL.md`
3. `USER.md`
4. `ops_runbook.md`
5. `HEARTBEAT.md`
6. `MEMORY.md`
7. `TOOLS.md`
8. `IDENTITY.md`
9. `INTERNAL_MD_INDEX.md` (new)
10. `BOOTSTRAP.done.md`

---

## 3) Pre-edit structural issues found
1. **Instruction duplication** across `AGENTS.md`, `SOUL.md`, and `USER.md` (tone, safety, memory cadence repeated in different words).
2. **Unclear precedence** between persona guidance vs operating rules vs user preferences.
3. **Overly philosophical sections** in core docs without direct behavioral implications.
4. **Heartbeat guidance spread across docs**, causing ambiguity about where to define actual heartbeat tasks.
5. **Bootstrap artifact confusion** (`BOOTSTRAP.done.md` still looked like a live bootstrap script).
6. **No single index** of internal markdown roles, increasing drift risk.

---

## 4) Changes made

### Updated in place
- `SOUL.md`
  - Reduced abstraction; converted values into explicit behavior rules.
  - Added precedence and interaction notes.
  - Kept distinctive identity/tone while removing duplicate policy text.

- `AGENTS.md`
  - Rewritten as clear operating protocol (startup, execution, memory, communication, heartbeat, hygiene, boundaries).
  - Added explicit precedence ladder.
  - Removed redundant prose and overlapping style guidance.

- `USER.md`
  - Converted into direct decision constraints and overrides.
  - Added clear precedence and interaction mapping.

- `TOOLS.md`
  - Tightened scope to local runtime specifics only.
  - Added explicit “what does not belong here”.

- `IDENTITY.md`
  - Reduced to compact stable identity card with boundaries.

- `HEARTBEAT.md`
  - Reframed as deterministic task-list controller.
  - Clarified empty-state behavior and cron split.

- `ops_runbook.md`
  - Structured into explicit retry/deferral/recovery/rollback policies.
  - Added scope and precedence note.

- `BOOTSTRAP.done.md`
  - Converted to archive marker to prevent accidental bootstrap re-entry.

### New file created
- `INTERNAL_MD_INDEX.md`
  - Defines full internal precedence and responsibilities map.

---

## 5) Contradictions resolved
1. **Who governs behavior first?**
   - Resolved via shared precedence ladder (`AGENTS.md` + `SOUL.md` + `INTERNAL_MD_INDEX.md`).

2. **Style vs operations overlap**
   - `SOUL.md` now owns character/tone/decision posture.
   - `AGENTS.md` now owns operational protocol.

3. **User preferences vs generic defaults**
   - `USER.md` explicitly states override behavior for user-specific preferences.

4. **Heartbeat ambiguity**
   - `HEARTBEAT.md` now explicitly controls heartbeat task execution.
   - `AGENTS.md` only references policy.

5. **Bootstrap state ambiguity**
   - `BOOTSTRAP.done.md` now clearly marked archival/non-operational.

---

## 6) Files merged / deprecated
- No hard merges performed (to avoid breaking references).
- Functional deprecation done by content change:
  - `BOOTSTRAP.done.md` no longer a live bootstrap instruction.

---

## 7) Consistency second-pass review
Completed against modified docs:
- Verified presence of `Purpose` and applicability sections in all major control docs.
- Verified precedence references are aligned.
- Verified role separation: identity vs operations vs user overrides vs runbook vs local runtime notes.

---

## 8) Unresolved questions
1. Should selected high-value skill docs be normalized to the same “Purpose/Applies/Core rules” format for consistency?
2. Should `MEMORY.md` gain a stricter template (facts/preferences/active constraints/deprecated entries) to reduce drift?
3. Should `README.md` remain website-only or link to `INTERNAL_MD_INDEX.md` for operator onboarding?

---

## 9) Recommended next improvements (priority)
1. Add lightweight schema/template for `MEMORY.md` updates (fact + source/date + confidence).
2. Add a small `docs/INSTRUCTION_CHANGELOG.md` to track behavior-doc edits and rationale.
3. Normalize remaining skill docs to the same instruction format.

---

## 10) Phase 2 follow-up completed (skill normalization)
Normalized 5 high-usage skill files to the same operational structure (Purpose / Applies when / Core rules / Workflow / Boundaries / Interaction):

1. `skills/ga4-analytics/SKILL.md`
2. `skills/pls-seo-audit/SKILL.md`
3. `skills/github-issue-resolver/SKILL.md`
4. `skills/content-marketing/SKILL.md`
5. `skills/automation-workflows/SKILL.md`

### Improvements made in phase 2
- Removed bloated explanatory text and converted to executable rules.
- Aligned frontmatter naming/description quality for clearer triggering.
- Added explicit boundaries to reduce unsafe or low-value autonomous behavior.
- Added interaction notes to reduce overlap with other skills/docs.
- Standardized output expectations for faster, consistent execution.
