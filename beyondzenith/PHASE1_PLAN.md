# BeyondZenith — Phase 1 Foundation (Week 1)

## Operating Guardrails
- Outbound emails: draft-only, never send without explicit approval.
- Website changes: propose as Git commits (no direct production edits).
- No external spending/signups without explicit approval.
- Work in weekly execution cycles.

---

## 1) One-page Consulting Website Structure

### A. Hero (above the fold)
- Headline: outcome-driven statement.
- Subheadline: who you help + what you implement.
- Primary CTA: `Book Discovery Call`.
- Secondary CTA: `See Service Packages`.

### B. Credibility Strip
- 3 short trust signals (years, systems delivered, domains served).
- Optional logos/testimonials placeholder.

### C. Services (cards)
- Fractional CTO
- AI Integration Consulting
- Technical Advisory / Architecture

### D. Engagement Models
- Sprint / Monthly retainer / Advisory-on-call.
- Clear “best fit” bullets per model.

### E. Outcomes + Process
- 4-step process: Assess → Plan → Implement → Transfer.
- Focus on measurable business outcomes.

### F. ICP Fit Section
- “We work best with…” list.
- “Not a fit when…” list.

### G. Pricing Snapshot
- Starting ranges and what’s included.
- CTA to request scoped proposal.

### H. FAQ
- Timeline, data/security handling, tooling constraints, handover.

### I. Final CTA + Contact
- Booking link + email form (draft workflow for outbound follow-up).

---

## 2) Service Offerings (2–3)

### Service 1: Fractional CTO (Retainer)
**Use case:** teams needing senior technical leadership without full-time CTO.

**Includes:**
- Architecture and roadmap ownership
- Delivery/process governance
- Hiring/vendor technical screening
- Weekly leadership sync + async support

**Deliverables:**
- 90-day tech roadmap
- Risk register
- KPI dashboard (delivery + reliability + cost)

### Service 2: AI Integration Accelerator (4–6 weeks)
**Use case:** companies wanting practical AI deployment tied to ROI.

**Includes:**
- Opportunity mapping workshop
- 1–2 pilot automations/integrations
- Data/privacy and ops guardrails
- Internal enablement docs

**Deliverables:**
- Prioritized AI use-case backlog
- Implemented pilot(s)
- ROI assumptions + scale plan

### Service 3: Technical Advisory & Architecture Review (Sprint)
**Use case:** critical architecture decisions, scale/perf/cost concerns.

**Includes:**
- Current-state assessment
- Bottleneck/risk analysis
- Target architecture recommendation

**Deliverables:**
- Decision memo
- Architecture diagram pack
- 30/60/90 execution plan

---

## 3) Target ICPs

### ICP A: Founder-led SMB SaaS (5–30 engineers)
- Stage: post-MVP, pre-scale
- Pain: slow delivery, accumulating tech debt, no senior technical strategy
- Buyer: founder/CEO/COO

### ICP B: Services/operations-heavy SMB (20–200 staff)
- Stage: mature operations, fragmented systems
- Pain: manual workflows, poor system integration, low automation
- Buyer: operations director / GM / CIO-lite role

### ICP C: Traditional business modernizing with AI
- Stage: digital transformation in progress
- Pain: “AI interest but no execution path,” governance uncertainty
- Buyer: owner/operator or transformation lead

---

## 4) Positioning Statements

### Primary
BeyondZenith helps growing businesses turn technical complexity into measurable business outcomes through senior engineering leadership, pragmatic architecture, and ROI-focused AI integration.

### Alternative A (CTO-heavy)
Get CTO-level technical leadership without full-time executive overhead.

### Alternative B (AI-heavy)
Move from AI hype to production-grade automation tied to real operational gains.

### Alternative C (execution-heavy)
From architecture decisions to shipped outcomes—fast, lean, and implementation-first.

---

## 5) Pricing Tiers (Draft)

## Tier 1 — Advisory Sprint
- **AUD 3,500–6,500**
- 2 weeks, fixed scope
- Architecture/advisory deep-dive + action plan

## Tier 2 — AI Integration Accelerator
- **AUD 8,000–18,000**
- 4–6 weeks
- Discovery + pilot implementation + handover

## Tier 3 — Fractional CTO Retainer
- **AUD 6,000–15,000 / month**
- Ongoing monthly engagement
- Leadership, roadmap, governance, technical decisions

### Pricing notes
- Keep ranges public; final proposals scoped after discovery.
- Add optional success metric bonuses only after baseline KPIs are established.

---

## 6) First Outreach Campaign (Week 2 Launch-Ready)

## Campaign: “Technical Debt to AI ROI”

### Target
- 30 ideal prospects (10 per ICP)
- Channels: LinkedIn + warm introductions + email drafts

### Asset Set
1. One-page offer brief (PDF/Notion)
2. 3 outbound email drafts (never sent automatically)
3. 3 LinkedIn DM scripts
4. 1 diagnostic checklist lead magnet

### Sequence (10 business days)
- Day 1: Initial message
- Day 3: Follow-up with specific pain hypothesis
- Day 6: Case-style insight + CTA for 20-min call
- Day 10: Final soft close

### KPI Targets
- Reply rate ≥ 12%
- Discovery calls booked: 4–6
- Proposal conversion target: 25–35%

---

## Weekly Execution Cycle (Default)

### Monday: Plan
- Prioritize 3 outcomes for the week.
- Confirm dependencies/approvals needed.

### Tue–Thu: Build
- Produce assets, drafts, and commits.
- Keep WIP low; one major thread at a time.

### Friday: Review
- Pipeline + KPI review.
- Decision log updates.
- Next-week backlog grooming.

---

## Fast Rollback / Escape Hatch
- All website and campaign assets stay on feature branches until approved.
- Rollback command path:
  - discard branch: `git checkout main && git branch -D <branch>`
  - revert commit on branch: `git revert <commit>`
- No outbound communication is sent without explicit go-ahead.
