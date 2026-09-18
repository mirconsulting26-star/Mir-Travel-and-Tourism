# MIR Travel & Tourism — Antigravity Master Build Prompt

**Date:** 18 September 2026  
**Architecture:** React 19 + TypeScript + Vite / Tailwind + FastAPI + MongoDB Atlas / Render

## Goal
Build a production-structured travel agency website with two surfaces:
1. **Customer website** — flights, hotels, tours, destinations, blog/events, enquiries and online tour/package payments.
2. **Admin / Travel Desk** — content management, airline/hotel focus controls, bookings/customers, rich blog editor, media, and staff flight recommendations.

## Non-negotiables
- Separate `frontend/` and `backend/` folders in one Git repository.
- Backend owns secrets and all external API calls.
- Provider adapters: do not couple React to Amadeus/Stripe/PayPal schemas.
- No invented company tours, events, testimonials, partners or awards. Seed records are `DEMO`.
- Server-side price authority + verified payment webhooks.
- If production airline ticket issuance is not available, show search/quote/manual-request only. Never pretend to issue tickets.
- Brand/static assets live in `frontend/public`; runtime CMS media uses Cloudinary/CDN.

## Public routes
`/` `/flights` `/hotels` `/tours` `/tours/:slug` `/destinations` `/destinations/:slug` `/events` `/events/:slug` `/blog` `/blog/:slug` `/checkout/:orderId` `/booking/:reference` `/contact`

## Admin routes
`/admin/login` `/admin` `/admin/flight-desk` `/admin/tours` `/admin/destinations` `/admin/airlines` `/admin/hotels` `/admin/blog` `/admin/events` `/admin/bookings` `/admin/customers` `/admin/media` `/admin/settings`

## Customer features
### Flights
- one-way + round-trip MVP; multi-city data model ready
- origin/destination autocomplete
- dates, passengers, cabin, preferred airlines, direct-only
- results: price, currency, duration, stops, airline, segments, baggage, fare conditions
- sort/filter: cheapest, fastest, fewest stops, preferred airline, departure time
- show provider, timestamp and expiry where available

### Hotels
- destination, dates, guests/rooms, budget, stars, facilities
- card + detail page; room/rate variants; cancellation terms
- final availability/price re-check before booking

### Tours
- admin-controlled tours/departures/capacity/seats/prices
- detail pages with itinerary, inclusions, exclusions, gallery, FAQs, map
- date/participant selector, backend total, deposit/full payment

### CMS
- blog + events + destinations + tours
- SEO title/description, slug, cover, gallery, tags, publish_at, status, featured

## Admin / CMS
- secure login: Argon2 + role-based authorization (`SUPER_ADMIN`, `STAFF`)
- dashboard: bookings, payments, seats, enquiries, posts
- CRUD tours/destinations/airlines/hotels/events/blog/bookings/customers/settings
- airline/hotel flags: `active`, `preferred`, `featured`
- audit log for changes

### Rich blog editor
Block types: `heading`, `paragraph`, `rich_text`, `image`, `gallery`, `quote`, `callout`, `video`, `map`, `itinerary`, `faq`, `table`, `cta`.

Support: multi-image drag/drop, preview, reorder, alt text, captions, autosave, preview, duplicate, scheduled publish.

## Flight Desk
Structured client request:
`name/contact, origin, destination, dates, passengers, cabin, flexibility, budget, preferred/excluded airlines, max stops, baggage, time window, notes`.

Flow:
`search -> normalize -> hard filters -> explainable ranking -> shortlist -> save quote snapshot -> send/manual ticket request`.

Rank using explicit factors such as price, duration, stops, preferred airline and baggage. Store component scores so staff can explain recommendations.

## Data collections
`admin_users`, `customers`, `tours`, `tour_departures`, `destinations`, `airlines`, `hotels`, `blog_posts`, `events`, `flight_searches`, `quotes`, `orders`, `payments`, `media_assets`, `audit_logs`, `site_settings`.

## Provider stack
| Provider | Role | Initial use |
|---|---|---|
| Amadeus | flights/hotels | test/sandbox first; production booking later |
| Pexels | seeded imagery | free API, cache selected assets |
| Cloudinary | runtime CMS media | upload + CDN |
| Stripe | package/tour payments | hosted Checkout + webhooks |
| PayPal | optional second payment | hosted checkout + webhooks |
| Brevo or Resend | transactional email | free tier initially |
| MongoDB Atlas | DB | free cluster for MVP |
| Open-Meteo | weather | prototype/non-commercial unless separately licensed |

## Critical provider note
Amadeus test APIs are suitable for development. Production **Flight Create Orders** has special access requirements, including a ticket-issuance arrangement with a consolidator. Keep ticket issuance disabled until those requirements are met.

## Environment variables
```text
APP_ENV
SECRET_KEY
JWT_SECRET
MONGODB_URI
MONGODB_DB
FRONTEND_URL
CORS_ORIGINS
AMADEUS_CLIENT_ID
AMADEUS_CLIENT_SECRET
AMADEUS_BASE_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET
PEXELS_API_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
BREVO_API_KEY or RESEND_API_KEY
ADMIN_BOOTSTRAP_EMAIL
ADMIN_BOOTSTRAP_PASSWORD
```

## Render
Backend:
`pip install -r requirements.txt`  
`uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Frontend:
`npm ci && npm run build`  
Publish `dist/`

Create `render.yaml` for both services.

## Security
- backend-only secrets
- Pydantic validation
- admin authorization on backend
- CORS allowlist
- rate limit login/search/forms
- webhook signature verification + idempotency
- server-side amount calculation
- audit logs
- safe rich-text sanitization
- upload type/size validation
- no stack traces in production

## Seed content
Use clearly marked demo records only. Suggested visual subjects: Benidorm, Alicante, Tossa de Mar, Barcelona, Mediterranean destinations. Do not claim MIR has held any demo tour/event.

## Implementation order
1. Scaffold repo + Render config + env example
2. FastAPI core + Mongo + health
3. Auth/roles
4. Models/indexes/seed
5. Public CMS pages
6. Admin CRUD
7. Blog editor + media
8. Amadeus flight search
9. Amadeus hotel search
10. Flight Desk
11. Orders + Stripe/PayPal
12. Webhooks + email
13. Security/audit/errors
14. SEO/accessibility/responsive pass
15. Tests + production build/deploy verification

## Definition of done
- frontend + backend run locally
- Render config works
- admin login protected
- rich blog with multi-image upload works
- tours/departures/capacity/price editable
- airlines/hotels preferences editable without deployment
- flight desk returns normalized recommendations
- checkout uses backend price
- payment state comes from verified webhook
- no secret in frontend build
- tests/build pass
- OpenAPI docs available
- README complete

## Token-efficient agent rule
Do not regenerate whole files unnecessarily. Inspect first, patch only what is required, run tests/build after each major phase, and continue. Do not add dependencies without a concrete need.
