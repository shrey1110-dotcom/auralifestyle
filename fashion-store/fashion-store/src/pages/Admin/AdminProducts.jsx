// src/pages/Admin/AdminProducts.jsx
import React, { useEffect, useState, useMemo } from "react";
import { adminApi, productsApi } from "@/lib/api";
import { getAuthToken } from "@/lib/api";

// ---------- Local dummy data (used if APIs fail or return empty) ----------
const DUMMY_PRODUCTS = [
  { id: "P-101", sku: "SQD-HOOD-RED-S", title: "Squid Game Hoodie — Red", price: 1299, stock: 18, image: "https://picsum.photos/seed/squid/400/400" },
  { id: "P-102", sku: "DMS-SLYR-BLK-M", title: "Demon Slayer Tee — Black", price: 799, stock: 42, image: "https://picsum.photos/seed/demon/400/400" },
  { id: "P-103", sku: "HP-PTTR-GRN-L", title: "Potterhead Hoodie — Slytherin", price: 1499, stock: 5, image: "https://picsum.photos/seed/harry/400/400" },
  { id: "P-104", sku: "ANM-MIX-BLU-XL", title: "Anime Mashup Tee — Blue", price: 699, stock: 0, image: "https://picsum.photos/seed/mash/400/400" },
  { id: "P-105", sku: "NRTO-FOX-ORG-M", title: "Naruto Kurama Hoodie — Orange", price: 1399, stock: 23, image: "https://picsum.photos/seed/naruto/400/400" },
  { id: "P-106", sku: "OP-STRW-BLK-S", title: "One Piece Straw Hat Tee — Black", price: 749, stock: 9, image: "https://picsum.photos/seed/onepiece/400/400" },
  { id: "P-107", sku: "JKR-PINK-OVR", title: "JJK Pink Oversize Tee", price: 899, stock: 31, image: "https://picsum.photos/seed/jjk/400/400" },
  { id: "P-108", sku: "ATK-TN-BLK-M", title: "Attack Titan Tee — Black", price: 849, stock: 2, image: "https://picsum.photos/seed/aot/400/400" },
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

async function call(path, { method = "GET", json } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(path, { method, headers, body: json ? JSON.stringify(json) : undefined, credentials: "include" });
  if (!res.ok) {
    let e = `HTTP ${res.status}`;
    try { const p = await res.json(); e = p.message || e; } catch {}
    throw new Error(e);
  }
  return res.json();
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [err, setErr] = useState("");

  // Derived Inventory placeholder metrics
  const inventoryStats = useMemo(() => {
    const totalSkus = products.length;
    const totalUnits = products.reduce((a, p) => a + (Number(p.stock) || 0), 0);
    const lowStock = products.filter((p) => (p.stock ?? 0) > 0 && p.stock <= 5).length;
    const outOfStock = products.filter((p) => (p.stock ?? 0) === 0).length;
    return { totalSkus, totalUnits, lowStock, outOfStock };
  }, [products]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // 1) Try adminApi.products()
        let list;
        try {
          const r = await adminApi.products();
          list = r?.items || r?.products || r || [];
        } catch {
          // 2) Fallback to productsApi.list()
          const r2 = await productsApi.list({ limit: 48 });
          list = r2?.items || r2 || [];
        }
        // 3) If still empty, use dummy products
        if (!Array.isArray(list) || list.length === 0) {
          list = DUMMY_PRODUCTS;
        }
        setProducts(list);
      } catch (e) {
        setErr(e.message || "Failed to load products");
        setProducts(DUMMY_PRODUCTS); // ensure UI isn't empty
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --- CSV upload placeholder ---
  async function handleCsvUpload(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    alert("CSV upload not implemented — upload to backend or process client-side.");
    e.target.value = "";
  }
  function openImageManager() {
    alert("Image Manager placeholder — wire this to your asset library or CDN.");
  }

  async function viewPurchases(p) {
    setSelectedProduct(p);
    setPurchases([]);
    setErr("");
    try {
      // Try real admin orders
      const r = await call("/api/admin/orders").catch(() => null);
      let list = (r?.items || r?.orders || r) || [];
      // If nothing returned, use dummy orders
      if (!Array.isArray(list) || list.length === 0) list = DUMMY_ORDERS;

      const idOrName = String(p.sku || p.id || p.title || p.name).toLowerCase();
      const filtered = (list || []).filter((o) =>
        (o.items || []).some((it) =>
          String(it.sku || it.id || it.productId || it.title || it.name)
            .toLowerCase()
            .includes(idOrName)
        )
      );
      setPurchases(filtered);
    } catch (e) {
      setErr(e.message || "Failed to fetch purchases");
      // show at least dummy filtered results
      const idOrName = String(p.sku || p.id || p.title || p.name).toLowerCase();
      const filtered = DUMMY_ORDERS.filter((o) =>
        (o.items || []).some((it) =>
          String(it.sku || it.id || it.productId || it.title || it.name).toLowerCase().includes(idOrName)
        )
      );
      setPurchases(filtered);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Products</h3>
        <div className="flex items-center gap-2">
          <input id="csv-upload" type="file" accept=".csv" style={{ display: "none" }} onChange={handleCsvUpload} />
          <button onClick={() => document.getElementById("csv-upload").click()} className="px-3 py-2 border rounded text-sm">Bulk Upload CSV</button>
          <button onClick={openImageManager} className="px-3 py-2 border rounded text-sm">Image Manager</button>
          <button className="px-3 py-2 bg-red-600 text-white rounded text-sm">+ Add Product</button>
        </div>
      </div>

      {/* Inventory placeholder (visible + computed from products) */}
      <div className="mb-4 bg-white border rounded p-3 flex flex-wrap gap-4 text-sm">
        <div className="font-medium">Inventory</div>
        <div className="text-gray-600">SKUs: <span className="font-semibold">{inventoryStats.totalSkus}</span></div>
        <div className="text-gray-600">Total Units: <span className="font-semibold">{inventoryStats.totalUnits}</span></div>
        <div className="text-amber-600">Low Stock (≤5): <span className="font-semibold">{inventoryStats.lowStock}</span></div>
        <div className="text-red-600">Out of Stock: <span className="font-semibold">{inventoryStats.outOfStock}</span></div>
      </div>

      {err && <div className="text-red-600 mb-2">{err}</div>}

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border rounded p-3 animate-pulse h-48" />
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full text-gray-500">No products found.</div>
        ) : (
          products.map((p) => (
            <div key={p._id || p.id} className="bg-white border rounded p-3 flex flex-col">
              <div className="aspect-square bg-gray-100 mb-2 overflow-hidden">
                {p.image ? <img src={p.image} alt={p.title || p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-gray-400">No Image</div>}
              </div>
              <div className="flex-1">
                <div className="font-medium">{p.title || p.name}</div>
                <div className="text-sm text-gray-500">SKU: {p.sku || "-"}</div>
                <div className="text-sm text-gray-700 mt-2">₹{p.price}</div>
                {"stock" in p && (
                  <div className={`text-xs mt-1 ${p.stock === 0 ? "text-red-600" : p.stock <= 5 ? "text-amber-600" : "text-gray-500"}`}>
                    Stock: {p.stock}
                  </div>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                <button onClick={() => viewPurchases(p)} className="flex-1 px-3 py-1 border rounded text-sm">View Purchases</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded text-sm">Edit</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Purchases Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 px-4">
          <div className="bg-white rounded-lg shadow max-w-3xl w-full max-h-[90vh] overflow-auto p-4">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex gap-4">
                <div className="w-28 h-28 bg-gray-100 overflow-hidden rounded">
                  {selectedProduct.image ? (
                    <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.title || selectedProduct.name} />
                  ) : null}
                </div>
                <div>
                  <div className="font-semibold text-lg">{selectedProduct.title || selectedProduct.name}</div>
                  <div className="text-sm text-gray-500">SKU: {selectedProduct.sku || "-"}</div>
                  <div className="mt-2">₹{selectedProduct.price}</div>
                </div>
              </div>

              <div>
                <button onClick={() => { setSelectedProduct(null); setPurchases([]); }} className="px-3 py-1 border rounded">Close</button>
              </div>
            </div>

            <h4 className="font-semibold mb-2">Recent Purchases</h4>
            {purchases.length === 0 ? (
              <div className="text-gray-500">No purchases found for this product.</div>
            ) : (
              <div className="space-y-2">
                {purchases.map((o) => (
                  <div key={o._id || o.orderNumber} className="p-3 border rounded flex justify-between items-center">
                    <div>
                      <div className="font-medium">{o.orderNumber || o._id}</div>
                      <div className="text-sm text-gray-500">{(o.customer && o.customer.name) || (o.address && o.address.fullName) || "Customer"}</div>
                      <div className="text-xs text-gray-400">{new Date(o.createdAt || Date.now()).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div>Qty: {(o.items || []).reduce((acc, it) => acc + (it.qty || 0), 0)}</div>
                      <div>₹{Number(o.total || o.sub || 0).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
