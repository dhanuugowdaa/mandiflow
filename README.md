# MandiFlow — National Agricultural Logistics & Real-Time Intelligence Platform

MandiFlow is a national multi-stakeholder agricultural logistics, quality assaying, and trading platform connecting Farmers, FPOs, e-NAM National Electronic Auctions, APMC Mandi Yards, Reefer Cold-Chain Fleets, and Platform Administrators under Zero-Trust Role-Based Access Control (RBAC) and DPDP Act 2023 compliance.

---

## 🌟 Key Features

1. **6 Isolated Stakeholder Dashboards:**
   - **Farmer Dashboard (Kisan Seva):** 10 vegetable commodities, CACP MSP Floor Guard, Arrhenius kinetic spoilage simulator, and Shapley freight coalition calculator.
   - **FPO Dashboard (Aggregation Hub):** Automated multi-bin packing via GRASP combinatorial heuristics and botanical ethylene co-loading isolation compliance.
   - **e-NAM Dashboard (National Trade Hub):** AGMARK quality assaying parameters, multivariate machine learning price discovery trained on authentic historical APMC datasets, and real-time electronic bidding floor.
   - **Mandi APMC Dashboard (Scale & Yard):** Digital gate-pass lookup, Gross/Tare weighbridge calculations with $\pm 2.0\%$ tolerance discrepancy detection, and Arhatiya cess settlement.
   - **Truck Dashboard (Cold Logistics):** Live GPS corridor tracking (NH-48), IoT reefer chamber temperature & ethylene telemetry sensors, and cryptographic ePoD (Electronic Proof of Delivery) signing.
   - **Admin Dashboard (Apex Governance):** DPDP Act 2023 tamper-evident SHA-256 audit ledger, regulatory cess simulation, and carbon credit metrics.

2. **Real-Time Backend & WebSocket PubSub Engine:**
   - Express 5.0 REST API running on port `5000`.
   - WebSocket real-time pubsub engine (`/ws`) streaming live trade bids, weighments, truck IoT sensor ticks, and market price changes.
   - Automatic fallback to high-fidelity, deterministic real-time simulations if external APIs are not yet configured.

---

## 🚀 Running the Project

### 1. Start Both Backend & Frontend

Open two terminals in the project root:

**Terminal 1 (Backend Server):**
```bash
npm run server
```
*Runs on `http://localhost:5000` with WebSocket on `ws://localhost:5000/ws`.*

**Terminal 2 (Frontend Client):**
```bash
npm run dev
```
*Runs on `http://localhost:5174` with automatic proxy to the backend API.*

---

## 🔑 External API Keys Guide

Configure your keys in `.env` (a template is available in `.env.example`):

| Environment Variable | Description | Where to Get Key | Default if Empty |
| :--- | :--- | :--- | :--- |
| `DATA_GOV_IN_API_KEY` | Daily APMC mandi commodity prices from Open Government Data (OGD) | Free sign up at [data.gov.in](https://data.gov.in/) | Real-time market volatility simulator |
| `SMS_PROVIDER` | SMS Provider for Kisan OTP: `fast2sms`, `twilio`, or `mock` | - | `mock` (Auto-fills OTP `729104` & logs to terminal) |
| `FAST2SMS_API_KEY` | Real OTP SMS delivery to Indian mobile numbers | [fast2sms.com](https://www.fast2sms.com/) | Simulation mode |
| `TWILIO_ACCOUNT_SID`<br>`TWILIO_AUTH_TOKEN`<br>`TWILIO_PHONE_NUMBER` | Global SMS OTP delivery | [twilio.com](https://www.twilio.com/) | Simulation mode |
| `OPENWEATHER_API_KEY` | Real ambient weather for Nashik / Delhi mandis (influencing Arrhenius shelf-life decay) | [openweathermap.org](https://openweathermap.org/api) | Climatic Agri-Met model |
| `OPENROUTESERVICE_API_KEY` | Heavy vehicle truck corridor routing along NH-48 | [openrouteservice.org](https://openrouteservice.org/) | Deterministic NH-48 transit waypoints |
| `JWT_SECRET` | Cryptographic secret for DPDP Act 2023 session hashing | Any secure alphanumeric string | Default secure salt |

---

## 🛠️ API Endpoints Summary

- `GET /api/health` — Backend and WebSocket service health check.
- `POST /api/auth/login` — Zero-Trust authentication and session token generation.
- `POST /api/auth/otp/send` — Dispatches 6-digit Kisan OTP via real SMS gateway or sandbox.
- `POST /api/auth/otp/verify` — Validates OTP and returns authorized session.
- `GET /api/commodities` — 10 vegetable commodity prices and MSP guard parameters.
- `POST /api/commodities/sync-live` — Forces real-time sync with Agmarknet data.gov.in.
- `GET /api/farmer/pledges` — Queries active harvest pledges.
- `POST /api/farmer/pledges` — Creates new pledge and calculates Shapley coalition savings.
- `POST /api/fpo/optimize` — Runs GRASP combinatorial bin-packing optimization.
- `GET /api/enam/lots` — Lists live electronic auction lots.
- `POST /api/enam/bid` — Broadcasts real-time bid to trading floor.
- `POST /api/enam/hammer` — Strikes auction gavel and seals e-NWR receipt.
- `POST /api/enam/predict` — Multivariate ML clearing price prediction from historical dataset.
- `POST /api/mandi/commit` — Certifies weighbridge gross & tare weights with $\pm2.0\%$ discrepancy analysis.
- `GET /api/truck/telemetry` — Live IoT reefer sensor readings.
- `POST /api/truck/toggle-fault` — Injects/recovers cold-chain compressor fault.
- `POST /api/truck/milestone` — Advances truck transit waypoints along NH-48.
- `POST /api/truck/epod` — Cryptographically signs electronic proof of delivery.
- `GET /api/admin/audit-logs` — Queries DPDP Act 2023 tamper-evident SHA-256 audit ledger.
- `POST /api/admin/policy` — Updates statutory mandi cess and commission rates.
