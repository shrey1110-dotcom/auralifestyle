import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import CheckoutSteps from "../components/CheckoutSteps";

export default function Checkout() {
  const { cart = [] } = useStore();
  const nav = useNavigate();

  const existing = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("checkout_address") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [form, setForm] = useState({
    fullName: existing.fullName || "",
    email: existing.email || "",
    phone: existing.phone || "",
    pincode: existing.pincode || "",
    address1: existing.address1 || "",
    address2: existing.address2 || "",
    city: existing.city || "",
    state: existing.state || "",
    remember: Boolean(existing.remember),
  });

  // autosave progress
  useEffect(() => {
    localStorage.setItem("checkout_address", JSON.stringify(form));
  }, [form]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const valid =
    form.fullName.trim() &&
    /^\d{10}$/.test(String(form.phone)) &&
    /^\d{6}$/.test(String(form.pincode)) &&
    (!form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) &&
    form.address1.trim() &&
    form.city.trim() &&
    form.state.trim();

  function onSubmit(e) {
    e.preventDefault();
    if (!valid) return;
    localStorage.setItem("checkout_address", JSON.stringify(form));
    nav("/payment");
  }

  if (!cart?.length) {
    return (
      <>
        <CheckoutSteps current="address" />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-sm opacity-70">Your bag is empty. <Link to="/men" className="underline">Shop now</Link></div>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <CheckoutSteps current="address" />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Delivery Details</h1>
        <Link to="/cart" className="text-sm underline inline-flex items-center gap-1">
          ← Back to Bag
        </Link>
      </div>

      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Full name"
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
        />
        <input
          type="email"
          className={`border rounded px-3 py-2 ${form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "border-rose-400" : ""}`}
          placeholder="Email (for receipts)"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
        <input
          className={`border rounded px-3 py-2 ${form.phone && !/^\d{10}$/.test(form.phone) ? "border-rose-400" : ""}`}
          placeholder="Phone (10 digit)"
          maxLength={10}
          value={form.phone}
          onChange={(e) => update("phone", e.target.value.replace(/[^\d]/g, ""))}
        />
        <input
          className={`border rounded px-3 py-2 ${form.pincode && !/^\d{6}$/.test(form.pincode) ? "border-rose-400" : ""}`}
          placeholder="Pincode"
          maxLength={6}
          value={form.pincode}
          onChange={(e) => update("pincode", e.target.value.replace(/[^\d]/g, ""))}
        />
        <input
          className="border rounded px-3 py-2 md:col-span-2"
          placeholder="Address line 1"
          value={form.address1}
          onChange={(e) => update("address1", e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 md:col-span-2"
          placeholder="Address line 2 (optional)"
          value={form.address2}
          onChange={(e) => update("address2", e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="City"
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="State"
          value={form.state}
          onChange={(e) => update("state", e.target.value)}
        />

        <label className="md:col-span-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={(e) => update("remember", e.target.checked)}
          />
          <span>Use this address next time</span>
        </label>

        <div className="md:col-span-2 flex justify-end mt-2">
          <button
            disabled={!valid}
            className={`h-11 px-5 rounded inline-flex items-center gap-2 ${
              valid ? "bg-neutral-900 text-white hover:opacity-90" : "bg-neutral-300 text-neutral-600 cursor-not-allowed"
            }`}
          >
            Continue to Payment
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
