// utils/order.js
export function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
export function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
export function randomOrderId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const d = new Date();
  return `AURA-${String(d.getFullYear()).slice(-2)}${String(d.getMonth()+1).padStart(2,"0")}-${rand}`;
}
export function getCartFromAnywhere(store) {
  if (store?.cart) return store.cart;
  return lsGet("aura.cart", []);
}
export function getAddressFromAnywhere(store) {
  if (store?.address) return store.address;
  return lsGet("aura.address", null);
}
export function getUserFromAnywhere(store) {
  if (store?.user) return store.user;
  return lsGet("aura.user", null);
}
export function addOrder(order) {
  const orders = lsGet("aura.orders", []);
  orders.unshift(order);
  lsSet("aura.orders", orders);
}
export function clearCartAnywhere(store) {
  if (store?.clearCart) store.clearCart();
  else lsSet("aura.cart", []);
}
