import { apiFetch } from "./api";

export async function ensureCustomer(address) {
  const body = {
    fullName: address?.fullName || "",
    email: address?.email || "",
    phone: address?.phone || "",
    address,
  };
  const r = await apiFetch("/api/customers/ensure", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (r.ok && r.data?.customerId) {
    localStorage.setItem("customer_id", r.data.customerId);
    return r.data.customerId;
  }
  return null;
}
