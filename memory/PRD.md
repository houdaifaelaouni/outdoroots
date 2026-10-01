# Outdooroots — Product Requirements Document

## Brand
**Outdooroots** — Aventura · Vida · Naturaleza
Adventure travel inquiry platform for Chile. Inquiry-based, team-reviewed proposals — not instant booking.

## Audiences
- International travelers (EN/ES) seeking guided Chile adventures
- Internal team managing inquiry pipeline and commercial quotes

## Core Requirements
- Five destination chapters: Patagonia, Atacama, Santiago & Central Chile, Easter Island, Lake District
- Inquiry/proposal workflow — never imply confirmed reservations
- EUR illustrative estimates, not approved commercial prices
- English default, Spanish supported
- No emails, payments, live inventory, or external CRM

## What's Been Implemented

### Visual Redesign (Latest)
- Full dark theme redesign inspired by The North Face / Mammut
- Bold sans-serif typography (Plus Jakarta Sans), uppercase headings
- Dark obsidian (#090A0C) background, alpine red (#FF3B30) accents
- Adventure photography for all 5 destinations
- Responsive design (desktop + mobile)
- Sticky dark header with navigation
- Full-bleed hero with dramatic Patagonia imagery
- Destination bento grid (5 chapters)
- Signature expedition cards with tags and imagery
- CTA section linking to AI assistant
- Dark-themed trip builder with stepped brief form
- Dark-themed AI chat page and floating widget
- Dark-themed admin/team workspace
- All Prompt Kit components installed (shadcn registry)

### AI Travel Assistant
- xAI Grok-3 powered chat with streaming responses
- Full Outdooroots context (5 regions, lodges, activities, practical advice)
- Dedicated /chat page with suggestion cards
- Floating chat widget on homepage (hidden on /chat and /admin)
- Bilingual responses (matches user language)
- Prices always marked as illustrative

### Trip Builder
- Three-step adventure brief (Essentials, Rhythm, Details)
- Five-region route designer with reordering
- Day-by-day journey timeline
- Experience and accommodation selection per region
- Package summary with EUR estimates
- PDF export (one-page A4, ReportLab)
- Contact/proposal request form
- Inquiry confirmation with reference

### Team Workspace (/admin)
- JWT auth (admin@chiletravel.com)
- Inquiry pipeline: New → Contacted → Proposal Sent → Confirmed + Lost/Archived
- Filtering by stage, destination, type, date range
- Business insights: stage distribution, destinations, seasons, sources
- Per-inquiry workspace with traveler brief, route details, daily timeline
- Team follow-up: internal notes, next action, follow-up dates
- Commercial quote editor (CLP costs, margins, EUR conversion)
- Reviewed proposal PDF download (privacy-safe)

### Render Deployment Ready
- render.yaml blueprint for one-click deploy
- build.sh script (installs deps, builds frontend, copies to backend/static)
- FastAPI serves React build as static files in production
- MongoDB Atlas compatible (free tier)
- RENDER_DEPLOY.md with step-by-step instructions

## Architecture
- Frontend: React 19, Tailwind CSS 3.4, shadcn/ui, Framer Motion, Prompt Kit
- Backend: FastAPI, Motor (async MongoDB), ReportLab, OpenAI SDK (xAI)
- Database: MongoDB
- Auth: JWT cookie-based admin auth
- AI: xAI Grok-3 via OpenAI-compatible API

## API Endpoints
- GET /api/ — health check
- POST /api/auth/login — admin login
- POST /api/bookings — create inquiry
- GET /api/bookings — list inquiries (auth)
- PATCH /api/bookings/{id} — update inquiry status (auth)
- PUT /api/bookings/{id}/quote — save commercial quote (auth)
- GET /api/bookings/{id}/proposal.pdf — download reviewed proposal (auth)
- POST /api/itinerary/pdf — generate visitor PDF
- POST /api/chat — AI chat (streaming SSE)

## Explicit Exclusions
- No email alerts or automated emails
- No payments/deposits/Stripe
- No live inventory or availability
- No external CRM
- No live FX rates
- No fabricated certifications or partnerships

## Backlog (Future)
- Real commercial rates and team-approved pricing
- Verified business contact/policy/registration info
- Departure calendars
- Referral/draft-sharing
- Specialized product lines
