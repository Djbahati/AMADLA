# React App Refactoring & Authentication Documentation

## Overview
This document outlines the refactored React application structure, authentication system, and best practices implemented for the AMANDLA Energy Group platform.

---

## 📁 Folder Structure

```
src/
├── context/
│   └── AuthContext.jsx          # Authentication state management
├── component/
│   ├── layout/
│   │   ├── layout.jsx           # Main layout wrapper
│   │   ├── navbar.jsx           # Navigation bar
│   │   └── footer.jsx           # Footer
│   ├── energy/
│   │   ├── energyflowdiagram.jsx
│   │   ├── dataindicatorcard.jsx
│   │   └── ...
│   ├── ui/                      # Reusable UI components
│   ├── protectedroute.jsx       # Protected route wrapper
│   └── UserNotRegisteredError.jsx
├── page/
│   ├── home.jsx                 # Public home page
│   ├── about.jsx                # Public about page
│   ├── contact.jsx              # Public contact page
│   ├── partner.jsx              # Public partner page
│   ├── login.jsx                # Auth: Login page
│   ├── register.jsx             # Auth: Register page
│   ├── dashboard.jsx            # Protected: Dashboard
│   ├── energysystems.jsx        # Protected: Energy Systems
│   ├── energysupport.jsx        # Protected: Energy Support
│   └── notfound.jsx             # Error: 404 page
├── hooks/
│   └── use-mobile.jsx
├── libs/
│   ├── authcontext.jsx
│   ├── query-client.js
│   └── utils.js
├── utils/
│   └── index.ts
├── API/
│   └── client.js
├── app.jsx                      # Main app with routing
├── main.jsx                     # Entry point
└── index.css                    # Global styles
```

---

## 🔐 Authentication System

### AuthContext (src/context/AuthContext.jsx)

The authentication system uses React Context API for state management. It provides:

**Features:**
- User login/registration with mock backend
- JWT token storage in localStorage
- Automatic auth state initialization on app load
- Error handling

**Usage:**
```jsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isLoading, error, login, logout } = useAuth();
  
  // Use auth state...
}
```

**API:**
- `user` - Current authenticated user object
- `isAuthenticated` - Boolean flag for auth state
- `isLoading` - Loading state for async operations
- `error` - Error message if any
- `login(email, password)` - Login function
- `register(email, password, name)` - Register function
- `logout()` - Logout function

### Protected Routes (src/component/protectedroute.jsx)

Wraps routes that require authentication. Redirects to login if not authenticated.

**Usage:**
```jsx
<Route
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
  path="/dashboard"
/>
```

---

## 🛣️ Routing Structure

### App.jsx Organization

**1. Public Auth Routes (No Layout)**
- `/login` - Login page
- `/register` - Register page

**2. Protected Routes (With Layout)**
- `/dashboard` - Main dashboard (requires auth)
- `/energy-systems` - Energy visualization (requires auth)
- `/energy-support` - Support page (requires auth)

**3. Public Routes (With Layout)**
- `/` - Home page
- `/about` - About page
- `/contact` - Contact page
- `/partner` - Partner page

**4. Error Routes**
- `*` - 404 Not Found page

---

## 🔄 Authentication Flow

### Login Flow:
```
User enters credentials → submit form
  ↓
useAuth().login() called
  ↓
Mock backend simulation (500ms delay)
  ↓
User data + JWT token stored in localStorage
  ↓
Navigate to /dashboard
```

### Protected Route Check:
```
User tries to access /dashboard
  ↓
ProtectedRoute checks isAuthenticated
  ↓
If authenticated: render component
If not authenticated: redirect to /login
```

---

## 💾 Storage

- **localStorage keys:**
  - `user` - JSON stringified user object
  - `token` - JWT token

**User Object Structure:**
```json
{
  "id": "unique-id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
```

---

## 📝 Pages Documentation

### Public Pages
- **Home** (`src/page/home.jsx`) - Landing page with energy flow visualization
- **About** (`src/page/about.jsx`) - Company information
- **Contact** (`src/page/contact.jsx`) - Contact form
- **Partner** (`src/page/partner.jsx`) - Partnership information

### Auth Pages
- **Login** (`src/page/login.jsx`) - User login with email/password
- **Register** (`src/page/register.jsx`) - New account creation

### Protected Pages
- **Dashboard** (`src/page/dashboard.jsx`) - User dashboard
- **Energy Systems** (`src/page/energysystems.jsx`) - Energy monitoring
- **Energy Support** (`src/page/energysupport.jsx`) - Support/Help

### Error Pages
- **Not Found** (`src/page/notfound.jsx`) - 404 page

---

## 🎨 Components

### Layout Components
- **Layout** - Wrapper with Navbar and Footer
- **Navbar** - Navigation bar with links
- **Footer** - Footer component

### Protected Route
- Checks authentication status
- Shows loading spinner while checking auth
- Redirects to login if not authenticated

### Energy Components
- **EnergyFlowDiagram** - SVG animated energy flow visualization
- **DataIndicatorCard** - Status-based energy metrics display

---

## 🚀 Best Practices Implemented

### 1. **Path Aliasing**
```javascript
// Instead of: import Component from '../../../component/...'
// Use: import Component from '@/component/...'
```
Configured in `vite.config.js` for cleaner imports.

### 2. **Component Organization**
- Separate concerns (pages, components, context)
- Reusable UI components in `component/ui/`
- Page components in `page/`
- Business logic in `context/`

### 3. **Authentication Security**
- Context-based state management
- Protected routes prevent unauthorized access
- Token stored in localStorage (note: use httpOnly cookies in production)

### 4. **Error Handling**
- 404 Not Found page for invalid routes
- Auth error messages displayed to users
- Validation errors on forms

### 5. **Loading States**
- Loading spinner during auth checks
- Disabled buttons during async operations
- Proper loading UI indicators

---

## 🔧 Configuration

### Vite Config (vite.config.js)
```javascript
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

---

## 📦 Dependencies Used
- `react-router-dom` - Client-side routing
- `framer-motion` - Animations
- `lucide-react` - Icons
- `tailwindcss` - Styling

---

## 🧪 Testing the Auth Flow

1. **Start the app**: `npm run dev`
2. **Visit home page**: `http://localhost:5173/`
3. **Click Dashboard** (should redirect to login)
4. **Login with demo credentials:**
   - Email: `admin@example.com`
   - Password: any value
5. **Redirects to Dashboard** after successful login
6. **Click Logout** to clear auth and return to login

---

## 🔮 Future Enhancements

### Before Production:
- [ ] Replace mock authentication with real backend API
- [ ] Use httpOnly cookies instead of localStorage for tokens
- [ ] Implement refresh token mechanism
- [ ] Add forgot password functionality
- [ ] Add email verification
- [ ] Implement role-based access control (RBAC)
- [ ] Add 2FA support

### Features:
- [ ] User profile page
- [ ] Settings page
- [ ] Notifications system
- [ ] Activity log
- [ ] User management (admin)

---

## 📞 Support

For questions or issues with the authentication system:
1. Check the AuthContext implementation
2. Verify localStorage keys are set correctly
3. Check browser console for error messages
4. Verify routes are properly protected with ProtectedRoute

---

**Last Updated:** April 29, 2026
**Version:** 1.0.0
