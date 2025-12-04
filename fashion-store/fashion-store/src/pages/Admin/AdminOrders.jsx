// src/pages/Admin/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";

/* Helper: download blob as file */
function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState(null);
  const [opLoading, setOpLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setErr("");
    try {
      const query = {};
      if (statusFilter) query.status = statusFilter;
      if (q) query.q = q;
      if (dateFrom) query.from = dateFrom;
      if (dateTo) query.to = dateTo;
      const res = await adminApi.orders(query).catch(() => null);
      const list = (Array.isArray(res) ? res : (res?.items || res?.orders || []));
      if (list.length) setOrders(list);
      else setOrders([]);
    } catch (e) {
      setErr(e.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function openOrder(o) {
    if (!o._id && (o.id || o.orderNumber)) {
      try {
        const fetched = await adminApi.getOrder(o._id || o.orderNumber).catch(() => null);
        setSelected(fetched || o);
      } catch {
        setSelected(o);
      }
    } else {
      setSelected(o);
    }
  }

  async function updateStatus(orderId, newStatus) {
    setOpLoading(true);
    try {
      await adminApi.updateOrder(orderId, { status: newStatus });
      await fetchOrders();
      setSelected((s) => (s && (s._id === orderId || s.orderNumber === orderId) ? { ...s, status: newStatus } : s));
    } catch (e) {
      alert(e.message || "Failed to update order");
    } finally {
      setOpLoading(false);
    }
  }

  async function exportCsv() {
    try {
      const query = {};
      if (statusFilter) query.status = statusFilter;
      if (dateFrom) query.from = dateFrom;
      if (dateTo) query.to = dateTo;
      const res = await adminApi.exportOrdersCsv(query);
      const blob = await res.blob();
      downloadBlob(`orders-${new Date().toISOString().slice(0,10)}.csv`, blob);
    } catch (e) {
      alert(e.message || "Export failed");
    }
  }

  async function bulkMarkShipped(selectedIds = []) {
    if (!selectedIds.length) {
      alert("Select at least one order.");
      return;
    }
    if (!confirm(`Mark ${selectedIds.length} orders as shipped?`)) return;
    setOpLoading(true);
    try {
      // If backend supports bulk update endpoint, call it. Fallback to single updates:
      for (const id of selectedIds) {
        await adminApi.updateOrder(id, { status: "shipped" });
      }
      await fetchOrders();
    } catch (e) {
      alert(e.message || "Bulk update failed");
    } finally {
      setOpLoading(false);
    }
  }

  // Selection helper for bulk
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const toggleSelect = (id) => {
    setSelectedOrders((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Orders</h3>

        <div className="flex items-center gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded px-2 py-1 text-sm">
            <option value="">All status</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="unpaid">Unpaid</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input placeholder="Search order/ customer" value={q} onChange={(e) => setQ(e.target.value)} className="border rounded px-2 py-1 text-sm" />
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border rounded px-2 py-1 text-sm" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border rounded px-2 py-1 text-sm" />
          <button onClick={fetchOrders} className="px-3 py-1 border rounded text-sm">Filter</button>
          <button onClick={exportCsv} className="px-3 py-1 bg-gray-800 text-white rounded text-sm">Export CSV</button>
        </div>
      </div>

      {err && <div className="text-red-600 mb-3">{err}</div>}

      <div className="bg-white border rounded divide-y">
        {loading ? (
          <div className="p-4">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="p-4 text-gray-500">No orders found.</div>
        ) : (
          orders.map((o) => {
            const id = o._id || o.orderNumber || o.id;
            return (
              <div key={id} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={selectedOrders.has(id)} onChange={() => toggleSelect(id)} />
                  <div>
                    <div className="text-sm font-medium">{o.orderNumber || id}</div>
                    <div className="text-xs text-gray-500">{(o.customer && o.customer.name) || (o.address && o.address.fullName) || "Guest"} • {new Date(o.createdAt || Date.now()).toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">₹{Number(o.total || o.sub || 0).toFixed(2)}</div>
                  <div className={`px-2 py-1 rounded text-xs ${o.status === "paid" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>{o.status}</div>
                  <button onClick={() => openOrder(o)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">View</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={() => bulkMarkShipped(Array.from(selectedOrders))} className="px-3 py-1 border rounded">Mark selected Shipped</button>
        <button onClick={() => { setSelectedOrders(new Set()); }} className="px-3 py-1 border rounded">Clear selection</button>
      </div>

      {selected && (
        <OrderModal order={selected} onClose={() => setSelected(null)} onUpdateStatus={updateStatus} opLoading={opLoading} />
      )}
    </div>
  );
}

function OrderModal({ order, onClose, onUpdateStatus, opLoading }) {
  const addr = order.address || {};
  const c = order.customer || {};
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 px-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <div className="text-lg font-semibold">Order {order.orderNumber || order._id}</div>
            <div className="text-sm text-gray-500">{new Date(order.createdAt || Date.now()).toLocaleString()}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onUpdateStatus(order._id || order.orderNumber, "shipped")} disabled={opLoading} className="px-3 py-1 bg-green-600 text-white rounded">Mark Shipped</button>
            <button onClick={() => onUpdateStatus(order._id || order.orderNumber, "cancelled")} disabled={opLoading} className="px-3 py-1 border rounded">Cancel</button>
            <button onClick={onClose} className="px-3 py-1 border rounded">Close</button>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Items */}
          <div>
            <h4 className="font-semibold mb-2">Items</h4>
            <div className="space-y-2">
              {(order.items || []).map((it, i) => (
                <div key={i} className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <div className="font-medium">{it.title || it.name}</div>
                    <div className="text-xs text-gray-500">{it.sku || ""} • {it.size || ""} • {it.color || ""}</div>
                  </div>
                  <div className="text-right">
                    <div>Qty: {it.qty}</div>
                    <div>₹{Number(it.price || 0).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm">
              <div>Sub: ₹{Number(order.sub || 0).toFixed(2)}</div>
              <div>GST: ₹{Number(order.gst || 0).toFixed(2)}</div>
              <div className="font-semibold">Total: ₹{Number(order.total || order.sub || 0).toFixed(2)}</div>
            </div>
          </div>

          {/* Customer & Payment */}
          <div>
            <h4 className="font-semibold mb-2">Customer</h4>
            <div className="border rounded p-3 mb-3">
              <div className="font-medium">{c.name || addr.fullName || "Guest"}</div>
              <div className="text-sm text-gray-500">{c.email || order.email}</div>
              <div className="text-sm text-gray-500">UserId: {c.userId || order.customerId || "-"}</div>
              <div className="text-sm text-gray-500">Phone: {c.phone || addr.phone || "-"}</div>
            </div>

            <h4 className="font-semibold mb-2">Shipping address</h4>
            <div className="border rounded p-3 mb-3 text-sm">
              <div>{addr.fullName}</div>
              <div>{addr.address1}{addr.address2 ? `, ${addr.address2}` : ""}</div>
              <div>{addr.city} {addr.pincode}</div>
              <div>{addr.state}</div>
            </div>

            <h4 className="font-semibold mb-2">Payment</h4>
            <div className="border rounded p-3 text-sm">
              <div>Method: {order.paymentMethod || order.razorpay?.method || "Online"}</div>
              <div>Payment id: {order.razorpay?.payment_id || "-"}</div>
              <div className="text-xs text-gray-500 mt-1">Status: {order.status}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
