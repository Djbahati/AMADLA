import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("amandla_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api.me()
      .then(setUser)
      .catch(() => localStorage.removeItem("amandla_token"))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      async login(credentials) {
        const data = await api.login(credentials);
        localStorage.setItem("amandla_token", data.token);
        setUser(data.user);
      },
      async register(payload) {
        const data = await api.register(payload);
        localStorage.setItem("amandla_token", data.token);
        setUser(data.user);
      },
      logout() {
        localStorage.removeItem("amandla_token");
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
