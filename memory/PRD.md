# Outdooroots — PRD

## Original product and approved direction
Originally Chile Travel Builder: a full-stack React/FastAPI/MongoDB custom trip composer with EUR estimates, five destination chapters, persisted requests, and a protected team console. The user approved a complete Outdooroots revision: personalized outdoor adventures connecting travelers with Chile's nature, culture, and local life. Full approved scope and source document references: `/app/memory/OUTDOOROOTS_PLAN.md`.

Brand: Outdooroots wordmark; Aventura · Vida · Naturaleza / En un nuevo viaje. Retain airy editorial serif typography, navy accents, photography and restrained motion, but not luxury-only positioning. English default and Spanish visitor journey. EUR remains the visitor currency. Public claims, contacts, registration and partnerships require verification; none were fabricated.

## Audiences
- Primary: international adventure travelers seeking personalized Chile experiences.
- Secondary: corporate/private groups, with dedicated organization/goals/large-party briefs rather than small-party pricing.
- Domestic/weekend/family travelers supported; photography and workation are optional interests.

## Implemented in current revision
- Restored interrupted backend dependency by completing ReportLab itinerary PDF service.
- Rebranded bilingual storefront, three entry paths, signature concepts (Patagonia on Foot, Atacama Under the Stars, Lakes, Forests & Local Life), editable recommendations with preference rationale.
- Progressive brief: type, dates/flexibility/duration, party composition, explicit per-person/total EUR budget, interests, pace, experience, comfort, accessibility, organization, group goals, requirements and referral source. Contact collected only on request.
- Five regions: Patagonia, Atacama, Santiago & Central Chile, Easter Island, Lake District. Region reordering, experiences/lodges/local-stay preferences, updated five-chapter sample.
- Correct whole-trip nights D−1, provisional boundary nights, full/half-day capacity ≤1/day, open time, overflow shown unscheduled, date mismatch warnings without date edits, transport/Rapa Nui/access/season/difficulty/age/acclimatization review notices.
- Honest illustrative estimates: selected experiences + nights only, total/per-person/party count, shared private guide charged once per group. Removed unexplained base charges and blanket19% tax. Unpriced stays/transport require quotes; group briefs do not use consumer pricing. Named lodges are unconfirmed preferences.
- Live bilingual daily timeline; one-page A4 Outdooroots summary PDF before contact. Long journeys use highlights; reviewed PDFs group large commercial schedules by category. Brand/date/duration/region ranges/stays/EUR/validity/inclusions/exclusions/planning issues/proposal-not-reservation labels; no internal-cost or note export.
- Inquiry persistence and on-screen OR reference, no reservation promises, no unsupported response-time promise or email claim. Incomplete/group zero-day briefs accepted. Existing inquiries preserved unchanged; legacy pending displayed as New.
- Protected pipeline New → Contacted → Proposal sent → Confirmed, plus Lost/Archived. Search/name/email/ref/organization, filters stage/received dates/destination/type. Brief, original estimate, daily schedule, notes, next action, follow-up date, review reason, required lost reason; recorded contact/proposal/confirmation events.
- Team-reviewed quote editor: private CLP unit costs, explicit billing quantity/basis, unit selling price OR gross margin; manual positive CLP-per-EUR rate plus approval date; quote validity; optional identified tax/service fees; customer inclusions/exclusions/outstanding checks; safe reviewed PDF. No live FX or invented rate. Stored quote is the approved commercial snapshot for that inquiry.
- Actual activity metrics: inquiry volume/stages, overdue follow-ups, mean first-contact time, recorded proposal conversion, requested destinations/seasons/budgets/types/sources, confirmed reviewed-quote value explicitly not collected revenue.

## Architecture
- React19, Tailwind, shadcn/ui, Framer Motion, Lenis; `/` visitor and `/admin` team routes.
- Locale context: `frontend/src/hooks/useLocale.js`; catalog translations/signatures: `data/outdooroots.js`.
- Visitor: `OutdoorootsHero`, `StartJourneys`, `OutdoorootsBuilder`; `builder/AdventureBrief`, `RouteDesigner`, `JourneyTimeline`.
- Trip state/calculation/payload: `hooks/usePackageBuilder.js`; deterministic scheduling `lib/itinerary.js`.
- Team: existing `pages/Admin.js` login with `TeamWorkspace`, `InquiryCard`, `QuoteEditor`.
- Backend: `server.py` API, `inquiry_models.py` brief/workflow/private quote validation and totals, `itinerary_pdf.py` ReportLab customer-safe summary.
- MongoDB via existing MONGO_URL/DB_NAME; existing users/bookings preserved, new brief/itinerary/workflow/quote fields on bookings.
- Existing authentication remains JWT Bearer token stored at `ctb_admin_token` in localStorage. Handoff's cookie-auth claim was incorrect. No authentication implementation/credentials changed.
- Frontend requests use REACT_APP_BACKEND_URL; all backend routes /api. ReportLab and pypdf installed/pinned via requirements freeze. No external service integration or extra API key needed.

## API
- POST `/api/bookings`: public inquiry, persisted reference; no internal fields accepted.
- GET `/api/bookings`: protected list preserving historical details.
- PATCH `/api/bookings/{id}`: protected pipeline/follow-up/reasons, event timestamps.
- PUT `/api/bookings/{id}/quote`: protected validated private CLP inputs and customer-safe EUR summary.
- POST `/api/itinerary/pdf`: public composition summary, no contact needed, no DB insert.
- GET `/api/bookings/{id}/proposal.pdf`: protected saved reviewed quote PDF; internal costs, margins, notes excluded.
- Existing POST `/api/auth/login`, GET `/api/auth/me` unchanged.

## Validation
- Iteration1:27 backend tests, initial smoke. Fixed ReportLab canvas error; rendering now uses supported wrapOn.
- Iteration2:31 backend tests plus desktop/mobile full visitor→inquiry→admin workflow→quote→PDF. EN/ES state preservation,100-traveler zero-day group, destination reorder12days/11nights, filters/persistence, exact250EUR quote math, PDF privacy.
- Iteration3:32 backend tests; actual70-day/30-experience and40-commercial-line one-page A4 stress/content/privacy tests; desktop/mobile contact form reveal. Production frontend build compiled successfully.
- Final contact accessibility refinement removes tall sticky sidebar so the proposal button stays reachable with ordinary scrolling for all-five-region packages; focused native-click verification pending.
- QA-only records cleaned by testing agents; historical and real user inquiries preserved. Regression tests under `backend/tests/`; reports `test_reports/iteration_1.json` through `iteration_3.json`.
- Test credentials remain unchanged in `/app/memory/test_credentials.md`.

## Operator inputs / limitations
- Public sample rates are illustrative, not approved supplier rates. Every itinerary remains a proposal, not a reservation. Real commercial quotes require manual approved costs, FX/date, validity and inclusions.
- No approved logo, public phone/email, verified registration, qualifications, seasonal/access rules, supplier inventory or partner agreements supplied. These are not presented as facts.
- PDF is intentionally one-page highlights, not every expanded daily detail; full timeline remains in the workspace.
- Team console language is English; bilingual scope is the visitor journey and PDFs.

## Explicit exclusions
No email alerts/automated email, SMS/marketing, payments/deposits/refunds, live inventory, external CRM/FX/messaging, supplier portal, native app, invented certification/impact/revenue/profit figures. Email remains excluded unless the user explicitly requests it again.

## Prioritized future backlog (not part of this revision)
- P1: Operator-approved real commercial catalog, qualifications/season/access guidance, contact details and policy wording when supplied.
- P2: Approved departure calendars; traveler draft saving and sharing; referral rewards.
- P2: Specialized photography/workation experiences after core offer validation.
- P3: Deposits only after reviewed quotes and explicit new payment approval. No payment integration now.
- Optional enhancement: editable team-reviewed packing checklists for the composed journey.
