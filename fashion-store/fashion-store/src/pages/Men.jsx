import React, { useMemo } from "react";
import { useStore } from "../context/StoreContext";
import ALL from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Men() {
  const { products } = useStore();

  const list = useMemo(() => {
    const source = Array.isArray(products) && products.length ? products : ALL;
    return (source || []).filter(
      (p) => (p.gender || "").toString().toLowerCase() === "men"
    );
  }, [products]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Men</h1>
      {list.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {list.map((p) => (
            <ProductCard key={p.id || p.slug || p.title || p.name} product={p} />
          ))}
        </div>
      ) : (
        <div className="opacity-70">No products found.</div>
      )}
    </div>
  );
}
