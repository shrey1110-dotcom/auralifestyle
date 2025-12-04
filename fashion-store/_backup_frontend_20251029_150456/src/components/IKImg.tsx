// src/components/IKImg.jsx
import React, { useState } from "react";

export default function IKImg({ src = "", alt = "", className = "", ...rest }) {
  const base = import.meta.env.VITE_IK_BASE_URL?.replace(/\/$/, ""); 
  // e.g. VITE_IK_BASE_URL=https://ik.imagekit.io/vlhplkrcvc
  const isDev = import.meta.env.DEV || !base;

  // map /images/... -> /site/images/... on ImageKit (adjust if your folder differs)
  const toIK = (p) => {
    if (!p.startsWith("/")) return p;
    if (p.startsWith("/images/")) return `/site${p}`;
    return p;
  };

  const [useLocal, setUseLocal] = useState(isDev);
  const ikUrl = base ? `${base}${toIK(src)}?tr=f-auto,q-80` : src;
  const url = useLocal ? src : ikUrl;

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      onError={() => setUseLocal(true)} // fallback to local if IK 404s
      {...rest}
    />
  );
}
