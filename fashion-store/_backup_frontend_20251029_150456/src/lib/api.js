const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export function getToken() {
  return localStorage.getItem('al_token') || '';
}
export function setToken(t) {
  if (t) localStorage.setItem('al_token', t);
  else localStorage.removeItem('al_token');
}

async function request(path, { method='GET', body, auth=true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const txt = await res.text().catch(()=> '');
    let msg = 'request_failed';
    try { msg = (JSON.parse(txt)?.message) || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

/* ---- auth ---- */
export const apiLogin = (email, password) =>
  request('/api/auth/login', { method:'POST', auth:false, body:{ email, password } });
export const apiMe = () => request('/api/auth/me');

/* ---- admin ---- */
export const apiAdminStats = () => request('/api/admin/stats');
export const apiAdminOrders = (q='') => request(`/api/admin/orders${q}`);
export const apiAdminProducts = () => request('/api/admin/products');
export const apiAdminCustomers = () => request('/api/admin/customers');
export const apiAdminRestock = (sku, delta) =>
  request('/api/admin/restock', { method:'POST', body:{ sku, delta:Number(delta) } });

export default request;
