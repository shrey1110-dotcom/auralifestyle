// src/lib/auth.js
export function saveAuth(token, user) {
  try {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user || null));
  } catch {}
}

export function loadAuth() {
  try {
    const token = localStorage.getItem("auth_token");
    const userRaw = localStorage.getItem("auth_user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  } catch {}
}
