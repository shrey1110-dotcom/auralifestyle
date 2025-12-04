import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Two independent panels side by side:
 * - Left: WOMEN
 * - Right: MEN
 * Each has a tiny slider (fade), arrows, and a SHOP NOW button.
 * Designed to NEVER overlap the next sections.
 */
export default function SplitGenderHero() {
  const nav = useNavigate();

  // Swap these file names if your files differ (use exact public /images names)
  const womenSlides = [
    "/images/home_women.png", // or your "home_women" file
    "/images/W-07 f.png",
    "/images/W-06 f.png",
  ];

  const menSlides = [
    "/images/home_men.png", // or your "home_men" file
    "/images/M-10.png",
    "/images/M-09.png",
  ];

  const [wi, setWi] = useState(0);
  const [mi, setMi] = useState(0);

  const nextW = () => setWi((i) => (i + 1) % womenSlides.length);
  const prevW = () => setWi((i) => (i - 1 + womenSlides.length) % womenSlides.length);
  const nextM = () => setMi((i) => (i + 1) % menSlides.length);
  const prevM = () => setMi((i) => (i - 1 + menSlides.length) % menSlides.length);

  return (
    <div className="mx-auto max-w-[1400px] w-full px-0 sm:px-0 lg:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
        {/* WOMEN PANEL */}
        <Panel
          label="WOMEN"
          slides={womenSlides}
          index={wi}
          onPrev={prevW}
          onNext={nextW}
          onShop={() => nav("/women")}
        />

        {/* MEN PANEL */}
        <Panel
          label="MEN"
          slides={menSlides}
          index={mi}
          onPrev={prevM}
          onNext={nextM}
          onShop={() => nav("/men")}
        />
      </div>
    </div>
  );
}

/* ---- sub-component: one side ---- */
function Panel({ label, slides, index, onPrev, onNext, onShop }) {
  return (
    <div className="relative h-[70vh] sm:h-[78vh] lg:h-[86vh] overflow-hidden">
      {/* Slides */}
      {slides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${label} slide`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          draggable={false}
        />
      ))}

      {/* Arrows: white background so they stay visible over bright or dark images */}
      <button
        aria-label={`prev-${label}`}
        onClick={onPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/95 text-black shadow hover:bg-white"
      >
        <ChevronLeft className="mx-auto" />
      </button>
      <button
        aria-label={`next-${label}`}
        onClick={onNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/95 text-black shadow hover:bg-white"
      >
        <ChevronRight className="mx-auto" />
      </button>

      {/* Title + CTA. Tucked safely near the bottom-left, not too low so it never touches page edge */}
      <div className="absolute bottom-12 left-8">
        <h2 className="text-white drop-shadow-md text-4xl sm:text-5xl font-extrabold">
          {label}
        </h2>
        <button
          onClick={onShop}
          className="mt-3 px-6 py-2.5 rounded-full bg-white text-black font-semibold shadow"
        >
          SHOP NOW
        </button>
      </div>
    </div>
  );
}
