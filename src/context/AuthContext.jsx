import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/utils/apiClient';
import { tokenUtils } from '@/utils/tokenUtils';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedUser = tokenUtils.getUser();
    const token = tokenUtils.getAccessToken();

    if (storedUser && token && !tokenUtils.isTokenExpired(token)) {
      setUser(storedUser);
    } else if (token && tokenUtils.isTokenExpired(token)) {
      // Token expired, try to refresh
      refreshUserSession();
    } else {
      // No valid token, clear storage
      tokenUtils.clearTokens();
    }

    setIsLoading(false);
  }, []);

  // Refresh user session using refresh token
  const refreshUserSession = useCallback(async () => {
    try {
      if (!tokenUtils.hasValidRefreshToken()) {
        tokenUtils.clearTokens();
        return false;
      }

      const response = await apiClient.post('/auth/refresh', {
        refreshToken: tokenUtils.getRefreshToken(),
      });

      if (response.data) {
        tokenUtils.saveTokens(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );
        setUser(response.data.user);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Failed to refresh session:', err);
      tokenUtils.clearTokens();
      return false;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      if (response.data) {
        tokenUtils.saveTokens(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }

      throw new Error('Invalid response format');
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (fullName, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/auth/register', {
        fullName,
        email,
        password,
      });

      if (response.data) {
        tokenUtils.saveTokens(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }

      throw new Error('Invalid response format');
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint to invalidate token on backend
      await apiClient.post('/auth/logout', {});
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      // Clear tokens and user state regardless of API response
      tokenUtils.clearTokens();
      setUser(null);
      setError(null);
    }
  }, []);

  const isAuthenticated = !!user && tokenUtils.isAuthenticated();

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUserSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
