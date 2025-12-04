// src/pages/Payment.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { useStore } from "../context/StoreContext";
import { apiFetch } from "../lib/api";
import { ensureCustomer } from "../lib/customer";

// 🎯 FIX APPLIED HERE: The hardcoded fallback key has been removed.
// The key is now sourced ONLY from the secure Netlify environment variable.
const RZP_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(Number(n || 0)));

/* Small UI bits */
function Stepper({ current = 1, labels = [] }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {labels.map((label, idx) => {
          const step = idx + 1;
          const active = step <= current;
          return (
            <div key={label} className="flex-1 flex items-center">
              <div
                className={`h-9 w-9 shrink-0 rounded-full grid place-items-center text-sm font-semibold transition
                ${active ? "bg-blue-600 text-white shadow-sm" : "bg-neutral-200 text-neutral-600"}`}
                title={label}
              >
                {step}
              </div>
              {idx < labels.length - 1 && (
                <div className={`mx-2 h-1 w-full rounded-full transition ${step < current ? "bg-blue-600" : "bg-neutral-200"}`} />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 grid grid-cols-5 text-center text-xs text-neutral-600">
        {labels.map((l) => (
          <div key={l} className="truncate">{l}</div>
        ))}
      </div>
    </div>
  );
}

function ThankYouBanner({ orderId, emailHint, total, onCopy }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200/70 dark:border-neutral-800 p-6 md:p-8 bg-white dark:bg-neutral-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #2563eb 2px, transparent 2px), radial-gradient(circle at 70% 60%, #60a5fa 2px, transparent 2px), radial-gradient(circle at 85% 20%, #93c5fd 2px, transparent 2px)",
          backgroundSize: "120px 120px",
        }}
      />
      <div className="relative flex items-start gap-4">
        <div className="h-12 w-12 grid place-items-center rounded-full bg-blue-600 text-white shadow-md">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-2xl md:text-3xl font-bold">Payment completed / Thank you</div>
          <div className="text-sm mt-1 text-neutral-600 dark:text-neutral-400">
            We’ve emailed your receipt to <span className="font-medium">{emailHint || "your email"}</span>.{" "}
            Order <button onClick={onCopy} className="font-mono underline underline-offset-4">{orderId}</button>. Total {formatINR(total)}.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/orders" className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-blue-600 text-white font-semibold">
              Track Order
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 h-10 px-4 rounded-full border font-semibold">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Invoice helpers */
function buildInvoiceData({ orderId, address, items, sub, gst, total }) {
  return {
    orderId,
    date: new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    address,
    items,
    sub,
    gst,
    total,
  };
}

function renderInvoiceHTML(inv) {
  const rows = inv.items
    .map(
      (it) => `
      <tr>
        <td>${(it.title || it.name || "").replace(/</g, "&lt;")}</td>
        <td>${it.size || "-"}</td>
        <td>${it.color || "-"}</td>
        <td style="text-align:right;">${it.qty || 1}</td>
        <td style="text-align:right;">${formatINR(it.price || 0)}</td>
        <td style="text-align:right;">${formatINR((it.price || 0) * (it.qty || 1))}</td>
      </tr>`
    )
    .join("");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice ${inv.orderId}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root { --ink:#0a0a0a; --mut:#666; --bg:#fff; --bord:#e5e5e5; --brand:#2563eb; }
  * { box-sizing: border-box; }
  body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"; margin: 24px; color: var(--ink); background: var(--bg); }
  .card { max-width: 900px; margin: 0 auto; border:1px solid var(--bord); border-radius:16px; padding:24px; }
  .row { display:flex; gap:16px; justify-content:space-between; align-items:flex-start; }
  h1 { margin:0 0 4px; font-size:24px; }
  .mut { color: var(--mut); font-size: 12px; }
  table { width:100%; border-collapse: collapse; margin-top:12px; }
  th, td { padding:10px; border-top:1px solid var(--bord); font-size: 14px; }
  th { text-align:left; background:#f8fafc; }
  .totals { margin-top:12px; width:100%; }
  .totals td { padding:6px 10px; }
  .totals .lab { color: var(--mut); }
  .totals .val { text-align:right; }
  .brand { color: var(--brand); font-weight: 700; }
  .sec { margin-top:16px; }
  @media print { body { margin: 0; } .card { border: none; border-radius:0; } }
</style>
</head>
<body>
  <div class="card">
    <div class="row">
      <div>
        <h1>Invoice <span class="brand">${inv.orderId}</span></h1>
        <div class="mut">Date: ${inv.date}</div>
        </div>
        <div>
          <div><strong>Delivering to</strong></div>
          <div>${inv.address.fullName || ""}</div>
          <div>${inv.address.address1 || ""}</div>
          ${inv.address.address2 ? `<div>${inv.address.address2}</div>` : ""}
          <div>${[inv.address.city, inv.address.state].filter(Boolean).join(", ")} ${inv.address.pincode ? "— " + inv.address.pincode : ""}</div>
          ${inv.address.phone ? `<div>Phone: ${inv.address.phone}</div>` : ""}
          ${inv.address.email ? `<div>Email: ${inv.address.email}</div>` : ""}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Size</th>
            <th>Color</th>
            <th style="text-align:right;">Qty</th>
            <th style="text-align:right;">Price</th>
            <th style="text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${rows || `<tr><td colspan="6" class="mut">No items</td></tr>`}
        </tbody>
      </table>

      <table class="totals">
        <tbody>
          <tr><td class="lab">Subtotal</td><td class="val">${formatINR(inv.sub)}</td></tr>
          <tr><td class="lab">GST (5%)</td><td class="val">${formatINR(inv.gst)}</td></tr>
          <tr><td class="lab"><strong>Total</strong></td><td class="val"><strong>${formatINR(inv.total)}</strong></td></tr>
        </tbody>
      </table>

      <div class="sec mut">Thank you for shopping with us.</div>
    </div>
    <script>window.onafterprint = () => window.close && window.close();</script>
</body>
</html>`;
}

/* MAIN */
export default function Payment() {
  const nav = useNavigate();
  const { cart = [], clearCart } = useStore();

  const address = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("checkout_address") || "{}");
    } catch {
      return {};
    }
  }, []);

  const sub = cart.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 1), 0);
  const gst = Math.round(sub * 0.05);
  const total = sub + gst;

  const [paid, setPaid] = useState(false);
  const [orderId] = useState(() => "AURA" + Math.random().toString(36).slice(2, 8).toUpperCase());
  const [snapshot, setSnapshot] = useState({ items: [], sub: 0, gst: 0, total: 0 });
  const [tab, setTab] = useState("summary");
  const stepLabels = ["Placed", "Confirmed", "Packed", "Shipped", "Delivered"];

  // Build invoice for current view (paid snapshot if available)
  const itemsForView = paid ? snapshot.items : cart;
  const subView = paid ? snapshot.sub : sub;
  const gstView = paid ? snapshot.gst : gst;
  const totalView = paid ? snapshot.total : total;

  const makeInvoice = () =>
    buildInvoiceData({
      orderId,
      address,
      items: itemsForView,
      sub: subView,
      gst: gstView,
      total: totalView,
    });

  const printInvoice = () => {
    const html = renderInvoiceHTML(makeInvoice());
    const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=1000");
    if (!w) return; // popup blocked
    w.document.open();
    w.document.write(html);
    w.document.close();
    setTimeout(() => {
      w.focus();
      w.print();
    }, 150);
  };

  const downloadInvoice = () => {
    const html = renderInvoiceHTML(makeInvoice());
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${orderId}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  };

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      alert("Order ID copied");
    } catch {}
  };

  const payNow = async () => {
    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }
    
    // IMPORTANT: Add a check for the environment variable here since the fallback was removed
    if (!RZP_KEY) {
      alert("Payment key is missing. Please set VITE_RAZORPAY_KEY_ID environment variable.");
      return;
    }

    // 0) Ensure / create customer and get customerId
    const customerId = await ensureCustomer(address);

    // 1) Inventory check
    const inv = await apiFetch("/api/inventory/check", {
      method: "POST",
      body: JSON.stringify({
        items: cart.map((it) => ({ sku: it.id || it.sku, qty: it.qty || 1 })),
      }),
    });
    if (!inv.ok || inv.data?.insufficient?.length) {
      const list =
        inv.data?.insufficient?.map((i) => `${i.sku} (need ${i.requested}, have ${i.available})`) || [];
      alert("Some items are unavailable:\n" + list.join("\n"));
      return;
    }

    // 2) Create Razorpay order (amount in rupees)
    const created = await apiFetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({ amount: total, currency: "INR", receipt: orderId }),
    });
    if (!created.ok || !created.data?.order) {
      alert("Could not create order. Please try again.");
      return;
    }
    const order = created.data.order;

    // 3) Open Razorpay checkout
    const opts = {
      key: RZP_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "AuraLifestyle",
      description: `Order ${orderId}`,
      order_id: order.id,
      prefill: {
        name: address?.fullName || "",
        email: address?.email || "",
        contact: address?.phone || "",
      },
      notes: { display_order_id: orderId },
      theme: { color: "#111111" },
      handler: async (resp) => {
        // 4) Verify + decrement stock + upsert customer + save order + email
        const verify = await apiFetch("/api/verify-payment", {
          method: "POST",
          body: JSON.stringify({
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
            meta: {
              customerId,
              display_order_id: orderId,
              address,
              items: cart.map((it) => ({
                id: it.id || it.sku,
                title: it.title || it.name,
                price: Number(it.price) || 0,
                qty: Number(it.qty) || 1,
                size: it.size || "",
                color: it.color || "",
                image: it.image || "",
              })),
              sub,
              gst,
              total,
              rzpAmount: order.amount,
              rzpCurrency: order.currency,
            },
          }),
        });

        if (!verify.ok || !verify.data?.success) {
          alert("Payment captured but verification failed. We’ll email you if needed.");
          return;
        }

        // Success UI snapshot + clear cart
        localStorage.setItem(
          "last_invoice",
          JSON.stringify({
            orderId,
            address,
            cart: [...cart],
            sub,
            gst,
            total,
            createdAt: new Date().toISOString(),
          })
        );
        clearCart?.();
        setSnapshot({ items: [...cart], sub, gst, total });
        setPaid(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      modal: { ondismiss: () => {} },
    };

    if (window.Razorpay) {
      const rz = new window.Razorpay(opts);
      rz.open();
    } else {
      alert("Razorpay SDK not loaded.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <CheckoutSteps current="payment" />

      {!paid ? (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl md:text-3xl font-bold">Review & Pay</div>
              <div className="text-sm text-neutral-600">
                Secure payments • GST applied at checkout • Order ID will be generated on success
              </div>
            </div>
            <button
              onClick={() => nav("/checkout")}
              className="text-sm underline inline-flex items-center gap-1"
            >
              ← Edit Address
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 space-y-4">
          <ThankYouBanner
            orderId={orderId}
            emailHint={address?.email || (address?.phone ? `${address.phone}@sms` : "")}
            total={totalView}
            onCopy={copyOrderId}
          />
          <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
            <Stepper current={1} labels={stepLabels} />
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[1.6fr,1fr] gap-8 items-start">
        {/* LEFT */}
        <div className="space-y-6">
          {/* Mobile segmented controller */}
          <div className="md:hidden rounded-full border p-1 flex bg-white dark:bg-neutral-900">
            {["summary", "invoice"].map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`flex-1 h-9 rounded-full text-sm font-medium ${tab === k ? "bg-blue-600 text-white" : ""}`}
              >
                {k === "summary" ? "Order Summary" : "Invoice"}
              </button>
            ))}
          </div>

          {/* Desktop: Summary + Invoice side-by-side */}
          <div className="hidden md:grid grid-cols-1 xl:grid-cols-[2fr,1fr] gap-6">
            {/* Order Summary */}
            <div className="rounded-2xl border p-4 bg-white dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-lg">Order Summary</div>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {itemsForView.reduce((n, it) => n + (it.qty || 1), 0)} items
                </span>
              </div>

              <div className="mt-3 divide-y">
                {itemsForView.map((it) => (
                  <div key={`${it.id}-${it.size}-${it.color}`} className="py-2 flex items-center justify-between text-sm">
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {it.title || it.name} × {it.qty || 1}
                      </div>
                      <div className="text-xs opacity-70">
                        {it.size ? `Size: ${it.size}` : ""} {it.color ? `• ${it.color}` : ""}
                      </div>
                    </div>
                    <div className="font-medium">{formatINR((it.price || 0) * (it.qty || 1))}</div>
                  </div>
                ))}
              </div>

              <div className="border-t my-3" />
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatINR(subView)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>GST (5%)</span>
                  <span>{formatINR(gstView)}</span>
                </div>
              </div>
              <div className="border-t my-2" />
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatINR(totalView)}</span>
              </div>

              {paid ? (
                <div className="mt-4 flex gap-2">
                  <button className="h-10 px-4 rounded-md border" onClick={downloadInvoice}>
                    Download Invoice
                  </button>
                  <button className="h-10 px-4 rounded-md bg-blue-600 text-white font-semibold" onClick={printInvoice}>
                    Print
                  </button>
                </div>
              ) : null}
            </div>

            {/* Invoice preview */}
            <div className="rounded-2xl border p-4 bg-white dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-lg">Invoice</div>
                <button className="h-9 px-3 rounded-md border" onClick={printInvoice}>
                  Print
                </button>
              </div>

              <div className="mt-3 text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span>Order ID</span> <span className="font-mono">{orderId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Date</span>
                  <span>{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total</span> <span className="font-semibold">{formatINR(totalView)}</span>
                </div>
              </div>

              <div className="mt-3 text-xs text-neutral-500">Preview only. Final invoice is available after payment completion.</div>
            </div>
          </div>

          {/* Mobile panes */}
          <div className="md:hidden">
            {tab === "summary" ? (
              <div className="rounded-2xl border p-4 bg-white dark:bg-neutral-900">
                <div className="font-semibold mb-2">Order Summary</div>
                <div className="divide-y">
                  {itemsForView.map((it) => (
                    <div key={`${it.id}-${it.size}-${it.color}`} className="py-2 flex items-center justify-between text-sm">
                      <div className="min-w-0">
                        <div className="truncate font-medium">
                          {it.title || it.name} × {it.qty || 1}
                        </div>
                        <div className="text-xs opacity-70">
                          {it.size ? `Size: ${it.size}` : ""} {it.color ? `• ${it.color}` : ""}
                        </div>
                    </div>
                    <div className="font-medium">{formatINR((it.price || 0) * (it.qty || 1))}</div>
                  </div>
                  ))}
                </div>
                <div className="border-t my-3" />
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>{formatINR(subView)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>GST (5%)</span>
                    <span>{formatINR(gstView)}</span>
                  </div>
                </div>
                <div className="border-t my-2" />
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatINR(totalView)}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border p-4 bg-white dark:bg-neutral-900">
                <div className="font-semibold mb-2">Invoice</div>
                <div className="text-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Order ID</span> <span className="font-mono">{orderId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Date</span>
                    <span>{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
                  <div className="flex items-center justify-between">
                    <span>Total</span> <span className="font-semibold">{formatINR(totalView)}</span>
                </div>
                </div>
                <button className="mt-3 h-10 px-4 rounded-md border w-full" onClick={printInvoice}>
                  Print
                </button>
                {paid ? (
                  <button className="mt-2 h-10 px-4 rounded-md border w-full" onClick={downloadInvoice}>
                    Download Invoice
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {!paid ? (
            <div className="rounded-2xl border p-4 bg-white dark:bg-neutral-900">
              <div className="font-semibold mb-2">Payment Methods</div>
              <div className="space-y-2">
                <label className="flex items-center gap-2"><input type="radio" name="pm" defaultChecked /> UPI</label>
                <label className="flex items-center gap-2"><input type="radio" name="pm" /> Card</label>
                <label className="flex items-center gap-2"><input type="radio" name="pm" /> Netbanking</label>
                <label className="flex items-center gap-2"><input type="radio" name="pm" /> Cash on Delivery</label>
              </div>
              <button onClick={payNow} className="mt-4 h-11 w-full rounded-full bg-blue-600 text-white font-semibold inline-flex items-center justify-center gap-2">
                Pay Now — {formatINR(totalView)}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border p-4 bg-white dark:bg-neutral-900">
              <div className="font-semibold mb-2">What’s next?</div>
              <div className="text-sm text-neutral-600">
                We’ll confirm your order and send updates as it moves. You can track the progress anytime.
              </div>
              <div className="mt-3 flex gap-2">
                <Link to="/orders" className="h-10 px-4 rounded-md bg-blue-600 text-white font-semibold">Track Order</Link>
                <Link to="/" className="h-10 px-4 rounded-md border font-semibold">Continue Shopping</Link>
              </div>
            </div>
          )}

          {/* Delivering To */}
          <div className="rounded-2xl border p-4 bg-white dark:bg-neutral-900">
            <div className="font-semibold mb-2">Delivering to</div>
            <div className="text-sm space-y-1">
              <div>{address.fullName}</div>
              <div>{address.address1}</div>
              {!!address.address2 && <div>{address.address2}</div>}
              <div>
                {address.city}
                {address.city && address.state ? ", " : ""}
                {address.state}
                {address.pincode ? ` — ${address.pincode}` : ""}
              </div>
              {address.phone ? <div>Phone: {address.phone}</div> : null}
              {address.email ? <div>Email: {address.email}</div> : null}
            </div>

            <div className="mt-6 text-sm opacity-70">
              By paying, you agree to our{" "}
              <Link className="underline" to="/terms">Terms</Link>,{" "}
              <Link className="underline" to="/privacy">Privacy</Link> and{" "}
              <Link className="underline" to="/returns">Return Policy</Link>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}