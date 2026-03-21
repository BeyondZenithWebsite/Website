# BeyondZenith Image + Infographic Visual Audit — 2026-03-21

## Scope reviewed
- Homepage visual system (logo, hero/support graphics)
- Service hero images
- Insight hero images
- Inline infographic SVG blocks and data-visual cards

## Rating scale
- 9–10: premium, consistent, production-ready
- 7–8: good, minor polish needed
- 5–6: usable but dated/inconsistent
- <=4: replace

## Summary rating
- **Logo system:** 8.3/10 (clean and scalable, but header mark can be refined later for stronger distinctive character)
- **Service hero images:** 7.4/10 (improving; one major replacement shipped)
- **Insight hero images:** 7.1/10 (mixed consistency; key low performers replaced this pass)
- **Infographic/data SVGs:** 6.6/10 (clear but visually flat; needs design-system-level restyling for premium finish)
- **Overall visual media consistency:** 7.3/10

## Replaced in this pass (live-ready)
1. `docs/assets/insights-hero/ai-implementation-mistakes-companies-make.jpg`  
   - **Old:** visually generic / low-impact  
   - **New:** premium dark editorial style, stronger depth and polish
2. `docs/assets/insights-hero/cto-scorecard-template.jpg`  
   - **Old:** flatter visual hierarchy  
   - **New:** stronger analytics/command-center visual, clearer enterprise tone
3. `docs/assets/insights-hero/how-to-diagnose-software-delivery-problems.jpg`  
   - **Old:** weaker uniqueness  
   - **New:** more distinctive systems-diagnosis scene, better atmosphere
4. `docs/assets/services-hero/fractional-cto-services.jpg`  
   - **Old:** decent but inconsistent with newest premium direction  
   - **New:** leadership + execution visual aligned to current brand tone

## Keep (current)
- `docs/assets/logo-header.svg` (keep for now)
- `docs/assets/logo-beyondzenith.svg` (keep for now)
- Most `insights-hero/*.jpg` not yet replaced in this pass remain acceptable but should be unified in one style batch.

## Replace next (priority queue)
Completed in Wave 2 ✅
1. `docs/assets/insights-hero/engineering-metrics-that-matter.jpg`
2. `docs/assets/insights-hero/why-delivery-timelines-slip.jpg`
3. `docs/assets/insights-hero/cloud-cost-optimization-playbook.jpg`
4. `docs/assets/insights-hero/geo-for-consulting-firms.jpg`

## Wave 2 replacements shipped
- `docs/assets/insights-hero/engineering-metrics-that-matter.jpg`
- `docs/assets/insights-hero/why-delivery-timelines-slip.jpg`
- `docs/assets/insights-hero/cloud-cost-optimization-playbook.jpg`
- `docs/assets/insights-hero/geo-for-consulting-firms.jpg`

## Infographic/UI visual improvements required (next wave)
- Standardize infographic stroke weight and corner radii
- Introduce one consistent 3-tone palette for data blocks (ink/navy/cyan accent)
- Add subtle depth layer (shadow + border + noise texture) for all `.insight-*-data.svg` containers
- Unify heading-caption spacing around infographic modules

## Infographic Wave shipped
- Rebuilt `docs/assets/infographic-delivery.svg` with premium dark theme, stronger card hierarchy, cleaner step flow, and metric chips.
- Rebuilt `docs/assets/infographic-ai-roi.svg` with consistent 4-level ladder styling, stronger contrast hierarchy, and cleaner progression cues.

## Logo recommendation
- Keep current logo during active site iteration.
- Create **Logo v2 micro-refresh** as a separate controlled task:
  - strengthen header-lockup optical balance
  - improve small-size rendering (32–120px)
  - keep existing brand equity (evolution, not redesign)
