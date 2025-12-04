import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Two independent carousels side by side:
 * - Left: Women
 * - Right: Men
 * Each panel has its own arrow controls and a "SHOP NOW" button.
 */
export default function GenderPreviewCarousel() {
  const nav = useNavigate();

  const womenSlides = [
    "/images/home_women.png",
    "/images/W-07 f.png",
    "/images/W-06 f.png",
  ];
  const menSlides = [
    "/images/home_men.png",
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
    <section className="mx-auto max-w-[1400px] px-0 sm:px-0 lg:px-0 my-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
        {/* WOMEN */}
        <div className="relative h-[70vh] sm:h-[78vh] lg:h-[86vh] overflow-hidden">
          {womenSlides.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="women slide"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                i === wi ? "opacity-100" : "opacity-0"
              }`}
              draggable={false}
            />
          ))}

          {/* arrows (black on white for visibility on light areas) */}
          <button
            aria-label="prev-women"
            onClick={prevW}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/95 text-black shadow hover:bg-white"
          >
            <ChevronLeft className="mx-auto" />
          </button>
          <button
            aria-label="next-women"
            onClick={nextW}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/95 text-black shadow hover:bg-white"
          >
            <ChevronRight className="mx-auto" />
          </button>

          {/* label + CTA (bottom-left) */}
          <div className="absolute bottom-10 left-8">
            <h2 className="text-white/95 text-4xl sm:text-5xl font-extrabold drop-shadow">
              WOMEN
            </h2>
            <button
              className="mt-3 px-5 py-2 rounded-full bg-white text-black font-semibold shadow"
              onClick={() => nav("/women")}
            >
              SHOP NOW
            </button>
          </div>
        </div>

        {/* MEN */}
        <div className="relative h-[70vh] sm:h-[78vh] lg:h-[86vh] overflow-hidden">
          {menSlides.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="men slide"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                i === mi ? "opacity-100" : "opacity-0"
              }`}
              draggable={false}
            />
          ))}

          <button
            aria-label="prev-men"
            onClick={prevM}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/95 text-black shadow hover:bg-white"
          >
            <ChevronLeft className="mx-auto" />
          </button>
          <button
            aria-label="next-men"
            onClick={nextM}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/95 text-black shadow hover:bg-white"
          >
            <ChevronRight className="mx-auto" />
          </button>

          <div className="absolute bottom-10 left-8">
            <h2 className="text-white/95 text-4xl sm:text-5xl font-extrabold drop-shadow">
              MEN
            </h2>
            <button
              className="mt-3 px-5 py-2 rounded-full bg-white text-black font-semibold shadow"
              onClick={() => nav("/men")}
            >
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
