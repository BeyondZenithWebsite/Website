# BeyondZenith v2 Teardown (2026-03-20)

## Objective
Move BeyondZenith from "competent template" to premium operator brand standard comparable with Instrument / Work & Co / ustwo style execution.

## Benchmark set
- https://www.instrument.com/
- https://www.work.co/
- https://ustwo.com/
- https://www.frog.co/
- https://www.pentagram.com/

## Gap matrix (Current vs Market)

### 1) Positioning clarity above the fold
- **Current:** Generic consulting framing; benefit statement present but not sharply differentiated for one ICP.
- **Benchmark:** Single high-conviction promise + specific audience + immediate social proof.
- **Fix:** Rewrite hero to outcome-first value prop for one primary ICP; add trust strip directly below CTA.

### 2) Visual hierarchy / typography
- **Current:** Flat heading rhythm; not enough contrast between hero, sections, and body.
- **Benchmark:** Strong typographic contrast and whitespace creates premium feel.
- **Fix:** Introduce type scale tokens (display/h1/h2/body/small) and stricter spacing system.

### 3) Proof architecture
- **Current:** Credibility is present but too buried and low-impact.
- **Benchmark:** Outcomes and credibility appear early and repeatedly.
- **Fix:** Add "Proof" section above services with quantified outcomes and operator credentials.

### 4) Service-page conversion structure
- **Current:** Informative but not conversion-optimized.
- **Benchmark:** Pain -> Method -> Deliverables -> Timeline -> CTA with low friction.
- **Fix:** Rebuild service template around decision-ready blocks and tighter CTA flow.

### 5) Component quality
- **Current:** Default-feeling cards/buttons and inconsistent spacing rhythm.
- **Benchmark:** High-fidelity component system with clear states and polish.
- **Fix:** Ship a small design system v2 (buttons, cards, section wrappers, stat blocks, testimonial cards).

### 6) Narrative confidence
- **Current:** Safe copy tone, less point-of-view.
- **Benchmark:** Distinct voice, clear operating philosophy, sharper claims supported by proof.
- **Fix:** Tighten copy into short, punchy sections with operator language and stronger contrasts.

---

## Priority implementation plan (fast, no rollercoaster)

## P0 (Day 1) — Foundation + homepage hero/proof upgrade
1. Add design tokens in CSS (type scale, spacing, radius, shadows, color roles).
2. Replace homepage hero with outcome-first structure:
   - headline
   - one-sentence differentiation
   - primary + secondary CTA
   - trust strip
3. Add homepage proof section with 3 quantified outcomes.
4. Add stronger "How we work" process strip (3 steps max).

## P1 (Day 2) — Service template v2
1. Rebuild one core service page template:
   - who it is for
   - common failure modes
   - engagement model + timeline
   - deliverables + owner accountability
   - conversion CTA block
2. Add FAQ block and trust reinforcement near bottom.

## P2 (Day 3) — Insight page polish + consistency pass
1. Improve insight page readability and in-article navigation.
2. Upgrade CTA modules between article sections.
3. Apply component/system consistency pass across homepage + service + insight.

---

## Definition of done
- Visual: clear premium hierarchy on desktop + mobile.
- Conversion: each page has a dominant CTA path with reduced friction.
- Proof: quantified outcomes visible without deep scrolling.
- Performance: no major regressions in page speed.
- Messaging: distinct operator voice, less generic consulting language.

## Next immediate execution task
Start branch: `feat/site-v2-premium` and implement P0 on:
- `docs/index.html`
- shared stylesheet used by homepage/service/insight pages.
