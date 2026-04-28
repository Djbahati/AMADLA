# Amadla Energy System

Production-ready full-stack platform for managing energy projects, customer usage, billing, payments, alerts, and operational dashboards.

## Tech Stack

- Backend: Node.js + Express
- Frontend: React (Vite) + Tailwind CSS
- Database: PostgreSQL + Prisma ORM
- Auth: JWT

## Project Structure

- `backend/` - Express API, Prisma schema, seed, billing/alerts/report logic
- `src/` - React frontend (auth + dashboard + projects + usage + billing pages)

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
cp .env.example .env
npm run dev
```

### 3) Run both services together (optional)

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
- Project creation and user assignment
- Energy usage recording and monitoring
- Billing generation by usage and price-per-unit
- Partial/full payments with balance tracking
- Alerts for low production, overuse, and payment due
- Admin KPI dashboard (energy, revenue, active users, alerts)
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
