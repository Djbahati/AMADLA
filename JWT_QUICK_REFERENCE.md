# 🔐 Enhanced JWT Authentication - Quick Reference

## What Was Enhanced?

### ✅ Backend Improvements
- **JWT Token Generation**: Separate short-lived access tokens (15m) and long-lived refresh tokens (7d)
- **Token Refresh Endpoint**: `POST /api/auth/refresh` - Auto-refresh expired tokens
- **Logout Endpoint**: `POST /api/auth/logout` - Invalidate tokens on logout
- **JWT Utilities**: Helper functions for token validation, expiry checking, and decoding
- **Token Blacklist**: In-memory blacklist for logged-out tokens (Redis recommended for production)

### ✅ Frontend Improvements
- **Real API Integration**: Replaced mock authentication with actual backend API calls
- **Token Utils**: `tokenUtils` - Secure token storage, validation, and management
- **API Client**: `apiClient` - Automatic JWT injection, token refresh, and error handling
- **Enhanced AuthContext**: Full JWT lifecycle management
- **Auto-Refresh**: Automatic token refresh before expiry (1-minute buffer)

### ✅ Security Features
- ✅ Token signature verification
- ✅ Expiry detection and auto-refresh
- ✅ User validation (account active check)
- ✅ Secure token storage
- ✅ Authorization header injection
- ✅ Session expiry handling

---

## File Structure

```
New Files Created:
├── backend/src/utils/jwt.js                 # JWT utilities
├── backend/src/middleware/refreshToken.js   # Refresh endpoint
├── backend/src/middleware/logout.js         # Logout logic
├── src/utils/tokenUtils.js                  # Frontend token management
├── src/utils/apiClient.js                   # API client with auto-refresh
├── AUTHENTICATION.md                         # Full documentation
└── setup-auth.sh                            # Setup script

Modified Files:
├── backend/src/controllers/auth.controller.js   # Updated to use new JWT system
├── backend/src/routes/auth.routes.js            # Added refresh & logout routes
├── backend/.env                                 # Added REFRESH_TOKEN_SECRET
├── backend/.env.example                         # Updated documentation
├── src/context/AuthContext.jsx                  # Full API integration
└── .env (frontend)                              # API URL configured
```

---

## API Endpoints (Updated)

```
POST   /api/auth/register
  Request:  { fullName, email, password }
  Response: { accessToken, refreshToken, user }

POST   /api/auth/login
  Request:  { email, password }
  Response: { accessToken, refreshToken, user }

POST   /api/auth/refresh
  Request:  { refreshToken }
  Response: { accessToken, refreshToken, user }
  
POST   /api/auth/logout
  Headers:  { Authorization: Bearer <token> }
  Response: { success: true }

GET    /api/auth/me
  Headers:  { Authorization: Bearer <token> }
  Response: { user data }
```

---

## Usage Examples

### Login
```javascript
import { useAuth } from '@/context/AuthContext';

export function LoginPage() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      // Automatically redirected & stored
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin(email, password);
    }}>
      {error && <div className="error">{error}</div>}
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button disabled={isLoading}>{isLoading ? 'Loading...' : 'Login'}</button>
    </form>
  );
}
```

### Protected Route
```javascript
import { useAuth } from '@/context/AuthContext';

export function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authorized</div>;

  return <div>Welcome, {user.fullName}!</div>;
}
```

### API Call with Auto-Refresh
```javascript
import { apiClient } from '@/utils/apiClient';

async function fetchUserData() {
  try {
    // Token is automatically injected & refreshed if needed
    const response = await apiClient.get('/users/profile');
    console.log(response.data);
  } catch (error) {
    console.error('Request failed:', error);
  }
}
```

### Manual Token Management
```javascript
import { tokenUtils } from '@/utils/tokenUtils';

// Check if authenticated
if (tokenUtils.isAuthenticated()) {
  const expiryIn = tokenUtils.getTokenExpiryIn(token);
  console.log(`Token expires in ${expiryIn} seconds`);
}

// Get user data
const user = tokenUtils.getUser();

// Manual logout
tokenUtils.clearTokens();
```

---

## Testing the System

### 1. Start Services
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 2. Test Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 4. Test Protected Endpoint
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

### 5. Test Token Refresh
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<YOUR_REFRESH_TOKEN>"
  }'
```

---

## Configuration

### Backend (.env)
```env
JWT_SECRET=change-this-to-a-strong-random-string
REFRESH_TOKEN_SECRET=change-this-to-another-strong-random-string
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Token Flow Explained

```
┌─────────────┐                      ┌─────────────┐
│   Frontend  │                      │   Backend   │
└──────┬──────┘                      └──────┬──────┘
       │                                    │
       │ 1. Login request (email, pwd)     │
       │──────────────────────────────────>│
       │                                    │ Validate credentials
       │                                    │ Generate tokens
       │ 2. Access + Refresh tokens        │
       │<──────────────────────────────────│
       │                                    │
       │ 3. Save tokens to localStorage    │
       │ (Inject access token in headers)  │
       │                                    │
       │ 4. API request with token         │
       │──────────────────────────────────>│
       │                                    │ Validate token
       │ 5. Response (success)              │
       │<──────────────────────────────────│
       │                                    │
       │ (Later: Token expires)            │
       │                                    │
       │ 6. API request with old token     │
       │──────────────────────────────────>│
       │                                    │ 401 Unauthorized
       │ 7. 401 response                   │
       │<──────────────────────────────────│
       │                                    │
       │ 8. Refresh request (refresh_token)│
       │──────────────────────────────────>│
       │                                    │ Validate refresh token
       │                                    │ Generate new tokens
       │ 9. New tokens                     │
       │<──────────────────────────────────│
       │                                    │
       │ 10. Update stored tokens          │
       │                                    │
       │ 11. Retry original request        │
       │──────────────────────────────────>│
       │                                    │
       │ 12. Success!                      │
       │<──────────────────────────────────│
```

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Invalid credentials" | Wrong password or user doesn't exist | Verify email/password, check database |
| "Invalid token" | Token expired or malformed | Clear localStorage, login again |
| "Unauthorized on /api/me" | Missing Authorization header | Check apiClient is injecting header |
| CORS errors | Frontend calling wrong API URL | Verify `VITE_API_URL` in .env |
| "Token refresh failed" | Invalid refresh token or expired | Login again to get new tokens |

---

## Next Steps

1. ✅ Test the authentication system
2. ✅ Update `JWT_SECRET` and `REFRESH_TOKEN_SECRET` in production
3. ✅ Enable HTTPS in production
4. ⏳ Add email verification
5. ⏳ Implement OAuth2 (Google, GitHub)
6. ⏳ Add two-factor authentication
7. ⏳ Setup Redis for token blacklist

---

## Support

For full documentation, see: [AUTHENTICATION.md](./AUTHENTICATION.md)

For issues:
1. Check browser console for errors
2. Check backend logs: `npm run dev:backend`
3. Verify tokens in localStorage (DevTools → Application → LocalStorage)
4. Verify environment variables are set
