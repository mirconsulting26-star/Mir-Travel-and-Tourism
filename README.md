# MIR Travel & Tourism — Full-Stack Travel Platform

Production-ready full-stack travel agency web application featuring a **Public Customer Portal** and a protected **Admin Travel Desk & CMS**, built with Python 3.12+ FastAPI, MongoDB, React 19, TypeScript, Vite, and Tailwind CSS.

---

## 🌟 Key Features

### 1. Public Customer Website
- **Hero & Search Switcher**: Quick search tabs for Flights, Hotels, and Escorted Tours.
- **Flight Search & Results**: Origin/destination autocomplete, cabin classes, direct flight filters, price range sliders, and multi-leg segment timelines.
- **Hotel Inventory**: Destination search, star rating badges, amenity tags, room options, and cancellation terms.
- **Escorted Tours & Packages**: Detailed day-by-day itineraries, inclusions/exclusions, departure date selector, deposit vs full payment options.
- **Destinations & Travel Journal**: Rich destination guides and blog articles rendering 13 custom block types (`heading`, `paragraph`, `quote`, `callout`, `gallery`, `image`, etc.).
- **Checkout & Booking Confirmation**: Server-side price authority calculation, simulated checkout, and booking reference generation.

### 2. Admin Travel Desk & Operational CMS (`/admin`)
- **Flight Desk Recommendation Engine**:
  - Structured client requirement builder (Contact, Origin, Destination, Dates, Passengers, Cabin, Flexibility, Budget, Preferred/Excluded Airlines, Max Stops, Baggage).
  - Multi-factor explainable ranking algorithm scoring flights based on price competitiveness, duration efficiency, stops penalty, preferred airline bonus (+10 pts), and baggage match.
  - Quote snapshot generator saving active quote references valid for 7 days.
- **Airline Focus Controls**: Toggle `preferred`, `active`, or `featured` flags for airlines (e.g. Iberia, Vueling) without redeploying code.
- **Rich Blog Block Editor**: Compose articles with drag-and-drop block ordering, cover image previews, and draft/publish controls.
- **Security & Audit Logs**: Argon2 password hashing, PyJWT role-based authorization (`SUPER_ADMIN`, `STAFF`), CORS allowlists, and audit log tracking.

---

## 🔌 Provider Adapter Architecture

All third-party services are isolated behind abstract **Provider Adapter Interfaces**. Out of the box, the application operates in **Mock / Demo Mode** using realistic seed data so all search, quote, booking, and CMS features can be tested offline without external API keys.

| Service | Provider Interface | Default Adapter | Live Production Adapter |
|---|---|---|---|
| Flights | `BaseFlightProvider` | `MockFlightProvider` | `AmadeusFlightAdapter` |
| Hotels | `BaseHotelProvider` | `MockHotelProvider` | `AmadeusHotelAdapter` |
| Payments | `BasePaymentProvider` | `MockPaymentProvider` | `StripeAdapter` / `PayPalAdapter` |
| Media | `BaseMediaProvider` | `MockMediaProvider` | `CloudinaryAdapter` |
| Email | `BaseEmailProvider` | `MockEmailProvider` | `BrevoAdapter` |

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Python 3.12+
- Node.js 18+

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m app.seed.seed_data
uvicorn app.main:app --reload --port 8000
```
- **API Documentation**: Open `http://localhost:8000/docs` in your browser.
- **Bootstrap Admin Credentials**:
  - Email: `admin@mirtravel.es`
  - Password: `AdminPass123!`

### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:5173` for the customer site.
- Open `http://localhost:5173/admin/login` for the Travel Desk portal.

---

## 🧪 Running Automated Tests
```bash
cd backend
python -m pytest tests/ -v
```

---

## ☁️ Render Deployment (`render.yaml`)
The repository contains a multi-service `render.yaml` configuration defining:
1. **Web Service**: FastAPI backend (`uvicorn app.main:app`).
2. **Static Site**: React Vite frontend (`dist/` build output).
