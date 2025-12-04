import { apiLogin, apiMe } from './api';
import { setToken, getToken } from './api';

export async function loginAsAdmin(email, password) {
  const r = await apiLogin(email, password);
  setToken(r.token);
  const me = await apiMe();
  if (me?.user?.role !== 'admin') {
    setToken('');
    throw new Error('not_admin');
  }
  return me.user;
}
export function logout() {
  setToken('');
}
export async function ensureAdmin() {
  const t = getToken();
  if (!t) throw new Error('no_token');
  const me = await apiMe();
  if (me?.user?.role !== 'admin') throw new Error('not_admin');
  return me.user;
}
