import { useEffect, useRef, useState } from "react";

export default function Carousel({
  items = [],
  render,
  autoplayMs = 4500,
  showDots = true,
  showArrows = true,
  className = "",
}) {
  const [i, setI] = useState(0);
  const timer = useRef(null);
  const hovering = useRef(false);

  const go = (n) => setI((prev) => (n + items.length) % items.length);
  const next = () => go(i + 1);
  const prev = () => go(i - 1);

  useEffect(() => {
    if (items.length <= 1) return;
    clearTimeout(timer.current);
    const dur = Number(items[i]?.durationMs || autoplayMs);
    timer.current = setTimeout(() => {
      if (!hovering.current) next();
    }, Math.max(1000, dur));
    return () => clearTimeout(timer.current);
  }, [i, items, autoplayMs]);

  const onMouseEnter = () => (hovering.current = true);
  const onMouseLeave = () => (hovering.current = false);

  // touch-swipe
  const touch = useRef({ x: 0, active: false });
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, active: true };
  };
  const onTouchMove = (e) => {
    if (!touch.current.active) return;
    const dx = e.touches[0].clientX - touch.current.x;
    if (Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
      touch.current.active = false;
    }
  };
  const onTouchEnd = () => (touch.current.active = false);

  return (
    <div
      className={`relative overflow-hidden h-full ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="carousel"
    >
      <div
        className="whitespace-nowrap transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {items.map((item, idx) => (
          <div key={idx} className="inline-block align-top w-full h-full" aria-hidden={i !== idx}>
            {render(item, idx)}
          </div>
        ))}
      </div>

      {showArrows && items.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute z-10 left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white px-3 py-2 hover:bg-black/70"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute z-10 right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white px-3 py-2 hover:bg-black/70"
          >
            ›
          </button>
        </>
      )}

      {showDots && items.length > 1 && (
        <div className="absolute z-10 bottom-3 left-0 right-0 flex justify-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 w-2 rounded-full ${idx === i ? "bg-white" : "bg-white/60"} border border-white/60`}
              onClick={(e) => { e.stopPropagation(); go(idx); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
