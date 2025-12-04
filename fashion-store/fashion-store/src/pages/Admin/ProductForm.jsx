// src/pages/Admin/ProductForm.jsx
import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductForm() {
  const { id } = useParams(); // id === "new" for new product
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    price: "",
    mrp: "",
    sku: "",
    sizes: ["S", "M", "L"],
    colors: [],
    image: "",
    images: [],
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!id || id === "new") return;
    (async () => {
      setLoading(true);
      try {
        const res = await adminApi.products();
        // if your admin products API supports /admin/products/:id implement detail fetch
        // fallback: find from list
        const found = (res?.items || res?.products || []).find((p) => String(p._id || p.id) === String(id));
        if (found) setProduct(found);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function save() {
    setMsg("");
    setLoading(true);
    try {
      const payload = {
        ...product,
      };
      if (id && id !== "new") {
        await adminApi.updateProduct(id, payload);
      } else {
        await adminApi.addProduct(payload);
      }
      navigate("/admin/products");
    } catch (e) {
      setMsg(e?.payload?.message || e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{id === "new" ? "Add Product" : "Edit Product"}</h3>

      <div className="bg-white border rounded p-4 max-w-2xl">
        <label className="block mb-2 text-sm">
          Title
          <input value={product.title} onChange={(e) => setProduct({ ...product, title: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block mb-2 text-sm">
            Price
            <input value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
          </label>
          <label className="block mb-2 text-sm">
            MRP
            <input value={product.mrp} onChange={(e) => setProduct({ ...product, mrp: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
          </label>
        </div>

        <label className="block mb-2 text-sm">
          SKU
          <input value={product.sku} onChange={(e) => setProduct({ ...product, sku: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
        </label>

        <label className="block mb-2 text-sm">
          Image URL
          <input value={product.image} onChange={(e) => setProduct({ ...product, image: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
        </label>

        <label className="block mb-2 text-sm">
          Description
          <textarea value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" rows={4} />
        </label>

        {msg && <div className="text-sm text-red-600 mb-2">{msg}</div>}

        <div className="flex gap-2">
          <button onClick={save} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded">{loading ? "Saving..." : "Save"}</button>
          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}
