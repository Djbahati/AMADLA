# Amadla Energy System

Production-ready full-stack platform for managing energy projects, customer usage, billing, payments, alerts, and operational dashboards.

## Tech Stack

- Backend: Node.js + Express + PostgreSQL-compatible Prisma schema with GraphQL and REST endpoints
- Frontend: React (Vite) + Tailwind CSS
- Database: PostgreSQL / SQLite support via Prisma
- Auth: JWT with refresh tokens

## Project Structure

- `backend/` - Express API, Prisma schema, public and protected REST endpoints, GraphQL support, contact/quote workflows, billing, alerts, and reporting
- `src/` - React frontend (public marketing pages, quote portal, authenticated dashboard, energy tools)
- `mobile/` - Expo mobile app skeleton for companion energy monitoring and quote requests

## Step-by-Step Setup

### 1) Backend setup

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### 2) Frontend setup

```bash
cd ..
npm install
npm run dev
```

### 3) Mobile app setup

```bash
cd mobile
npm install
npm run start
```

### 4) Run frontend and backend together

```bash
npm run dev:all
```

## Default Seed Accounts

- Admin: `admin@amadla.energy` / `Password123!`
- Operator: `operator@amadla.energy` / `Password123!`
- User: `customer@amadla.energy` / `Password123!`

## Core Features Included

- User registration/login + JWT auth
- Role-based access control (Admin/Operator/User)
- Public project browsing and quote request pages
- Contact request endpoint and quote recommendation API
- Project creation and assignment for energy portfolios
- Energy usage recording and monitoring
- Billing generation by usage and price-per-unit
- Partial/full payments with balance tracking
- Alerts for low production, overuse, and payment due
- Admin KPI dashboard (energy, revenue, active users, alerts)
- GraphQL project queries via `/api/graphql`
- CSV/PDF report export endpoints
- API rate limiting and logging

## Important Commands

```bash
npm install
npm run dev
```

For backend-specific:

```bash
cd backend
npm install
npm run dev
```
