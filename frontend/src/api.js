export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("leadsathi_token");
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem("leadsathi_token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Auth
export const auth = {
  login: (email, password) => api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (data) => api("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  me: () => api("/auth/me"),
};

// Leads
export const leads = {
  list: (params = {}) => {
    const sp = new URLSearchParams(params).toString();
    return api(`/leads${sp ? `?${sp}` : ""}`);
  },
  get: (id) => api(`/leads/${id}`),
  create: (data) => api("/leads", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => api(`/leads/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id) => api(`/leads/${id}`, { method: "DELETE" }),
};

// Follow-ups
export const followUps = {
  list: (params = {}) => {
    const sp = new URLSearchParams(params).toString();
    return api(`/follow-ups${sp ? `?${sp}` : ""}`);
  },
  dueToday: () => api("/follow-ups/due-today"),
  create: (data) => api("/follow-ups", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => api(`/follow-ups/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id) => api(`/follow-ups/${id}`, { method: "DELETE" }),
};

// Dashboard
export const dashboard = {
  stats: () => api("/dashboard/stats"),
};

// WhatsApp helper: open wa.me with pre-filled text
export function whatsappUrl(phone, message = "") {
  const p = phone.replace(/\D/g, "");
  const num = p.length === 10 ? `91${p}` : p.startsWith("91") ? p : `91${p}`;
  const text = message ? `&text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${num}${text}`;
}
