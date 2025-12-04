// src/pages/Wishlist.jsx
import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import ALL_PRODUCTS from "../data/products";
import { useToast } from "../context/ToastContext";

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(Number(n || 0))));

export default function Wishlist() {
  const { wishlist = [], toggleWishlist, addToCart, openMiniCart, getProductSync } = useStore();
  const { show } = useToast();
  const nav = useNavigate();

  // Hydrate wishlist items with product data; drop any we can’t resolve at all
  const items = useMemo(() => {
    const arr = Array.isArray(wishlist) ? wishlist : [];
    return arr
      .map((w) => {
        const id = w?.id ?? w?.slug ?? w?.handle ?? w?.sku ?? null;
        if (!id) return null;

        // try live store first
        const live = typeof getProductSync === "function" ? getProductSync(id) : null;
        // fallback to static dataset
        const fallback =
          (ALL_PRODUCTS || []).find(
            (p) =>
              String(p.id) === String(id) ||
              String(p.slug || "") === String(id) ||
              String(p.handle || "") === String(id) ||
              String(p.sku || "") === String(id)
          ) || null;

        const p = live || fallback || {};

        const title = p.title || p.name || w.title || "Product";
        const price = Number(p.price ?? w.price ?? 0) || 0;
        const cover =
          p.imagesByColor?.[p.colors?.[0] || ""]?.[0] ||
          (Array.isArray(p.images) ? p.images[0] : null) ||
          p.image ||
          p.cover ||
          w.image ||
          "/images/placeholder.jpg";

        return {
          id,
          title,
          price,
          image: cover,
        };
      })
      .filter(Boolean); // remove null/failed ones
  }, [wishlist, getProductSync]);

  if (!items.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-14">
        <h1 className="text-2xl font-bold mb-3">Your Wishlist</h1>
        <p className="opacity-70 mb-6">You haven’t saved any products yet.</p>
        <div className="flex gap-3">
          <Link to="/women" className="px-4 py-2 rounded bg-black text-white">
            Shop Women
          </Link>
          <Link to="/men" className="px-4 py-2 rounded border">
            Shop Men
          </Link>
        </div>
      </div>
    );
  }

  const onImgError = (e) => {
    if (e?.target?.src && !e.target.src.endsWith("/images/placeholder.jpg")) {
      e.target.src = "/images/placeholder.jpg";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {items.map((it, idx) => {
          const key = `${it.id}-${idx}`;
          return (
            <div key={key} className="group border rounded-xl overflow-hidden">
              <img
                src={it.image}
                alt={it.title}
                className="w-full aspect-[3/4] object-cover"
                onError={onImgError}
                loading="lazy"
              />
              <div className="p-3">
                <div className="font-semibold line-clamp-1">{it.title}</div>
                <div className="text-sm opacity-70 mb-3">{formatINR(it.price)}</div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 px-3 py-2 rounded bg-black text-white text-sm"
                    onClick={() => {
                      addToCart?.({
                        id: it.id,
                        title: it.title,
                        price: it.price,
                        image: it.image,
                        qty: 1,
                      });
                      show?.("Added to bag", { type: "cart", subtitle: it.title, timeout: 1600 });
                      openMiniCart?.();
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="px-3 py-2 rounded border text-sm"
                    onClick={() => {
                      toggleWishlist?.({ id: it.id });
                      show?.("Removed from wishlist", { type: "wish", subtitle: it.title, timeout: 1200 });
                    }}
                  >
                    Remove
                  </button>
                </div>

                <button
                  className="mt-2 w-full px-3 py-2 rounded border text-sm"
                  onClick={() => nav(`/product/${encodeURIComponent(it.id)}`)}
                >
                  View Product
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
