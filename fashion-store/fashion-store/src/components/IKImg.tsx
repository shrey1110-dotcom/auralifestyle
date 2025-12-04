// src/components/IKImg.tsx
import React, { useMemo, useState } from "react";

/**
 * IKImg
 * - src: path like "/images/foo.png" or full URL "https://..." or already-IK path
 * - className, alt, ...rest forwarded to <img>
 * - forceLocal: boolean to force using local src even when base is configured
 *
 * Behavior:
 * - In dev (import.meta.env.DEV) or when VITE_IK_BASE_URL is missing, uses local `src`.
 * - Otherwise builds `${base}${mappedPath}${transform}` for ImageKit.
 * - If remote fails (onError) it falls back to local `src`.
 */
export default function IKImg({
  src = "",
  alt = "",
  className = "",
  forceLocal = false,
  transform = "?tr=f-auto,q-80",
  ...rest
}) {
  const base = (import.meta.env.VITE_IK_BASE_URL || "").replace(/\/$/, "");
  const isDev = Boolean(import.meta.env.DEV);

  // whether to start in local mode (dev or no base or forced)
  const [useLocal, setUseLocal] = useState(() => isDev || !base || !!forceLocal);

  const buildIKPath = (p) => {
    if (!p || typeof p !== "string") return p;
    // Already absolute (http/https) — return as-is
    if (/^https?:\/\//i.test(p)) return p;
    // If it already looks like an IK path (e.g., starts with '/site' or '/uploads'), leave it
    // Adjust this rule if your ImageKit origin expects a different prefix
    if (p.startsWith("/site/") || p.startsWith("/uploads/") || p.startsWith("/images/")) {
      // IMPORTANT: if your ImageKit expects no '/site' prefix, change this mapping
      // Many setups use base + p (i.e. base + '/images/foo.png').
      return p;
    }
    // default: return as-is
    return p;
  };

  const url = useMemo(() => {
    if (!src) return "";
    if (useLocal) return src;
    // remote: base + mapped path, preserving existing query string
    const mapped = buildIKPath(src);
    // if mapped already contains "?" then append transform with "&"
    const sep = mapped.includes("?") ? "&" : "";
    return `${base}${mapped}${transform ? sep + transform.replace(/^\?/, "") : ""}`;
  }, [src, base, useLocal, transform]);

  // Helpful dev log when mapping might be suspicious
  if (isDev && !useLocal && src && base && src.startsWith("/images/")) {
    // warn once by side-effect (console)
    try {
      // --- FIX APPLIED HERE ---
      if (typeof window !== "undefined" && !(window as any).__IKIMG_WARNED) {
        console.info(
          "[IKImg] dev mode building IK URL:",
          `${base}${buildIKPath(src)}${
            transform ? (src.includes("?") ? "&" : "?") + transform.replace(/^\?/, "") : ""
          }`
        );
        // --- AND FIX APPLIED HERE ---
        (window as any).__IKIMG_WARNED = true;
      }
    } catch {}
  }

  // onError fall back to local
  function handleErr(e) {
    // if already local, nothing to do
    if (useLocal) return;
    setUseLocal(true);
  }

  // ensure alt is set
  const a = alt || "";

  return (
    <img
      src={url || src}
      alt={a}
      className={className}
      onError={handleErr}
      decoding="async"
      loading="lazy"
      {...rest}
    />
  );
}