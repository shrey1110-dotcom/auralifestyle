// src/pages/Admin/AdminInventory.jsx
import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [qty, setQty] = useState(10);
  const [err, setErr] = useState("");
  const [opLoading, setOpLoading] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    setLoading(true);
    setErr("");
    try {
      const res = await adminApi.inventoryList().catch(() => null);
      const list = (res?.items || res) || [];
      if (!list.length) {
        // fallback: sample
        setItems(sampleInventory());
      } else setItems(list);
    } catch (e) {
      setErr(e.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(sku) {
    setSelected((p) => (p.includes(sku) ? p.filter((x) => x !== sku) : [...p, sku]));
  }

  async function restockOne(sku, q) {
    setOpLoading(true);
    try {
      await adminApi.restock({ sku, qty: Number(q) || 0 });
      await fetchInventory();
    } catch (e) {
      alert(e.message || "Restock failed");
    } finally {
      setOpLoading(false);
    }
  }

  async function restockSelected() {
    if (!selected.length) return alert("Select SKUs to restock");
    if (!confirm(`Restock ${selected.length} items with ${qty} each?`)) return;
    setOpLoading(true);
    try {
      // call restock for each (or implement bulk restock backend)
      for (const s of selected) {
        await adminApi.restock({ sku: s, qty: Number(qty) || 0 });
      }
      setSelected([]);
      await fetchInventory();
    } catch (e) {
      alert(e.message || "Bulk restock failed");
    } finally {
      setOpLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Inventory</h3>
        <div className="flex items-center gap-2">
          <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="border rounded px-2 py-1 text-sm w-24" />
          <button onClick={restockSelected} disabled={opLoading} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Restock selected</button>
        </div>
      </div>

      {err && <div className="text-red-600 mb-3">{err}</div>}

      <div className="bg-white border rounded">
        {loading ? (
          <div className="p-4">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-gray-500">No inventory items.</div>
        ) : (
          items.map((it) => (
            <div key={it.sku || it._id || it.id} className="p-3 flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={selected.includes(it.sku)} onChange={() => toggleSelect(it.sku)} />
                <div>
                  <div className="font-medium">{it.title || it.name}</div>
                  <div className="text-sm text-gray-500">SKU: {it.sku}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`px-2 py-1 rounded text-sm ${it.stock <= 5 ? "bg-rose-50 text-rose-600" : "bg-green-50 text-green-700"}`}>
                  Stock: {it.stock ?? "-"}
                </div>
                <input type="number" defaultValue={10} className="w-20 border rounded px-2 py-1 text-sm" id={`qty-${it.sku}`} />
                <button onClick={() => restockOne(it.sku, document.getElementById(`qty-${it.sku}`).value)} className="px-3 py-1 border rounded text-sm">Restock</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function sampleInventory() {
  return [
    { sku: "M-01", title: "Aura Basic Tee", stock: 2 },
    { sku: "M-02", title: "Squid Hoodie", stock: 14 },
    { sku: "W-01", title: "Harry Hoodie", stock: 0 },
  ];
}
