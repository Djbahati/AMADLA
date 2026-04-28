const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("amandla_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Request failed");
  }

  return data.data;
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me"),
  dashboard: () => request("/dashboard"),
  projects: () => request("/projects"),
  createProject: (payload) => request("/projects", { method: "POST", body: JSON.stringify(payload) }),
  assignUser: (projectId, payload) =>
    request(`/projects/${projectId}/assign`, { method: "POST", body: JSON.stringify(payload) }),
  usage: () => request("/usage"),
  recordUsage: (payload) => request("/usage", { method: "POST", body: JSON.stringify(payload) }),
  bills: () => request("/billing/bills"),
  generateBill: (payload) => request("/billing/bills", { method: "POST", body: JSON.stringify(payload) }),
  payBill: (payload) => request("/billing/payments", { method: "POST", body: JSON.stringify(payload) }),
  payments: () => request("/billing/payments"),
  alerts: () => request("/alerts"),
};
