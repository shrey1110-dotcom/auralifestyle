// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { adminApi } from "@/lib/api";
import socket from "@/lib/socket"; // <-- 1. Import socket

// same dummy data used in products page for consistent totals
const DUMMY_PRODUCTS = [
  { id: "P-101", sku: "SQD-HOOD-RED-S", title: "Squid Game Hoodie — Red", price: 1299, stock: 18 },
  { id: "P-102", sku: "DMS-SLYR-BLK-M", title: "Demon Slayer Tee — Black", price: 799, stock: 42 },
  { id: "P-103", sku: "HP-PTTR-GRN-L", title: "Potterhead Hoodie — Slytherin", price: 1499, stock: 5 },
  { id: "P-104", sku: "ANM-MIX-BLU-XL", title: "Anime Mashup Tee — Blue", price: 699, stock: 0 },
  { id: "P-105", sku: "NRTO-FOX-ORG-M", title: "Naruto Kurama Hoodie — Orange", price: 1399, stock: 23 },
  { id: "P-106", sku: "OP-STRW-BLK-S", title: "One Piece Straw Hat Tee — Black", price: 749, stock: 9 },
  { id: "P-107", sku: "JKR-PINK-OVR", title: "JJK Pink Oversize Tee", price: 899, stock: 31 },
  { id: "P-108", sku: "ATK-TN-BLK-M", title: "Attack Titan Tee — Black", price: 849, stock: 2 },
];

const DUMMY_ORDERS = [
  {
    orderNumber: "ORD-5001",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    customer: { name: "Aarav Sharma" },
    items: [
      { sku: "SQD-HOOD-RED-S", title: "Squid Game Hoodie — Red", qty: 1, price: 1299 },
      { sku: "DMS-SLYR-BLK-M", title: "Demon Slayer Tee — Black", qty: 2, price: 799 },
    ],
    total: 1299 + 2 * 799,
  },
  {
    orderNumber: "ORD-5002",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    customer: { name: "Riya Verma" },
    items: [{ sku: "HP-PTTR-GRN-L", title: "Potterhead Hoodie — Slytherin", qty: 1, price: 1499 }],
    total: 1499,
  },
  {
    orderNumber: "ORD-5003",
    createdAt: new Date().toISOString(),
    customer: { name: "Kunal Gupta" },
    items: [{ sku: "ATK-TN-BLK-M", title: "Attack Titan Tee — Black", qty: 3, price: 849 }],
    total: 3 * 849,
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // 2. Extracted data fetching logic into a reusable function
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      let s;
      try {
        s = await adminApi.stats();
      } catch {
        s = null;
      }

      // Fallback: compute simple totals from dummy data if no API / empty
      if (!s || !s.totals) {
        const revenue = DUMMY_ORDERS.reduce((a, o) => a + Number(o.total || 0), 0);
        const orders = DUMMY_ORDERS.length;
        const customers = new Set(DUMMY_ORDERS.map((o) => (o.customer?.name || o.address?.fullName || "Customer"))).size;
        const products = DUMMY_PRODUCTS.length;
        s = { totals: { products, orders, customers, revenue } };
      }

      setStats(s);
    } catch (e) {
      setErr(e.message || "Failed");
      // still set a dummy stats object so UI isn't empty
      const revenue = DUMMY_ORDERS.reduce((a, o) => a + Number(o.total || 0), 0);
      setStats({ totals: { products: DUMMY_PRODUCTS.length, orders: DUMMY_ORDERS.length, customers: 3, revenue } });
    } finally {
      setLoading(false);
    }
  }, []); // Use useCallback to stabilize the function

  // useEffect for initial data fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // 3. Added useEffect for socket connection
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => console.log("admin socket connected", socket.id));

    // 4. Listen for events and refetch stats
    const handleNewOrder = (payload) => {
      console.log("New order", payload);
      fetchStats(); // Refetch dashboard stats
      window.dispatchEvent(new CustomEvent("order:created", { detail: payload.order }));
    };

    const handleInventoryUpdate = (payload) => {
      console.log("inventory changed", payload);
      fetchStats(); // Refetch dashboard stats
      window.dispatchEvent(new CustomEvent("inventory:updated", { detail: payload }));
    };

    socket.on("order:created", handleNewOrder);
    socket.on("inventory:updated", handleInventoryUpdate);

    // Cleanup on unmount
    return () => {
      socket.off("connect");
      socket.off("order:created", handleNewOrder);
      socket.off("inventory:updated", handleInventoryUpdate);
      socket.disconnect();
    };
  }, [fetchStats]); // Add fetchStats as dependency

  // A tiny "Inventory" summary here too
  const inv = useMemo(() => {
    const totalUnits = DUMMY_PRODUCTS.reduce((a, p) => a + (p.stock || 0), 0);
    const low = DUMMY_PRODUCTS.filter((p) => p.stock > 0 && p.stock <= 5).length;
    const oos = DUMMY_PRODUCTS.filter((p) => p.stock === 0).length;
    return { totalSkus: DUMMY_PRODUCTS.length, totalUnits, low, oos };
  }, []);

  // --- CSV upload placeholder (parity with AdminProducts) ---
  async function handleCsvUpload(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    alert("CSV upload not implemented — upload to backend or process client-side.");
    e.target.value = "";
  }
  function openImageManager() {
    alert("Image Manager placeholder — wire this to your asset library or CDN.");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <div className="text-sm text-gray-500">Overview</div>
        </div>
        <div className="flex items-center gap-2">
          <input id="csv-upload-dashboard" type="file" accept=".csv" style={{ display: "none" }} onChange={handleCsvUpload} />
          <button onClick={() => document.getElementById("csv-upload-dashboard").click()} className="px-3 py-2 border rounded text-sm">Bulk Upload CSV</button>
          <button onClick={openImageManager} className="px-3 py-2 border rounded text-sm">Image Manager</button>
        </div>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : err ? (
        <div className="text-red-600">{err}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <Card label="Today's Revenue" value={`₹${stats?.totals?.revenue ?? 0}`} hint="+12% from yesterday" />
            <Card label="Orders" value={stats?.totals?.orders ?? 0} hint="+8% from yesterday" />
            <Card label="Customers" value={stats?.totals?.customers ?? 0} hint="+5 new today" />
            <Card label="Products" value={stats?.totals?.products ?? 0} hint="Active SKUs" />
          </div>

          {/* Inventory quick look */}
          <div className="bg-white border rounded p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="font-medium">Inventory</div>
              <div className="text-gray-600">SKUs: <span className="font-semibold">{inv.totalSkus}</span></div>
              <div className="text-gray-600">Total Units: <span className="font-semibold">{inv.totalUnits}</span></div>
              <div className="text-amber-600">Low Stock (≤5): <span className="font-semibold">{inv.low}</span></div>
              <div className="text-red-600">Out of Stock: <span className="font-semibold">{inv.oos}</span></div>
            </div>
          </div>

          <div className="bg-white border rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium">Sales Performance</div>
              <div className="text-xs text-gray-500">7 Days</div>
            </div>

            <div className="h-48 grid place-items-center text-gray-400 border rounded">
              Chart placeholder — integrate recharts or chart.js here.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Card({ label, value, hint }) {
  return (
    <div className="bg-white border rounded p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {hint && <div className="text-xs text-green-600 mt-1">{hint}</div>}
    </div>
  );
}