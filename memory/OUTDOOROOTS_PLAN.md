# Outdooroots approved revision — execution plan

User explicitly approved and requested immediate execution. Supersedes the interrupted three-feature Chile Travel Builder work. No email alerts or automated emails, payments, inventory, external CRM/FX/messaging integrations.

## Product requirements
- Rebrand public app Outdooroots. Wordmark only, Aventura · Vida · Naturaleza / En un nuevo viaje. Retain light/airy editorial serif, navy, photos, restrained motion. Adventure/local culture, not luxury-only.
- English default plus Spanish visitor journey. EUR in both, no currency switch.
- International travelers primary, corporate/private groups secondary, domestic weekend/family options. Photography/workation optional interests.
- Three starts: curated editable signature concepts (Patagonia on Foot, Atacama Under the Stars, Lakes, Forests & Local Life); personal design; group brief. No promised departures or inventory.
- Progressive practical brief: type, dates/flexibility/duration/party composition, clearly per-person vs total EUR budget, interests, pace, experience, comfort, optional access/practical needs. Group org/size/goals/requirements, no small-party pricing/limit. Contact at proposal request.
- Explain rule-based recommendations using actual chosen preferences; unknown suitability requires team review.
- Keep five destinations, allow reordering. Full/half-day scheduling, downtime, explicit unscheduled capacity overflow. Inter-region/Easter Island transfers review. Complete trip nights total days minus one assigned to destination or unresolved transit. Date mismatch warnings, no silent date edits. Unknown season/difficulty/age/access/acclimatization review, no fabricated safety guidance.
- Honest commercial estimate: total + per-person/party count, separated components/charging basis, shared items not multiplied per person. Remove base charges and blanket19% tax. Sample EUR prices marked illustrative; unpriced quote required. Inquiries allowed incomplete.
- Team-only costs CLP and selling prices or cost-derived margins. EUR conversion only from team-approved dated CLP/EUR rate, no invented default. Explicit configured fees/tax. Customer quote validity/outstanding checks. Private costs/margins/internal notes excluded from public exports.
- Mobile live daily timeline and one-page Outdooroots summary PDF before contact. PDF uses compressed highlights even long trips; date/days/stays/estimate or reviewed quote/inclusions/exclusions/validity/planning issues/proposal not reservation.
- Submission label Request my adventure proposal, on-screen reference, team review, no unsupported response time/email claim.
- Preserve existing Mongo inquiries. Pipeline New, Contacted, Proposal sent, Confirmed, Lost, Archived. Search/filter stage/date/destination/type. See brief/schedule/estimate/source/questions; internal notes,next action,follow-up,date lost/review reason; commercial review and safe reviewed PDF.
- Real analytics: inquiries/stages, overdue followups, first-contact timing, proposal confirmation conversion, requested destinations/months/budgets/types/sources, confirmed quote value not revenue. No fabricated CAC/ROI/profit/impact.
- No unverified Sernatur registration #81017, logo, contacts, reviews, partnerships, certifications, impact, guarantees. Named lodges preferences only.

## Source documents
https://customer-assets-eiarnc6j.emergentagent.net/job_trip-composer-1/artifacts/mvubwtnd_outdooroots-business-foundations-complete-analysis.pdf
https://customer-assets-eiarnc6j.emergentagent.net/job_trip-composer-1/artifacts/dqt5vw7n_outdooroots-business-foundations-comprehensive-strategic-report.pdf
Both analyzed. Documents contain unaudited statistics and inconsistent forecasts: not public claims/rates. No confirmed contact email/phone found. Approved user plan takes precedence over document recommendations and package names.

## Independently testable execution steps
1. Restore missing itinerary_pdf backend module; health and create inquiry work.
2. Extend inquiry/brief/commercial schemas and protected endpoints; validate group/incomplete inquiry, preserve old records, reject invalid quote FX/margins, protect private data.
3. Update builder nights/order/price/schedule logic; verify total nights D-1, capacity<=1/day, zero base/tax, private guide per group, group quote required.
4. Implement bilingual storefront/signatures/brief/timeline/PDF flows; check all three starts, recommendations, ordering, language switch without state loss, responsive UI, one-page PDF.
5. Add team pipeline/actions/quote/analytics, verify auth and persistence, no private values in PDF.
6. Batch test with testing agent, fix findings, update PRD.

## Backlog after revision
Approved departure calendars, reviewed-quote deposits (only future approval), referral rewards, traveler drafts/sharing, specialized photography/workation products. No email automation unless explicitly re-requested.
