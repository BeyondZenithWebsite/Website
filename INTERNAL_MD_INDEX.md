# INTERNAL_MD_INDEX.md — Internal Instruction Map

## Purpose
Single map of the markdown files that shape agent behavior in this workspace.

## Applies when
Updating behavior docs, debugging contradictory instructions, or onboarding new workflows.

## Precedence ladder
1. Runtime/system/developer policy (outside workspace files)
2. `AGENTS.md` (operating protocol)
3. `SOUL.md` (character + tone + decision posture)
4. `USER.md` (user-specific overrides)
5. `ops_runbook.md` (automation reliability)
6. `TOOLS.md` (local runtime specifics)
7. `HEARTBEAT.md` (heartbeat task list)
8. `MEMORY.md` + `memory/*.md` (context/state)

## Core files by function
### Identity & style
- `SOUL.md`
- `IDENTITY.md`

### Operating behavior
- `AGENTS.md`
- `USER.md`
- `ops_runbook.md`
- `HEARTBEAT.md`

### Context memory
- `MEMORY.md`
- `memory/YYYY-MM-DD.md`

### Runtime specifics
- `TOOLS.md`

## Maintenance rules
- Keep each file scoped to one job; avoid cross-file duplication.
- If two files say similar things, keep the stronger rule in one file and cross-link from the other.
- Add “Purpose / Applies when / Interaction with other docs” in control docs.
- Last hygiene pass: 2026-03-20.
