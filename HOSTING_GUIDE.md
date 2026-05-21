# AMANDLA Energy - Hosting & Deployment Guide

## Project Status
✅ **READY FOR PRODUCTION HOSTING**

- Frontend: Vite React SPA (optimized build available)
- Backend: Express.js API with JWT auth
- Database: SQLite (dev/small-scale) or PostgreSQL (production)
- All dependencies installed and tested
- Default seeded accounts available for testing

---

## Development Environment (Local)

### Prerequisites
- Node.js 18+ 
- npm 9+

### Quick Start
```bash
# Terminal 1: Install all dependencies
npm install
cd backend && npm install && cd ..

# Terminal 2: Start both frontend and backend
npm run dev:all
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Default accounts (see DEPLOYMENT.md)

---

## Production Deployment Options

### Option 1: Railway (Recommended - Easiest)

**Why Railway?**
- Free tier with decent limits
- One-click deployment from GitHub
- Automatic HTTPS
- Environment variables managed in dashboard
- PostgreSQL add-on available

**Steps:**
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project → "Deploy from GitHub"
4. Select your AMANDLA repository
5. Add two services:

   **Service 1: Backend**
   - Root directory: `backend`
   - Start command: `npm start`
   - Environment variables (from `.env.production`):
     ```
     NODE_ENV=production
     PORT=8000
     DATABASE_URL=<railway-postgres-url>
     JWT_SECRET=<generate-strong-secret>
     REFRESH_TOKEN_SECRET=<generate-strong-secret>
     FRONTEND_URL=https://<your-domain>
     ```
   - Run migration after deploy: `railway run npm run prisma:migrate`

   **Service 2: Frontend**
   - Root directory: `/`
   - Build command: `npm run build`
   - Start command: `npm i -g serve && serve -s dist -p $PORT`
   - Environment variables:
     ```
     VITE_API_URL=https://<backend-domain>/api
     ```

6. Configure domains and test

---

### Option 2: Render.com (VPS Alternative)

**Steps:**
1. Push to GitHub
2. Go to [render.com](https://render.com)
3. New Web Service → Connect GitHub repo
4. **Backend Service:**
   - Name: `amandla-backend`
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment from `.env.production`

5. **Frontend Service:**
   - New Static Site → Connect GitHub
   - Root directory: `/`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`

6. Link services and deploy

---

### Option 3: Self-Hosted VPS (Ubuntu 20.04+)

**Prerequisites:**
- VPS with Ubuntu 20.04+
- SSH access
- Domain name pointing to VPS IP
- SSL certificate (free with Let's Encrypt)

**Setup Steps:**

```bash
# 1. Update system
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PostgreSQL (recommended)
sudo apt-get install -y postgresql postgresql-contrib
sudo -u postgres createdb amandla_prod
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'strong-password';"

# 4. Clone and setup
git clone https://github.com/Djbahati/AMADLA.git
cd AMADLA

# 5. Install dependencies
npm install
cd backend && npm install && cd ..

# 6. Configure environment
cp backend/.env.production backend/.env
# Edit backend/.env with production values

# 7. Setup database
cd backend
npm run prisma:migrate
npm run prisma:seed
cd ..

# 8. Build frontend
npm run build

# 9. Install PM2 for process management
sudo npm install -g pm2

# 10. Start backend with PM2
cd backend
pm2 start "npm start" --name "amandla-backend"
pm2 save
pm2 startup

# 11. Install and configure Nginx
sudo apt-get install -y nginx

# Create Nginx config (replace YOUR_DOMAIN)
sudo tee /etc/nginx/sites-available/amandla > /dev/null <<EOF
upstream backend {
    server localhost:5000;
}

server {
    listen 80;
    server_name YOUR_DOMAIN;
    
    # Redirect to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name YOUR_DOMAIN;
    
    ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Frontend (static files)
    location / {
        root /home/ubuntu/AMADLA/dist;
        try_files \$uri \$uri/ /index.html;
    }
    
    # Backend API proxy
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_http_version 1.1;
    }
}
EOF

# 12. Enable site and test
sudo ln -s /etc/nginx/sites-available/amandla /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 13. Setup SSL with Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d YOUR_DOMAIN
```

**Verify Deployment:**
```bash
# Test health
curl https://YOUR_DOMAIN/api/health

# Test login
curl -X POST https://YOUR_DOMAIN/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@amadla.energy","password":"Password123!"}'
```

---

## Database Considerations

### SQLite (Development/Small Scale)
- ✅ No external dependencies
- ✅ Perfect for prototypes and small deployments
- ❌ Not suitable for high concurrency
- Location: `backend/prisma/dev.db` or `backend/prisma/prod.db`

### PostgreSQL (Production)
- ✅ Scales to millions of users
- ✅ Better concurrency handling
- ✅ Advanced features (JSON, full-text search)
- ✅ Automatic backups (on managed hosting)
- ⚠️ Requires external service or VPS setup

**Switch to PostgreSQL:**
1. Update `.env`: `DATABASE_URL=postgresql://user:pass@host:5432/amandla`
2. Update `backend/prisma/schema.prisma`: Change `provider = "sqlite"` to `provider = "postgresql"`
3. Run: `npm run prisma:migrate`

---

## Environment Variables Reference

### Frontend (`.env.production`)
```env
VITE_API_URL=https://api.your-domain.com/api
```

### Backend (`.env.production`)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...  # or file:./prisma/prod.db
JWT_SECRET=<64-char-random-string>
REFRESH_TOKEN_SECRET=<64-char-random-string>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=https://your-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

**Generate secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Testing the Deployment

### Health Check
```bash
curl https://your-domain.com/api/health
# Expected: {"status":"ok"}
```

### Test Authentication
```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@amadla.energy",
    "password":"Password123!"
  }'
# Expected: JWT tokens and user data
```

### Test with Token
```bash
# Replace TOKEN with the accessToken from login response
curl https://your-domain.com/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## Monitoring & Maintenance

### Logs
- **Backend**: Check PM2 logs: `pm2 logs amandla-backend`
- **Frontend**: Check browser console and network tab
- **Nginx**: `/var/log/nginx/error.log` and `access.log`

### Database Backups
- **PostgreSQL**: Use hosted provider's backup feature or `pg_dump`
- **SQLite**: Regularly backup `prisma/prod.db` file

### Updates
```bash
# Backend only update
cd backend && npm update && npm run prisma:migrate && pm2 restart amandla-backend

# Full stack update
npm update && npm run build && npm run dev:all
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized on API calls | Check `VITE_API_URL` and `FRONTEND_URL` match |
| CORS errors | Update `FRONTEND_URL` in backend `.env` |
| Database locked (SQLite) | Switch to PostgreSQL for production |
| High memory usage | Reduce `RATE_LIMIT_MAX` or upgrade VPS |
| Slow API responses | Add database indexes; check query performance |
| SSL certificate errors | Renew with `certbot renew`; check expiry with `certbot certificates` |

---

## Security Checklist

- [ ] JWT secrets are strong (32+ characters, truly random)
- [ ] `.env.production` is NOT in version control
- [ ] Database credentials are strong
- [ ] HTTPS/SSL enabled on all endpoints
- [ ] CORS `FRONTEND_URL` is correct domain
- [ ] Rate limiting enabled (`RATE_LIMIT_MAX` set appropriately)
- [ ] Default test accounts changed or disabled in production
- [ ] Database backups scheduled
- [ ] Error logs monitored for suspicious activity
- [ ] Security headers in place (via Nginx config)

---

## Support & Resources

- **Repository**: https://github.com/Djbahati/AMADLA
- **Issues**: Open an issue in the GitHub repo
- **Documentation**: See `README.md`, `DEPLOYMENT.md`, `AUTHENTICATION.md`

---

**Status**: ✅ Production Ready
**Last Updated**: May 2026
