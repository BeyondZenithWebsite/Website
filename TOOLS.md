# TOOLS.md — Local Runtime Notes

## Purpose
Store machine- and setup-specific operational notes that improve execution speed and reliability.

## Applies when
Using local tools, browser control, messaging, automation, or host-specific workflows.

## What belongs here
- Device names / aliases
- Local URLs / ports
- Runtime quirks and known-good commands
- Preferred defaults (voice, channel, host)

## What does NOT belong here
- General policy (belongs in `AGENTS.md` / `SOUL.md`)
- User strategy/history (belongs in `MEMORY.md`)

## Local runtime notes
### OpenClaw
- Local web client: `http://127.0.0.1:18789/` (`http://localhost:18789/`)

### Gateway troubleshooting
- If browser automation returns repeated control-service errors, try gateway restart path first.
- CLI service may be absent even when runtime API is available; verify both paths before concluding outage.

### Shell/runtime quirks
- `rg` (ripgrep) may be unavailable on this host; use `grep`, `find`, and `awk/sed` fallbacks by default.
- Exact-text edit operations can fail on minified/single-line HTML; use a resilient flow: locate unique anchor first, then patch.

## Maintenance rule
Update this file whenever a troubleshooting step or local mapping saves >1 future debugging cycle.

## Interaction with other docs
- `AGENTS.md`: defines when to apply these notes
- `ops_runbook.md`: automation retry/deferral policy
