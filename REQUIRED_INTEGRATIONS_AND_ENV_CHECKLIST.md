# MIR Travel & Tourism — Required Integrations & Environment Variables Checklist

This document details all required environment variables, external API services, dummy placeholder values, and step-by-step instructions for replacing test/mock data with production credentials when ready.

---

## 1. Overview & Dummy Adapter Mode

The application is built using **Provider Adapters**. All external services have safe **Dummy / Mock Defaults** hardcoded into `backend/app/core/config.py` and adapter classes:

- If an API key is missing or left blank, the application **automatically falls back to Mock/Demo Mode**.
- No service will crash if keys are missing.
- You can develop, test, and present the entire website offline before procuring live API keys.

---

## 2. Master Environment Variables Checklist

### A. Backend Variables (`backend/.env`)

| Variable Name | Default / Dummy Value | Purpose | Required in Production? |
|---|---|---|---|
| `APP_ENV` | `development` | Environment mode (`development`, `staging`, `production`) | Yes (`production`) |
| `DEBUG` | `True` | Enable debug logs & detailed traceback | No (Set `False`) |
| `SECRET_KEY` | `DUMMY_SECRET_KEY_CHANGE_IN_PROD_12345` | Application secret key for session security | **YES — Change in Prod** |
| `JWT_SECRET` | `DUMMY_JWT_SECRET_CHANGE_IN_PROD_67890` | Secret used to sign admin JWT access tokens | **YES — Change in Prod** |
| `JWT_ALGORITHM` | `HS256` | JWT signing algorithm | Optional (Default `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` (24 Hours) | Admin session expiration time in minutes | Optional |
| `MONGODB_URI` | `mongodb://localhost:27017` | MongoDB connection string (Local or Atlas) | **YES** |
| `MONGODB_DB` | `mir_travel_db` | Database name | Optional |
| `FRONTEND_URL` | `http://localhost:5173` | Public URL of the React SPA | **YES** |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Allowed CORS origins for API requests | **YES** |
| `ADMIN_BOOTSTRAP_EMAIL` | `admin@mirtravel.es` | Initial Superadmin login email | Optional |
| `ADMIN_BOOTSTRAP_PASSWORD` | `AdminPass123!` | Initial Superadmin login password | **YES — Change in Prod** |
| `AMADEUS_CLIENT_ID` | `DUMMY_AMADEUS_CLIENT_ID` | Amadeus Flight & Hotel API Client ID | When wiring live Amadeus |
| `AMADEUS_CLIENT_SECRET` | `DUMMY_AMADEUS_CLIENT_SECRET` | Amadeus API Secret Key | When wiring live Amadeus |
| `AMADEUS_BASE_URL` | `https://test.api.amadeus.com` | Amadeus base API endpoint | Set prod endpoint in live |
| `STRIPE_SECRET_KEY` | `DUMMY_STRIPE_SECRET_KEY` | Stripe API secret key for payment sessions | When wiring live Stripe |
| `STRIPE_WEBHOOK_SECRET` | `DUMMY_STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret for verification | When wiring live Stripe |
| `PAYPAL_CLIENT_ID` | `DUMMY_PAYPAL_CLIENT_ID` | PayPal REST API Client ID | Optional (if using PayPal) |
| `PAYPAL_CLIENT_SECRET` | `DUMMY_PAYPAL_CLIENT_SECRET` | PayPal REST API Secret | Optional (if using PayPal) |
| `CLOUDINARY_CLOUD_NAME` | `DUMMY_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud account name for media uploads | When wiring Cloudinary |
| `CLOUDINARY_API_KEY` | `DUMMY_CLOUDINARY_API_KEY` | Cloudinary API Key | When wiring Cloudinary |
| `CLOUDINARY_API_SECRET` | `DUMMY_CLOUDINARY_API_SECRET` | Cloudinary API Secret | When wiring Cloudinary |
| `PEXELS_API_KEY` | `DUMMY_PEXELS_API_KEY` | Pexels API key for automated stock imagery | Optional |
| `BREVO_API_KEY` | `DUMMY_BREVO_API_KEY` | Brevo (Sendinblue) API key for booking emails | When wiring live emails |

### B. Frontend Variables (`frontend/.env`)

| Variable Name | Default / Dummy Value | Purpose | Required in Production? |
|---|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000/api/v1` | URL of the FastAPI backend service | **YES** |

---

## 3. How to Obtain & Replace Third-Party API Keys

When you receive live or sandbox API credentials, follow these steps to integrate them:

### 1. Amadeus Flight & Hotel Search
- **Sign Up**: Register at [Amadeus for Developers](https://developers.amadeus.com/).
- **Get Keys**: Create a new application under your developer workspace to obtain `API Key` (Client ID) and `API Secret`.
- **Replace**:
  ```env
  AMADEUS_CLIENT_ID=your_real_amadeus_client_id
  AMADEUS_CLIENT_SECRET=your_real_amadeus_client_secret
  AMADEUS_BASE_URL=https://test.api.amadeus.com  # Use https://api.amadeus.com in Production
  ```

### 2. Stripe Payments & Webhooks
- **Sign Up**: Register at [Stripe Dashboard](https://dashboard.stripe.com/).
- **Get API Key**: Go to Developers -> API keys to copy `Secret key` (`sk_test_...` or `sk_live_...`).
- **Get Webhook Secret**: Go to Developers -> Webhooks -> Add endpoint (`https://your-backend-domain.com/api/v1/checkout/webhook`) and copy `Signing secret` (`whsec_...`).
- **Replace**:
  ```env
  STRIPE_SECRET_KEY=sk_test_your_real_stripe_secret_key
  STRIPE_WEBHOOK_SECRET=whsec_your_real_stripe_webhook_secret
  ```

### 3. PayPal Business API (Optional)
- **Sign Up**: Register at [PayPal Developer Portal](https://developer.paypal.com/).
- **Get Credentials**: Create a REST API app under Apps & Credentials to get `Client ID` and `Secret`.
- **Replace**:
  ```env
  PAYPAL_CLIENT_ID=your_real_paypal_client_id
  PAYPAL_CLIENT_SECRET=your_real_paypal_client_secret
  ```

### 4. Cloudinary CMS Media Storage
- **Sign Up**: Register at [Cloudinary Console](https://cloudinary.com/console).
- **Get Keys**: Copy `Cloud name`, `API Key`, and `API Secret` from your account dashboard.
- **Replace**:
  ```env
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  ```

### 5. Brevo (Sendinblue) Transactional Emails
- **Sign Up**: Register at [Brevo Dashboard](https://app.brevo.com/).
- **Get Key**: Go to Transactional -> Settings -> SMTP & API Keys to generate an API key (`xkeysib-...`).
- **Replace**:
  ```env
  BREVO_API_KEY=xkeysib-your_real_brevo_api_key
  ```

### 6. MongoDB Atlas Cloud Database
- **Sign Up**: Register at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- **Create Cluster**: Create a free M0 cluster.
- **Get Connection String**: Database -> Connect -> Drivers -> Copy URI.
- **Replace**:
  ```env
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
  MONGODB_DB=mir_travel_db
  ```

---

## 4. Operational Content & Brand Assets Replacements

Before launch, replace the following demo elements with your official company data:

1. **Admin Credentials**: Update `ADMIN_BOOTSTRAP_PASSWORD` in `backend/.env` to a strong password.
2. **Demo Content Cleanup**:
   - Seed data in `backend/app/seed/seed_data.py` contains `[DEMO]` suffixes for tours, destinations, and blog posts.
   - Use the `/admin` portal or edit seed data to insert real MIR Travel tour packages, itineraries, prices, and high-resolution media.
3. **Brand Logo & Favicon**:
   - Replace logo image at `frontend/public/Logo.png`.
   - Update `frontend/public/brand/favicon.svg` with your final vector icon.
