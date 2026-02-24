# LeadSathi

**Never miss a lead again.**

LeadSathi is a simple CRM and follow-up management system for Indian small businesses. Manage leads from WhatsApp, calls, website forms, and Instagram in one dashboard with follow-up reminders and one-click WhatsApp messaging.

---

## Features (MVP)

- **Lead management** – Add leads manually, capture from website forms. Store name, phone, source (WhatsApp / Call / Website / Instagram), status (New, Follow-up, Converted, Lost).
- **Follow-up reminders** – Set date & time, see daily reminder list.
- **WhatsApp integration** – Click-to-WhatsApp from dashboard with pre-written messages.
- **Simple dashboard** – Total leads, follow-ups due today, converted count, basic performance.
- **User & roles** – Owner and Sales executive; each user sees their own (or org) leads.

---

## Tech stack

| Layer    | Stack        |
|----------|--------------|
| Frontend | React, Vite, Tailwind CSS |
| Backend  | FastAPI, JWT |
| Database | MongoDB      |

---

## Quick start

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env     # Edit .env: set MONGODB_URI, JWT_SECRET
```

**If `pydantic-core` fails to build** (e.g. "Rust not found" / "Failed building wheel"): use Python 3.10, 3.11, or 3.12 (pre-built wheels available). Create a fresh venv with that Python and install again.

Ensure MongoDB is running (local or Atlas). Then (use the venv’s Python so the reloader uses the same interpreter):

```bash
source venv/bin/activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### 3. Use the app

1. Open **Start Free Trial** → Register as **Business owner**.
2. **Dashboard** – See stats and follow-ups due today.
3. **Leads** – Add leads, filter by status/source, edit, delete, open WhatsApp.
4. **Follow-ups** – Schedule follow-up for a lead; mark done or delete.

---

## Website form capture

To capture leads from your website form into LeadSathi:

1. In LeadSathi, log in as owner and note your **Organization ID** (from profile/settings or use your user ID from browser storage).
2. POST to your backend:

   `POST /api/lead-capture`

   Body (JSON):

   ```json
   {
     "organization_id": "YOUR_OWNER_OR_ORG_ID",
     "name": "Customer Name",
     "phone": "9876543210",
     "email": "optional@email.com",
     "notes": "Optional notes"
   }
   ```

   All leads created this way get `source: "website"` and `status: "new"`.

---

## Environment

**Backend (`.env`)**

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `DATABASE_NAME` | Database name (default: `leadsathi`) |
| `JWT_SECRET` | Secret for JWT signing (use a strong value in production) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry (default: 60) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (optional; for “Sign in with Google”) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `FRONTEND_URL` | Frontend origin (e.g. `http://localhost:5173`) |
| `BACKEND_URL` | Backend origin (e.g. `http://localhost:8000`); must match Google redirect URI |

**Google sign-in:** Create OAuth 2.0 credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Set Authorized redirect URI to `{BACKEND_URL}/auth/google/callback`.

**Frontend (`.env` or `.env.local`)**

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend URL (e.g. `http://localhost:8000`) |

---

## Monetization (reference)

- **Basic** – ₹999/month (e.g. 500 leads, 1 user)
- **Team** – ₹1,999/month (e.g. unlimited leads, up to 20 users)
- 7-day free trial

---

## License

Proprietary. All rights reserved.
