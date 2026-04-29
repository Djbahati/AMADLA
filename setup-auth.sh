#!/bin/bash
# Setup Enhanced Authentication System

echo "🔐 Setting up Enhanced JWT Authentication System..."
echo ""

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npm --prefix backend run prisma:generate

# Frontend setup
echo "📦 Installing frontend dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To run the project:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  npm run dev"
echo ""
echo "📍 Access the application at: http://localhost:5173"
echo ""
echo "📋 Configuration files:"
echo "  - Backend: backend/.env"
echo "  - Frontend: .env"
echo "  - Documentation: AUTHENTICATION.md"
echo ""
echo "🔐 Environment Variables to Update:"
echo "  JWT_SECRET: Change to a strong random string (32+ chars)"
echo "  REFRESH_TOKEN_SECRET: Change to a different strong random string (32+ chars)"
