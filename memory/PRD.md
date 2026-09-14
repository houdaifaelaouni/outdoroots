# Chile Travel Builder — PRD

## Original Problem Statement
User provided a React component for a custom Chile travel package builder: visitors compose bespoke trips across Patagonia, Atacama Desert, and Santiago & Central Chile (days 0–14 per destination, curated activities, accommodations, live EUR pricing, dates, contact info), then submit a booking request that the travel team executes. User choices: full-stack (bookings saved to DB + admin view), premium light & airy design (warm neutrals, deep blue, elegant serif), EUR currency. Art direction mandate: Awwwards-level — kinetic hero with masked line reveal, editorial marquee, numbered manifesto chapters, framer-motion reveals, lenis smooth scrolling, parallax hero.

## User Personas
- Traveler: composes a custom luxury Chile package, sees live EUR pricing, submits a booking request.
- Travel agency team member (admin): reviews incoming booking requests, sees itemized details, updates status.

## Architecture
- Frontend: React 19 + Tailwind + shadcn/ui + framer-motion + lenis. Routes: `/` (landing + builder), `/admin` (team console).
- Backend: FastAPI + Motor (MongoDB). Endpoints: `POST /api/bookings` (public), `GET /api/bookings` (admin), `PATCH /api/bookings/{id}` (admin status), `POST /api/auth/login`, `GET /api/auth/me`.
- Auth: JWT (12h, Bearer in localStorage), bcrypt hashes, idempotent admin seed at startup from env (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
- Pricing: base/day/person + activities/person + accommodation/night/person, est. 19% taxes & service, grand total.

## Implemented (2026-09-14)
- Kinetic hero with masked line-by-line reveal, parallax background, stats row, scroll CTA
- Slow editorial marquee strip (CSS animation, pause on hover)
- Numbered manifesto chapters 01/02/03 with arch-framed imagery, scroll reveals, "Compose this chapter" deep-links into builder
- Full builder: destination tabs, day steppers + slider, activity selection, accommodation select (+ custom), sticky sidebar (brief, travelers, dates, tools, contact), live summary with per-chapter subtotals and grand total
- Actions: Load Sample, Share (Web Share API + clipboard fallback), Export JSON, Reset, Submit for Booking (persists to MongoDB)
- Admin console: JWT login, stats (requests/pending/pipeline), booking cards with expandable itemization, status workflow (pending/contacted/confirmed/archived)
- Backend verified via curl (login, create, list, patch, 401 rejection); E2E verified via screenshots (sample load → submit → admin sees request)

## Test Credentials
- Admin: admin@chiletravel.com / Patagonia!2026 (see /app/memory/test_credentials.md)

## Backlog
- P1: Email notification to team on new booking (Resend integration)
- P1: Delete/archive bookings from admin; filter/search by status, date, value
- P2: Multi-currency toggle (EUR/USD), seasonal pricing rules
- P2: Save draft packages client-side (shareable URL with encoded state)
- P2: PDF itinerary export
- P3: More destinations (Easter Island, Chilean Lake District), per-day itinerary timeline view
