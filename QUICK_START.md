# AMANDLA Energy - Quick Start Guide

## Development (5 minutes)

```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..

# 2. Start both frontend and backend
npm run dev:all

# 3. Open browser and login
# Frontend: http://localhost:5173
# Default credentials: admin@amadla.energy / Password123!
```

**What's Running:**
- Frontend: Vite dev server with HMR (hot reload)
- Backend: Express API with nodemon auto-restart
- Database: SQLite (auto-created)

---

## Production (Choose One)

### 🚀 Railway (Easiest - Recommended)
1. Push to GitHub
2. Login to [railway.app](https://railway.app)
3. Import project from GitHub
4. Add services: Backend (start: `npm start`) + Frontend (build + serve)
5. Set environment variables from `.env.production`
6. Run migrations: `railway run npm run prisma:migrate`
7. Done! Your app is live

### 🖥️ VPS (Ubuntu)
```bash
# See full guide in HOSTING_GUIDE.md
# Quick commands:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt install -y nodejs postgresql nginx

git clone https://github.com/Djbahati/AMADLA.git && cd AMADLA
npm install && cd backend && npm install && cd ..

npm run build
cd backend && npm run prisma:migrate && npm start &
cd ..

# Configure Nginx and SSL, then done!
```

### Docker (Advanced)
```bash
# Build and run with Docker
docker-compose up -d
```

---

## Default Test Accounts

| Role     | Email                  | Password    |
|----------|------------------------|-------------|
| Admin    | admin@amadla.energy    | Password123! |
| Operator | operator@amadla.energy | Password123! |
| User     | customer@amadla.energy | Password123! |

---

## Key Commands

```bash
# Development
npm run dev              # Frontend only
npm run dev:backend      # Backend only
npm run dev:all          # Both together

# Production Build
npm run build            # Build frontend for production

# Linting & Type Checking
npm run lint             # Check code style
npm run lint:fix         # Auto-fix issues
npm run typecheck        # TypeScript validation

# Backend Database
cd backend
npm run prisma:migrate   # Apply database migrations
npm run prisma:seed      # Seed test data
npm run prisma:generate  # Regenerate Prisma client
```

---

## Verification Checklist

- [ ] Frontend loads at http://localhost:5173
- [ ] Can login with admin credentials
- [ ] Dashboard displays data
- [ ] API health check: `curl http://localhost:5000/api/health`
- [ ] Backend console shows "running on port 5000"

---

## Troubleshooting

**Port already in use?**
```bash
# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or change PORT in backend/.env
```

**Database issues?**
```bash
# Reset database (WARNING: deletes all data)
cd backend
rm prisma/dev.db
npm run prisma:migrate
npm run prisma:seed
```

**CORS errors?**
```bash
# Update FRONTEND_URL in backend/.env to match your domain
FRONTEND_URL=http://localhost:5173  # for dev
FRONTEND_URL=https://your-domain.com  # for production
```

---

## Next Steps

1. **Customize**: Update branding, colors, and domain
2. **Configure**: Add real JWT secrets, set proper database
3. **Deploy**: Choose hosting option and follow steps
4. **Monitor**: Set up logging and alerts
5. **Backup**: Configure database backups

---

See full documentation in:
- `README.md` - Project overview
- `DEPLOYMENT.md` - Detailed deployment guide
- `HOSTING_GUIDE.md` - Complete hosting instructions
- `ARCHITECTURE.md` - System architecture
- `AUTHENTICATION.md` - Auth system details
