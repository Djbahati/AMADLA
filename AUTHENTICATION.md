# Enhanced JWT Authentication System

## Overview

The AMANDLA Energy Group project now features a production-grade JWT authentication system with automatic token refresh, secure token management, and comprehensive error handling.

## Architecture

### Backend

#### JWT Token Structure

**Access Token** (Short-lived - 15 minutes)
```javascript
{
  id: "user-id",
  email: "user@example.com",
  role: "USER|ADMIN|ORGANIZER",
  type: "access",
  exp: 1234567890,
  iat: 1234567800
}
```

**Refresh Token** (Long-lived - 7 days)
```javascript
{
  id: "user-id",
  type: "refresh",
  exp: 1234567890,
  iat: 1234567800
}
```

#### API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/refresh` | Refresh access token | ❌ |
| POST | `/api/auth/logout` | Logout user | ✅ |
| GET | `/api/auth/me` | Get current user | ✅ |

#### Token Utilities

**File:** `backend/src/utils/jwt.js`

```javascript
import { generateTokens, verifyAccessToken, verifyRefreshToken, isTokenExpired, getTokenExpiryIn } from "@/utils/jwt";

// Generate both tokens
const { accessToken, refreshToken } = generateTokens(user);

// Verify tokens
const payload = verifyAccessToken(token);
const refreshPayload = verifyRefreshToken(token);

// Check expiry
if (isTokenExpired(token)) {
  // Token is expired or about to expire
}
```

### Frontend

#### Token Management Utilities

**File:** `src/utils/tokenUtils.js`

```javascript
import { tokenUtils } from "@/utils/tokenUtils";

// Save tokens
tokenUtils.saveTokens(accessToken, refreshToken, user);

// Check authentication
if (tokenUtils.isAuthenticated()) {
  // User is logged in and token is valid
}

// Get token info
const expiryIn = tokenUtils.getTokenExpiryIn(token); // seconds
const isExpired = tokenUtils.isTokenExpired(token);

// Clear tokens
tokenUtils.clearTokens();
```

#### API Client with Auto-Refresh

**File:** `src/utils/apiClient.js`

```javascript
import { apiClient } from "@/utils/apiClient";

// Automatic JWT injection and token refresh
const response = await apiClient.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// Handles:
// ✅ Automatic Authorization header injection
// ✅ Token expiry detection
// ✅ Automatic refresh token refresh
// ✅ Retry failed requests with new token
// ✅ Redirect to login on session expiry
```

#### AuthContext

**File:** `src/context/AuthContext.jsx`

```javascript
import { useAuth } from "@/context/AuthContext";

export function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <p>Welcome, {user.fullName}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Flow Diagrams

### Login Flow

```
1. User submits email + password
2. Frontend: POST /api/auth/login
3. Backend: Validate credentials
4. Backend: Generate accessToken + refreshToken
5. Frontend: Save tokens + user to localStorage
6. Frontend: Redirect to dashboard
```

### Token Refresh Flow

```
1. API request fails with 401 (Unauthorized)
2. Frontend: Detect token expiry
3. Frontend: POST /api/auth/refresh with refreshToken
4. Backend: Validate refreshToken
5. Backend: Generate new accessToken + refreshToken
6. Frontend: Update stored tokens
7. Frontend: Retry original request with new token
8. Success! ✅
```

### Logout Flow

```
1. User clicks logout
2. Frontend: POST /api/auth/logout (with token)
3. Backend: Add token to blacklist (Redis in production)
4. Frontend: Clear localStorage tokens + user
5. Frontend: Redirect to login page
```

## Configuration

### Environment Variables

**Backend (.env)**
```bash
JWT_SECRET=your-super-secret-key-min-32-chars
REFRESH_TOKEN_SECRET=different-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**
```bash
VITE_API_URL=http://localhost:5000/api
```

## Security Features

✅ **Separate Access & Refresh Tokens**
- Access token: Short-lived (15 minutes)
- Refresh token: Long-lived (7 days)
- Reduces exposure window if token is compromised

✅ **Automatic Token Rotation**
- New tokens generated on every refresh
- Old tokens become invalid

✅ **Token Expiry Buffer**
- Frontend proactively refreshes token 1 minute before expiry
- Prevents "expired token" errors during user interaction

✅ **Secure Token Storage**
- Tokens stored in localStorage
- Sensitive operations use Authorization header
- SSR-compatible (works in Node.js and browser)

✅ **XSS Protection**
- No sensitive data in cookies (vulnerable to JS injection)
- Use HTTPOnly cookies in production (via backend)

✅ **CSRF Protection**
- Token sent in header (not in body/cookie)
- Prevents cross-site token theft

✅ **Token Validation**
- Backend validates token signature
- Verifies token expiry
- Checks user still exists and is active
- Cross-checks refresh token validity

## Testing

### Manual Testing

```bash
# 1. Start backend
npm run dev:backend

# 2. Start frontend
npm run dev:frontend

# 3. Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Response:
# {
#   "data": {
#     "accessToken": "eyJ...",
#     "refreshToken": "eyJ...",
#     "user": { "id": "...", "email": "...", "role": "..." }
#   }
# }

# 4. Test refresh
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJ..."
  }'

# 5. Test protected endpoint
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJ..."
```

## Production Deployment

### Recommended Changes

1. **Use Redis for Token Blacklist**
   ```javascript
   // Instead of in-memory Set
   import redis from 'redis';
   const redisClient = redis.createClient();
   
   // Store logout tokens in Redis with expiry
   await redisClient.setex(`blacklist:${token}`, expiryIn, 'true');
   ```

2. **HTTPOnly Cookies**
   ```javascript
   // Store refresh token in HTTPOnly cookie
   res.cookie('refreshToken', refreshToken, {
     httpOnly: true,
     secure: true, // HTTPS only
     sameSite: 'strict',
     maxAge: 7 * 24 * 60 * 60 * 1000
   });
   ```

3. **Rotate Secrets**
   ```bash
   # Generate strong secrets
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Enable HTTPS**
   - Use SSL/TLS certificate
   - Redirect HTTP → HTTPS
   - Set secure cookie flags

5. **Rate Limiting**
   - Already configured in backend
   - Prevents brute force attacks
   - Adjust `RATE_LIMIT_MAX` as needed

6. **Monitoring**
   - Log failed login attempts
   - Alert on token refresh failures
   - Track logout events

## Troubleshooting

### Token Refresh Fails

**Symptom:** User gets logged out unexpectedly

**Solutions:**
1. Check `REFRESH_TOKEN_SECRET` matches backend/frontend
2. Verify refresh token hasn't expired (7 days max)
3. Ensure backend Redis/database is accessible
4. Check network connectivity

### "Invalid Credentials" on Login

**Solutions:**
1. Verify user exists in database
2. Verify password hash is correct
3. Ensure account is active (`isActive: true`)
4. Check email is case-insensitive

### Tokens Stored But User Not Authenticated

**Solutions:**
1. Check token hasn't expired
2. Verify `JWT_SECRET` matches backend
3. Ensure user record exists and is active
4. Clear localStorage and login again

## Next Steps

- [ ] Add email verification for registration
- [ ] Implement password reset flow
- [ ] Add role-based access control (RBAC)
- [ ] Setup Redis for production token blacklist
- [ ] Implement OAuth2 (Google, GitHub login)
- [ ] Add two-factor authentication (2FA)
- [ ] Setup token rotation strategy

## Support

For issues or questions:
1. Check this documentation
2. Review backend logs: `npm run dev:backend`
3. Check frontend console errors
4. Verify environment variables are set correctly
