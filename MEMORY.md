# MEMORY.md

## User Preferences
- Maintain memory proactively: remember actions taken, setup context, and preferences by default.
- For email operations, use `gog` (do not use Zapier MCP).
- Push and deploy website changes promptly so user can review quickly.
- Send progress updates via WhatsApp during active website iteration work.
- Publish cadence preference: 3 posts per week.
- Contact email preference for website CTA: `hello@beyondzenith.org`.
- Social publishing preference: autopost after setup (rather than draft-only review loops).
- X/Twitter content preference: avoid generic/preachy consultant tone; write sharper operator-style posts with concrete evidence, distinct voice, and less repetitive defensibility messaging.
- X/Twitter tone preference update (2026-03-16): write in a Scott Galloway-inspired voice — blunt, contrarian, crisp, economically grounded, and punchy (without copying phrasing).
- Communication style preference update (2026-03-19): be more chill and less robotic in chat; keep responses direct, concise, practical, and natural while still owning mistakes quickly.
- Naming preference update (2026-03-19): use name **DR.CLAW** in chat self-reference; in chats involving user's brother, user may address DR.CLAW directly and expects consistent name usage.
- Chat formatting preference update (2026-03-19): start replies with `DR.CLAW 🦾` branding style (while platform sender label may still show `[openclaw]`).
- Personality preference update (2026-03-19): keep evolving a unique DR.CLAW voice based on conversation history—chill, sharp, witty, practical—with tasteful emoji flair.
- Website authority assets preference: use user's LinkedIn photo and bio.
- Ops preference: persist critical tool/API configuration state (e.g., keys present/missing, last validation) and proactively remember it to avoid repeated setup/debug loops.
- GA4 ops guardrail (2026-03-19): if GA4 starts throwing permission errors after access was granted, verify runtime `GA4_PROPERTY_ID` source first (stale shell env can override expected value). Prefer OpenClaw config env vars as source of truth for ga4-analytics skill runs.
- Git preference: commit and push all local changes promptly by default (unless explicitly asked not to or action is risky/destructive).

## Strategic Goals
- Position BeyondZenith as a market-leading consultancy in Melbourne.
- Primary traffic/geography focus: Melbourne and broader Australia.
- Brand direction: modern, cutting-edge technology image with clear business-result orientation.

## Whitefox Business Context (captured 2026-03-23)
- Whitefox primary domain: `https://www.whitefox.cloud`.
- User context: Anastas states he runs Whitefox (in addition to BeyondZenith) and wants Whitefox website context remembered.
- Whitefox positioning from full sitemap crawl (64 URLs, 62 reachable): software development + consulting with strong emphasis on:
  - AI software development and AI platform engineering
  - Fractional CTO services (AU-wide + city pages for Melbourne/Sydney/Brisbane)
  - API development/integration services
  - FHIR interoperability/health data integration
  - IT staff augmentation
- Industry focus pages: FinTech, Healthcare, Logistics.
- Proof assets: extensive projects/case studies and article library (heavy coverage in AI + FHIR + healthcare data interoperability topics).
- Supporting property: `https://fhir.whitefox.cloud` (FHIR AU test server).

## Credibility Inputs
- User reports they achieved ~2x year-on-year revenue growth as Technical Director at Whitefox.
- User reports they doubled company size and supported global growth at Whitefox.

## Environment & Access (current)
- Workspace path: `/Users/macmini/.openclaw/workspace`
- Active website/project: BeyondZenith (`www.beyondzenith.org`) with GitHub Pages origin at `BeyondZenithWebsite/Website`.
- Primary booking link: `https://calendar.app.google/mU9KbzGJ7LMYyo6N6`
- Connected Google account in gog: `hello@beyondzenith.org`
- User LinkedIn profile: `https://au.linkedin.com/in/anastasm`
- OpenClaw web client (local): `http://127.0.0.1:18789/` (same as `http://localhost:18789/`).
- Available tool classes in this session include file ops, shell, web fetch/search, browser automation, messaging, memory tools, sessions/subagents, and node/canvas controls (subject to runtime policy/tool availability).

## Recent Execution Snapshot (2026-03-22)
- Completed daily BeyondZenith audit sprint across homepage, one service page, and one insight page.
- Shipped structured-data enhancement on `docs/services/fractional-cto-consulting.html`: added `BreadcrumbList` JSON-LD to strengthen crawl/context signals.
- Pushed to `main` with commit: `222b40f`.
- Stabilized daily GSC cron reliability by narrowing scope and increasing job timeout budget; next run completed successfully.

## Previous Snapshot (2026-03-20)
- Completed daily BeyondZenith audit sprint across homepage, one service page, and one insight page.
- Shipped SEO/GEO enhancement on `docs/insights/geo-for-consulting-firms.html`: added `FAQPage` JSON-LD and synced freshness signals (`article:modified_time`, visible updated date, `BlogPosting.dateModified`).
- Pushed to `main` with commit: `c299bd4`.
- Operating lesson captured: explicitly report non-blocking tool failures with impact + recovery in user updates.

## Earlier Snapshot (2026-03-06)
- Published new insight page: `docs/insights/dedicated-software-development-team-australia.html`.
- Updated discovery paths: added page to `docs/insights/index.html` and `docs/sitemap.xml`.
- Pushed to `main` with commit: `e55fb91`.
- User preference signal reinforced: keep memory/docs hygiene current without waiting for reminders.
