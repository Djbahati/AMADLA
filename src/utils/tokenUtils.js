/**
 * JWT Token Management Utilities
 * Handles token storage, validation, and expiry detection
 */

const TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "authUser";
const TOKEN_EXPIRY_BUFFER = 60 * 1000; // Refresh token 1 minute before expiry

export const tokenUtils = {
  /**
   * Decode JWT payload without verification (frontend only)
   */
  decodeToken(token) {
    if (!token) return null;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const decoded = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
      );

      return decoded;
    } catch {
      return null;
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(token) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    // Add buffer to refresh before actual expiry
    return decoded.exp * 1000 < Date.now() + TOKEN_EXPIRY_BUFFER;
  },

  /**
   * Get time remaining until expiry (in seconds)
   */
  getTokenExpiryIn(token) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return null;

    return Math.floor((decoded.exp * 1000 - Date.now()) / 1000);
  },

  /**
   * Save tokens to localStorage
   */
  saveTokens(accessToken, refreshToken, user = null) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  /**
   * Get access token from storage
   */
  getAccessToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get refresh token from storage
   */
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Get stored user data
   */
  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Clear all tokens and user data
   */
  clearTokens() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = this.getAccessToken();
    return token && !this.isTokenExpired(token);
  },

  /**
   * Check if refresh token is available and valid
   */
  hasValidRefreshToken() {
    const refreshToken = this.getRefreshToken();
    return refreshToken && !this.isTokenExpired(refreshToken);
  },
};
