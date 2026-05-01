# Amadla Energy — Deployment Guide

## Local Development

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Backend setup
```bash
cd backend
npm install
cp .env.example .env        # already configured for SQLite
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev                  # runs on http://localhost:5000
```

### 2. Frontend setup
```bash
cd ..                        # back to project root
npm install
cp .env.example .env         # VITE_API_URL=http://localhost:5000/api
npm run dev                  # runs on http://localhost:5173
```

### 3. Run both together
```bash
npm run dev:all
```

### Default accounts
| Role     | Email                      | Password     |
|----------|----------------------------|--------------|
| Admin    | admin@amadla.energy        | Password123! |
| Operator | operator@amadla.energy     | Password123! |
| User     | customer@amadla.energy     | Password123! |

---

## API Endpoints

| Method | Path                        | Auth     | Description              |
|--------|-----------------------------|----------|--------------------------|
| POST   | /api/auth/register          | Public   | Register new user        |
| POST   | /api/auth/login             | Public   | Login, get JWT tokens    |
| POST   | /api/auth/refresh           | Public   | Refresh access token     |
| POST   | /api/auth/logout            | Bearer   | Logout (blacklist token) |
| GET    | /api/auth/me                | Bearer   | Get current user         |
| GET    | /api/dashboard/summary      | Admin    | KPIs + alerts            |
| GET    | /api/projects               | Bearer   | List projects            |
| POST   | /api/projects               | Admin    | Create project           |
| POST   | /api/projects/:id/assign    | Admin    | Assign user to project   |
| GET    | /api/usage                  | Bearer   | List energy usage        |
| POST   | /api/usage                  | Bearer   | Record usage             |
| GET    | /api/billing                | Bearer   | List bills               |
| POST   | /api/billing/generate       | Admin    | Generate bill            |
| POST   | /api/billing/pay            | Bearer   | Make payment             |
| GET    | /api/billing/payments       | Bearer   | Payment history          |
| GET    | /api/alerts                 | Bearer   | List alerts              |
| PATCH  | /api/alerts/:id/resolve     | Admin    | Resolve alert            |
| GET    | /api/reports/csv            | Admin    | Export CSV report        |
| GET    | /api/reports/pdf            | Admin    | Export PDF report        |
| GET    | /api/health                 | Public   | Health check             |

---

## Testing

### Manual API testing with curl
```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@amadla.energy","password":"Password123!"}'

# Use the returned accessToken for authenticated requests
curl http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer <accessToken>"
```

### Frontend smoke test checklist
- [ ] Login with each role (Admin, Operator, User)
- [ ] Dashboard loads stats and charts
- [ ] Navbar links all resolve correctly
- [ ] Dark mode toggle works
- [ ] Logout clears session and redirects to /login
- [ ] Protected routes redirect unauthenticated users to /login
- [ ] Energy Support AI responds to questions
- [ ] Mobile menu opens/closes correctly

---

## Production Deployment

### Environment variables (production)
```env
# backend/.env
NODE_ENV=production
PORT=5000
DATABASE_URL=file:./prisma/prod.db
JWT_SECRET=<strong-random-64-char-secret>
REFRESH_TOKEN_SECRET=<different-strong-random-64-char-secret>
JWT_EXPIRES_IN=15m
FRONTEND_URL=https://your-domain.com
RATE_LIMIT_MAX=100

# .env (frontend)
VITE_API_URL=https://api.your-domain.com/api
```

### Option A — Railway (recommended, free tier)
1. Push to GitHub
2. Create Railway project → "Deploy from GitHub"
3. Add backend service: root dir = `backend`, start = `npm start`
4. Add frontend service: root dir = `/`, build = `npm run build`, serve `dist/`
5. Set environment variables in Railway dashboard
6. Run migrations: `railway run npm run prisma:migrate`

### Option B — Render
1. Backend: New Web Service → root = `backend`, build = `npm install`, start = `npm start`
2. Frontend: New Static Site → build = `npm run build`, publish = `dist`
3. Set env vars in Render dashboard

### Option C — VPS (Ubuntu)
```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/Djbahati/AMADLA.git
cd AMADLA

# Backend
cd backend && npm install
cp .env.example .env  # edit with production values
npm run prisma:migrate
npm run prisma:seed
npm start &

# Frontend build
cd ..
npm install
npm run build
# Serve dist/ with nginx or serve package
npx serve dist -p 3000
```

### Nginx config (VPS)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/AMADLA/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Common Issues

| Issue | Fix |
|-------|-----|
| `Missing required env: DATABASE_URL` | Copy `.env.example` to `.env` in `backend/` |
| `Cannot find module prelude-ls` | Run `npm install` in root — old dependency removed |
| `401 Unauthorized` on all requests | Check `VITE_API_URL` matches backend port |
| Charts not loading | Backend must be running; frontend falls back to mock data |
| `CORS error` | Set `FRONTEND_URL` in backend `.env` to match frontend origin |
