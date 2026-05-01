/**
 * API Client with JWT Token Management
 * Handles automatic token injection, refresh, and error handling
 */

import { tokenUtils } from "./tokenUtils";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.refreshPromise = null;
  }

  /**
   * Build request headers with JWT token
   */
  getHeaders(customHeaders = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    const token = tokenUtils.getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken() {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = tokenUtils.getRefreshToken();

        if (!refreshToken || tokenUtils.isTokenExpired(refreshToken)) {
          throw new Error("No valid refresh token");
        }

        const response = await fetch(`${this.baseURL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          throw new Error("Failed to refresh token");
        }

        const data = await response.json();

        if (data.data) {
          tokenUtils.saveTokens(
            data.data.accessToken,
            data.data.refreshToken,
            data.data.user
          );

          return data.data.accessToken;
        }

        throw new Error("Invalid refresh response");
      } catch (error) {
        // Clear tokens on refresh failure
        tokenUtils.clearTokens();
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Make an API request with automatic token refresh
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(options.headers);

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle token expiry (401 error)
    if (response.status === 401) {
      try {
        // Try to refresh token
        const newToken = await this.refreshAccessToken();
        headers.Authorization = `Bearer ${newToken}`;

        // Retry original request
        response = await fetch(url, {
          ...options,
          headers,
        });
      } catch (error) {
        console.error("Token refresh failed:", error);
        tokenUtils.clearTokens();
        // Redirect to login if needed
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return data;
  }

  /**
   * GET request
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  /**
   * PATCH request
   */
  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new APIClient();
