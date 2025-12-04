// /fashion-store/src/pages/ProductPage.jsx
import React, { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import KebabMenu from "../components/KebabMenu";
import ALL_PRODUCTS from "../data/products";
import IKImg from "@/components/IKImg";

/* ---------- helpers ---------- */
const slugify = (s = "") =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const getParamKey = (params, location) => {
  const first = Object.keys(params)[0];
  let key = first ? params[first] : null;
  if (!key && location?.search) {
    const q = new URLSearchParams(location.search);
    key = q.get("id") || q.get("slug") || q.get("key");
  }
  return key ? decodeURIComponent(String(key)) : null;
};

function SizeRecommender({ onPick, product }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fit, setFit] = useState("true");

  const recommend = useMemo(() => {
    const h = Number(height);
    const w = Number(weight);
    const sizes = product?.sizes || [];
    if (!h || !w || !sizes.length) return null;

    const order = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"].filter((s) =>
      sizes.includes(s)
    );
    const mid = Math.floor((order.length - 1) / 2);
    let idx = mid;

    if (h < 165) idx -= 1;
    else if (h > 180) idx += 1;

    if (w < 55) idx -= 1;
    else if (w > 80) idx += 1;
    else if (w > 92) idx += 2;

    if (fit === "relaxed") idx += 1;
    if (fit === "snug") idx -= 1;

    idx = Math.max(0, Math.min(order.length - 1, idx));
    return order[idx] || null;
  }, [height, weight, fit, product?.sizes]);

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
      <div className="font-semibold">Size Recommender</div>
      <div className="grid grid-cols-2 gap-3 mt-2">
        <label className="text-sm">
          Height (cm)
          <input
            className="mt-1 w-full rounded border bg-transparent px-3 py-2"
            value={height}
            onChange={(e) => setHeight(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="e.g. 175"
          />
        </label>
        <label className="text-sm">
          Weight (kg)
          <input
            className="mt-1 w-full rounded border bg-transparent px-3 py-2"
            value={weight}
            onChange={(e) => setWeight(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="e.g. 72"
          />
        </label>
      </div>

      <div className="mt-2 flex gap-2 text-sm">
        {["snug", "true", "relaxed"].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFit(k)}
            className={`px-3 py-1 rounded border ${
              fit === k
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : ""
            }`}
          >
            {k === "true" ? "True to size" : k[0].toUpperCase() + k.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-3 text-sm opacity-80">
        Enter height &amp; weight to get a recommendation.
      </div>

      {recommend && (
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm">
            Recommended size: <span className="font-semibold">{recommend}</span>
          </div>
          <button
            type="button"
            onClick={() => onPick?.(recommend)}
            className="px-3 py-1 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          >
            Pick {recommend}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Carousel helper ---------- */
const ArrowBtn = ({ left = false, onClick }) => (
  <button
    onClick={onClick}
    aria-label={left ? "Previous image" : "Next image"}
    style={{
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      [left ? "left" : "right"]: 12,
      zIndex: 30,
      background: "rgba(255,255,255,0.95)",
      border: "1px solid #e5e5e5",
      borderRadius: "9999px",
      width: 36,
      height: 36,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    }}
  >
    {left ? "‹" : "›"}
  </button>
);

/* ---------- Main Page ---------- */
export default function ProductPage() {
  const params = useParams();
  const location = useLocation();
  const key = getParamKey(params, location);

  const {
    getProductSync,
    products: ctxProducts,
    addToCart,
    toggleWishlist,
    wishlist,
  } = useStore();
  const { show } = useToast();

  const products =
    (Array.isArray(ctxProducts) && ctxProducts.length
      ? ctxProducts
      : ALL_PRODUCTS) || [];

  const product = useMemo(() => {
    if (!key) return null;

    let found =
      typeof getProductSync === "function" ? getProductSync(key) : null;
    if (found) return found;

    const k = String(key).toLowerCase();
    const byAnyKey = (p) => {
      const title = p?.title || p?.name || "";
      const titleSlug = slugify(title);
      return (
        String(p?.id) === String(key) ||
        String(p?.slug || "").toLowerCase() === k ||
        String(p?.handle || "").toLowerCase() === k ||
        String(p?.sku || "").toLowerCase() === k ||
        titleSlug === k
      );
    };
    return products.find(byAnyKey) || null;
  }, [getProductSync, products, key]);

  const topRef = useRef(null);
  useEffect(() => topRef.current?.scrollIntoView({ behavior: "auto" }), [key]);

  if (!product) {
    return (
      <div ref={topRef} className="max-w-6xl mx-auto px-4 py-14 min-h-[60vh]">
        <p className="text-lg font-medium">Product not found.</p>
        <p className="opacity-70 text-sm mt-1">
          Check your link or try again from the catalog.
        </p>
      </div>
    );
  }

  const title = product.title || product.name || "Product";
  const subtitle =
    product.subtitle ||
    ((product.gender || "").toLowerCase() === "women" ? "Women" : "Men");

  const colorList = product.colors || [];
  const swatches = product.colorSwatches || {};
  const [color, setColor] = useState(colorList[0] || "Default");

  // Build images array depending on color selection & fallbacks
  const getImagesForColor = useCallback((p, clr) => {
    if (!p) return [];
    // try imagesByColor first (keys may be 'White' or 'OffWhite' etc.)
    const byColor =
      p.imagesByColor?.[clr] ||
      p.imagesByColor?.[clr === "Off-White" ? "White" : clr];
    if (Array.isArray(byColor) && byColor.length) return byColor;
    if (Array.isArray(p.images) && p.images.length) return p.images;
    if (p.image) return [p.image];
    return [];
  }, []);

  const [images, setImages] = useState(() => getImagesForColor(product, color));
  const [currentIdx, setCurrentIdx] = useState(0);

  // When product or color changes, update images and reset idx
  useEffect(() => {
    const imgs = getImagesForColor(product, color);
    setImages(imgs.length ? imgs : ["/images/placeholder.jpg"]);
    setCurrentIdx(0);
  }, [product, color, getImagesForColor]);

  // cover used by addToCart etc. Keep consistent (current image)
  const cover =
    images?.[currentIdx] || images?.[0] || product.image || "/images/placeholder.jpg";

  const sizeList = product.sizes || ["S", "M", "L", "XL"];
  const [size, setSize] = useState(sizeList[0]);
  useEffect(() => setSize(sizeList[0]), [product, color]);

  const [qty, setQty] = useState(1);

  const wished =
    Array.isArray(wishlist) &&
    wishlist.some((w) => String(w.id) === String(product.id));

  const addItem = () => {
    addToCart?.({
      id: product.id,
      title,
      price: Number(product.price || 0) || 1,
      mrp: Number(product.mrp || product.price || 0) || 1,
      image: cover,
      qty,
      size,
      color,
    });

    show("Added to bag", {
      type: "cart",
      subtitle: `${title}${size ? ` • ${size}` : ""}${
        color ? ` • ${color}` : ""
      }`,
      timeout: 1600,
    });
  };

  const onImgError = (e) => {
    if (e?.target?.src && !e.target.src.endsWith("/images/placeholder.jpg")) {
      e.target.src = "/images/placeholder.jpg";
    }
  };

  /* ---------- Carousel interactions: keyboard & swipe ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft")
        setCurrentIdx((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight")
        setCurrentIdx((i) => (i + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  // touch/mouse swipe
  const carouselRef = useRef(null);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const onTouchStart = (ev) => {
      touchStartX.current = ev.touches?.[0]?.clientX ?? null;
      touchDeltaX.current = 0;
    };
    const onTouchMove = (ev) => {
      if (touchStartX.current == null) return;
      const x = ev.touches?.[0]?.clientX ?? 0;
      touchDeltaX.current = x - touchStartX.current;
    };
    const onTouchEnd = () => {
      if (touchStartX.current == null) return;
      if (Math.abs(touchDeltaX.current) > 50) {
        if (touchDeltaX.current < 0)
          setCurrentIdx((i) => (i + 1) % images.length);
        else setCurrentIdx((i) => (i - 1 + images.length) % images.length);
      }
      touchStartX.current = null;
      touchDeltaX.current = 0;
    };

    // mouse drag support
    let mouseDown = false;
    let mouseStartX = 0;
    const onMouseDown = (m) => {
      mouseDown = true;
      mouseStartX = m.clientX;
    };
    const onMouseMove = (m) => {
      if (!mouseDown) return;
      touchDeltaX.current = m.clientX - mouseStartX;
    };
    const onMouseUp = () => {
      if (!mouseDown) return;
      if (Math.abs(touchDeltaX.current) > 60) {
        if (touchDeltaX.current < 0)
          setCurrentIdx((i) => (i + 1) % images.length);
        else setCurrentIdx((i) => (i - 1 + images.length) % images.length);
      }
      mouseDown = false;
      touchDeltaX.current = 0;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [images.length]);

  return (
    <div ref={topRef} className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm opacity-70">{subtitle}</div>
        <KebabMenu />
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* ---------- Carousel column ---------- */}
        <div>
          <div
            ref={carouselRef}
            style={{
              position: "relative",
              width: "100%",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid #eee",
              background: "#fafafa",
              // responsive height: taller on large screens, smaller on mobile
              minHeight: 520,
              maxHeight: 820,
            }}
          >
            {/* Arrows */}
            {images.length > 1 && (
              <ArrowBtn
                left
                onClick={() =>
                  setCurrentIdx((i) => (i - 1 + images.length) % images.length)
                }
              />
            )}
            {images.length > 1 && (
              <ArrowBtn
                onClick={() =>
                  setCurrentIdx((i) => (i + 1) % images.length)
                }
              />
            )}

            {/* Sliding track (NO inner padding so images can cover) */}
            <div
              aria-roledescription="carousel"
              style={{
                display: "flex",
                width: `${images.length * 100}%`,
                transform: `translateX(${-currentIdx * (100 / images.length)}%)`,
                transition: "transform 260ms ease",
                height: "100%", // ensure track fills container height
              }}
            >
              {images.map((src, i) => (
                <div
                  key={i}
                  style={{
                    minWidth: `${100 / images.length}%`,
                    height: "100%", // make each slide full height
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                    padding: 0,
                    background: "#fff",
                  }}
                >
                  <IKImg
                    src={src}
                    alt={`${title} — ${i + 1}`}
                    className="object-cover"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // COVER makes the image fill the container
                      display: "block",
                    }}
                    onError={onImgError}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 12,
                overflowX: "auto",
                paddingBottom: 4,
              }}
            >
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  style={{
                    border: i === currentIdx ? "2px solid #111" : "1px solid #e5e5e5",
                    padding: 0,
                    borderRadius: 8,
                    width: 84,
                    height: 84,
                    overflow: "hidden",
                    background: "#fff",
                    flex: "0 0 auto",
                  }}
                >
                  <IKImg
                    src={src}
                    alt={`thumb ${i + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---------- Right column (unchanged UI) ---------- */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>

          <div className="mt-1 flex items-center gap-3">
            <div className="text-xl md:text-2xl font-semibold">
              ₹{product.price}
            </div>
            {product.mrp && product.mrp > product.price && (
              <div className="opacity-60 line-through">₹{product.mrp}</div>
            )}
          </div>

          {colorList.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium">
                Color: <span className="opacity-80">{color}</span>
              </div>
              <div className="flex gap-2 mt-2">
                {colorList.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-7 w-7 rounded-full border ${
                      color === c ? "ring-2 ring-offset-2 ring-black" : ""
                    }`}
                    title={c}
                    aria-label={c}
                    style={{ background: swatches[c] || "#e5e5e5" }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <div className="text-sm font-medium">Size</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {sizeList.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded border ${
                    size === s
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : ""
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium">Quantity</div>
            <div className="inline-flex items-center border rounded mt-2">
              <button
                type="button"
                className="px-3 py-1"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <input
                className="w-16 text-center py-1 bg-transparent outline-none"
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))
                }
              />
              <button
                type="button"
                className="px-3 py-1"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={addItem}
              className="px-5 py-2 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => {
                addItem();
                show("Item added — proceed to checkout", {
                  type: "cart",
                  timeout: 1400,
                });
              }}
              className="px-5 py-2 rounded border"
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={() => {
                const wasWished =
                  Array.isArray(wishlist) &&
                  wishlist.some((w) => String(w.id) === String(product.id));
                toggleWishlist?.({
                  id: product.id,
                  title,
                  price: product.price,
                  image: cover,
                });
                show(
                  wasWished ? "Removed from wishlist" : "Added to wishlist",
                  { type: "wish", subtitle: title, timeout: 1600 }
                );
              }}
              className={`px-5 py-2 rounded border ${
                wished ? "bg-rose-600 text-white border-rose-600" : ""
              }`}
            >
              {wished ? "Wishlisted" : "Wishlist"}
            </button>
          </div>

          <div className="mt-6">
            <SizeRecommender product={product} onPick={(s) => setSize(s)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 text-sm">
            <ul className="space-y-1 list-disc list-inside">
              {(
                product.highlightsLeft || [
                  "Cotton-rich terry",
                  "Secure zip pocket",
                ]
              ).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <ul className="space-y-1 list-disc list-inside">
              {(
                product.highlightsRight || [
                  "Elastic waist w/ drawcord",
                  "Tapered ankle",
                ]
              ).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 space-y-3">
            <details className="rounded border p-4" open>
              <summary className="cursor-pointer font-medium">Description</summary>
              <p className="mt-2 text-sm opacity-90">
                {product.description ||
                  "Tapered joggers with a clean silhouette—soft on skin, structured enough to hold shape. Zippered pocket keeps essentials secure."}
              </p>
            </details>

            <details className="rounded border p-4">
              <summary className="cursor-pointer font-medium">Size Chart</summary>
              <p className="mt-2 text-sm opacity-90">
                Model is 5'9" wearing size M. Measure around chest &amp; waist for the best fit.
              </p>
            </details>

            <details className="rounded border p-4">
              <summary className="cursor-pointer font-medium">Fabric &amp; Care</summary>
              <ul className="mt-2 text-sm opacity-90 list-disc list-inside space-y-1">
                <li>Fabric: 100% Cotton, 220 GSM</li>
                <li>Machine wash cold with like colours</li>
                <li>Do not bleach</li>
                <li>Line dry in shade</li>
                <li>Cool iron on reverse; do not iron on print</li>
              </ul>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
