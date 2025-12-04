import { useState } from "react";

/**
 * <SafeImg src= alt= className= fallbackSeed= />
 * - shows a deterministic Picsum fallback if the image fails
 * - never collapses; keeps aspect via object-cover
 */
export default function SafeImg({ src, alt = "", className = "", fallbackSeed = "fallback-1" }) {
  const [s, setS] = useState(src);
  return (
    <img
      src={s}
      alt={alt}
      loading="lazy"
      onError={() => setS(`https://picsum.photos/seed/${encodeURIComponent(fallbackSeed)}/1200/800`)}
      className={className}
    />
  );
}
