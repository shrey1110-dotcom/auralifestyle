// src/lib/api.js
// Single place for API calls used by both shop and admin.

const BASE = import.meta.env.VITE_API_BASE || "/api";

// --- token helpers (used internally) ---
let authToken = null;
export function setAuthToken(token) {
  authToken = token || null;
  try {
    if (token) localStorage.setItem("auth_token", token);
    else localStorage.removeItem("auth_token");
  } catch {}
}
export function getAuthToken() {
  if (authToken) return authToken;
  try {
    const t = localStorage.getItem("auth_token");
    authToken = t || null;
  } catch {}
  return authToken;
}

// --- base fetch wrapper ---
// note: keep this internal but also export a public alias `apiFetch` for older imports
async function req(path, { method = "GET", json, headers, raw } = {}) {
  const h = { ...(headers || {}) };
  const token = getAuthToken();
  if (token) h.Authorization = `Bearer ${token}`;

  let body;
  if (json !== undefined) {
    h["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  }

  const res = await fetch(`${BASE}${path}`, { method, headers: h, body, credentials: "include" });
  if (!res.ok) {
    let m = `${res.status}`;
    try {
      const e = await res.json();
      throw Object.assign(new Error(e.message || m), { status: res.status, payload: e });
    } catch {
      throw new Error(`HTTP ${res.status}`);
    }
  }
  return raw ? res : res.json();
}

/* ---------- Public alias for backward compatibility ---------- */
/**
 * apiFetch(path, opts)
 * - Backwards-compatible wrapper used by some files that import `apiFetch`.
 * - opts: same as internal req — { method, json, headers, raw }
 */
export function apiFetch(path, opts = {}) {
  return req(path, opts);
}

/* -------------------- AUTH -------------------- */
export const authApi = {
  async requestOtp(email) {
    return req(`/auth/request-otp`, { method: "POST", json: { email } });
  },
  async verifyOtp({ email, otp, name, phone }) {
    const data = await req(`/auth/verify-otp`, {
      method: "POST",
      json: { email, otp, name, phone },
    });
    // store token for subsequent calls
    if (data?.token) setAuthToken(data.token);
    return data;
  },
  async me() {
    return req(`/auth/me`);
  },
  async logout() {
    setAuthToken(null);
    return { success: true };
  },
};

/* -------------------- PRODUCTS -------------------- */
export const productsApi = {
  // list with query: { q, tag, category, limit, page }
  async list(query = {}) {
    const qs = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    const q = qs.toString();
    return req(`/products${q ? `?${q}` : ""}`);
  },
  async detail(key) {
    return req(`/products/${encodeURIComponent(key)}`);
  },
};

/* -------------------- INVENTORY -------------------- */
export const inventoryApi = {
  // items: [{ sku, qty }, ...]
  async check(items) {
    return req(`/inventory/check`, { method: "POST", json: { items } });
  },
};

/* -------------------- ORDERS (user) -------------------- */
export const ordersApi = {
  async mine() {
    return req(`/orders/mine`);
  },
  async summary() {
    return req(`/orders/mine/summary`);
  },
};

/* -------------------- ADMIN -------------------- */
export const adminApi = {
  async stats() {
    return req(`/admin/stats`);
  },
  // Admin product management
  async products() {
    return req(`/admin/products`);
  },
  async addProduct(payload) {
    return req(`/admin/products`, { method: "POST", json: payload });
  },
  async updateProduct(id, payload) {
    return req(`/admin/products/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: payload,
    });
  },

  // Orders
  // list with optional query { q, status, page, limit, from, to }
  async orders(query = {}) {
    const qs = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    const q = qs.toString();
    return req(`/admin/orders${q ? `?${q}` : ""}`);
  },
  async getOrder(id) {
    return req(`/admin/orders/${encodeURIComponent(id)}`);
  },
  async updateOrder(id, payload) {
    return req(`/admin/orders/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: payload,
    });
  },

  // Inventory endpoints
  async inventoryList(query = {}) {
    const qs = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    const q = qs.toString();
    return req(`/admin/inventory${q ? `?${q}` : ""}`);
  },
  async restock({ sku, qty }) {
    return req(`/admin/inventory/restock`, { method: "PATCH", json: { sku, qty } });
  },

  // Users
  async users(query = {}) {
    const qs = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    const q = qs.toString();
    return req(`/admin/users${q ? `?${q}` : ""}`);
  },
  async updateUser(id, payload) {
    return req(`/admin/users/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: payload,
    });
  },
  async deleteUser(id) {
    return req(`/admin/users/${encodeURIComponent(id)}`, { method: "DELETE" });
  },

  // Settings
  async settings() {
    return req(`/admin/settings`);
  },
  async updateSettings(payload) {
    return req(`/admin/settings`, { method: "PATCH", json: payload });
  },

  // Export & reports
  async exportOrdersCsv(query = {}) {
    // returns raw Response for file download
    const qs = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    const q = qs.toString();
    return req(`/admin/orders/export${q ? `?${q}` : ""}`, { raw: true });
  },

  // Low-stock helper (simple)
  async lowStock() {
    return req(`/admin/low-stock`);
  },
};
