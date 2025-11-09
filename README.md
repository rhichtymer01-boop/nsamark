# Nsamark Marketplace

Nsamark is a multi-vendor marketplace supporting specialized vendor categories, transporter dispatching, plugin marketplace, subscription management, and Paystack payments.

## Project Structure

```
.
├── backend/        # Express + MongoDB API (TypeScript)
├── frontend/       # React + Vite SPA (TypeScript)
├── docs/           # API documentation
├── .env.example    # Environment variable template
└── README.md
```

## Prerequisites
- Node.js 18+
- MongoDB
- Paystack API keys

## Setup
1. Copy `.env.example` to `.env` and fill in the values.
2. Install dependencies (run inside `backend` and `frontend` directories):
   ```
   npm install
   ```
3. Start development servers:
   ```
   # backend
   npm run dev

   # frontend
   npm run dev
   ```
4. Seed sample data (optional):
   ```
   npm run seed
   ```

## Features Outline
- Multi-vendor dashboards (Cold Store, Restaurant, Pre-order, Bet Predictor, Phone Shop, Mini Mart, Carpenter, Transporter with sub-types, Digital Products, Internet Vendors)
- Plugin marketplace supporting SMS, Ads, Sell Checker modules
- Subscriptions (weekly, monthly, yearly) with admin overrides
- Paystack integration for orders, wallet top-ups, withdrawals, subscriptions
- Real-time chat via Socket.IO
- Buy & Sell classifieds area
- Internet vendors bulk SMS simulation and bundle selection
- Vendor KYC workflow with file uploads, reviewer notes, and admin approvals
- AFA membership registration and payment handling
- Responsive React frontend using TailwindCSS

Refer to `docs/API.md` for available API endpoints.
