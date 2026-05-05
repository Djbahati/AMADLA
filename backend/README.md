# Amadla Energy System Backend

## Setup

1. Copy env file:
   - `cp .env.example .env`
2. Install dependencies:
   - `npm install`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migrations:
   - `npm run prisma:migrate`
5. Seed database:
   - `npm run prisma:seed`
6. Start dev server:
   - `npm run dev`

## API Overview

- `POST /api/auth/register` - register customer account
- `POST /api/auth/login` - login and receive JWT
- `GET /api/auth/me` - get authenticated profile
- `GET /api/projects/public` - list active projects for public browsing
- `GET/POST /api/projects` - list/create projects (authenticated)
- `POST /api/projects/:projectId/assign` - assign user to project
- `POST /api/quote/recommend` - quote recommendation based on usage
- `POST /api/contact` - submit a contact request
- `GET/POST /api/usage` - list/record usage
- `GET/POST /api/billing/bills` - list/generate bills
- `GET/POST /api/billing/payments` - payment history/pay bill (partial supported)
- `GET /api/dashboard` - admin/operator KPI dashboard
- `GET /api/alerts` - list alerts
- `PATCH /api/alerts/:id/resolve` - resolve alert
- `GET /api/reports/usage.csv` - export usage report (CSV)
- `GET /api/reports/revenue.pdf` - export revenue report (PDF)
- `POST /api/graphql` - GraphQL query endpoint for projects

## Security

- JWT authentication
- Role-based authorization (ADMIN, OPERATOR, USER)
- Input validation (Zod)
- API rate limiting (`express-rate-limit`)
- HTTP hardening (`helmet`)
- Request logging (`morgan`)
