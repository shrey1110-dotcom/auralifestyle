// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const toastCtx = useToast();
  const show = toastCtx?.show || (() => {});

  if (!product) return null;

  // prefer color images if present
  const cover =
    product.imagesByColor?.[product.colors?.[0]]?.[0] ||
    product.images?.[0] ||
    product.image ||
    product.cover ||
    "/images/placeholder.jpg";

  const id = product.id;
  const title = product.title || product.name || "Product";
  const wished = Array.isArray(wishlist) && wishlist.some((w) => String(w.id) === String(id));

  return (
    <div className="group border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900">
      <Link to={`/product/${encodeURIComponent(id)}`}>
        <div className="aspect-[3/4] w-full overflow-hidden">
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-3">
        <h3 className="font-semibold line-clamp-1">{title}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-bold">₹{product.price}</span>
          {product.mrp && (
            <span className="text-sm line-through text-neutral-500">₹{product.mrp}</span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => {
              addToCart({ id, title, price: product.price, image: cover, qty: 1, size: "M", color: product.colors?.[0] });
              show("Added to cart", { type: "success" });
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>

          <button
            onClick={() => {
              toggleWishlist({ id, title, price: product.price, image: cover });
              show(wished ? "Removed from wishlist" : "Added to wishlist", { type: "success" });
            }}
            className={`h-10 w-10 rounded border flex items-center justify-center ${
              wished
                ? "bg-red-500 text-white border-red-500"
                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
            }`}
            aria-label="wishlist"
            title="Wishlist"
          >
            <Heart size={18} fill={wished ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}
