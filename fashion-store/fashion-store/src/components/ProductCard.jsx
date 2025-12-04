import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import IKImg from "@/components/IKImg";

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
    .format(Math.max(0, Math.round(Number(n || 0))));

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist = [] } = useStore();
  const { show } = useToast();

  if (!product) return null;

  const id = product.id ?? product.slug ?? product.handle ?? product.sku ?? product.title ?? product.name;
  const title = product.title || product.name || "Product";
  const price = Number(product.price || 0) || 0;
  const mrp = Number(product.mrp || product.price || 0) || 0;

  const cover =
    product.imagesByColor?.[product.colors?.[0] || ""]?.[0] ||
    (Array.isArray(product.images) ? product.images[0] : null) ||
    product.image ||
    product.cover ||
    "/images/placeholder.jpg";

  const wished = Array.isArray(wishlist) && wishlist.some((w) => String(w.id) === String(product.id));

  const onAdd = () => {
    addToCart?.({
      id: product.id,
      title,
      price,
      mrp,
      image: cover,
      qty: 1,
      size: "",
      color: "",
    });
    show?.("Added to bag", { type: "cart", subtitle: title, timeout: 1600 });
    if (wished) {
      show?.({ title: "In your wishlist", subtitle: title, type: "wish", timeout: 1400 });
    }
  };

  const onToggleWish = () => {
    const was = Array.isArray(wishlist) && wishlist.some((w) => String(w.id) === String(product.id));
    toggleWishlist?.({ id: product.id, title, price, image: cover });
    show?.(was ? "Removed from wishlist" : "Added to wishlist", {
      type: "wish",
      subtitle: title,
      timeout: 1600,
    });
  };

  const onImgError = (e) => {
    if (e?.target?.src && !e.target.src.endsWith("/images/placeholder.jpg")) {
      e.target.src = "/images/placeholder.jpg";
    }
  };

  return (
    <div className="group rounded-xl overflow-hidden border hover:shadow-sm transition bg-white dark:bg-neutral-900">
      <Link to={`/product/${encodeURIComponent(product.id ?? product.slug ?? id)}`} className="block">
        <IKImg
          src={cover}
          alt={title}
          className="aspect-[3/4] w-full object-cover"
          width={640}
          height={800}
          sizes="(max-width:768px) 50vw, 25vw"
          onError={onImgError}
        />
      </Link>

      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-medium truncate">{title}</div>
            <div className="text-sm mt-0.5">
              {formatINR(price)}{" "}
              {mrp > price ? <span className="opacity-60 line-through ml-1">{formatINR(mrp)}</span> : null}
            </div>
          </div>

          <button
            aria-label="Wishlist"
            onClick={onToggleWish}
            className={`h-9 w-9 shrink-0 rounded-full border grid place-items-center 
              ${wished ? "bg-rose-600 border-rose-600 text-white" : "hover:bg-neutral-50"}`}
            title={wished ? "Wishlisted" : "Wishlist"}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 21s-6.716-4.35-9.428-7.06A6 6 0 1 1 12 6.586 6 6 0 1 1 21.428 13.94C18.716 16.65 12 21 12 21z" />
            </svg>
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <Link
            to={`/product/${encodeURIComponent(product.id ?? product.slug ?? id)}`}
            className="text-sm underline inline-flex items-center gap-1"
          >
            VIEW
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <button
            onClick={onAdd}
            className="h-9 px-3 rounded-md bg-neutral-900 text-white text-sm inline-flex items-center gap-1.5 dark:bg-white dark:text-neutral-900"
          >
            ADD
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
