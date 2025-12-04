// src/components/GenderHeroCarousel.jsx
import { useMemo } from "react";
import { useStore } from "../context/StoreContext.jsx";
import Carousel from "./Carousel.jsx";

export default function GenderHeroCarousel() {
  const { gender } = useStore();

  const slides = useMemo(() => {
    if (gender === "Women") {
      return [
        { id: 1, type: "image", img: "/images/women-hero-1.png", title: "Women — New In", subtitle: "Latest arrivals", fit: "contain" },
        { id: 2, type: "image", img: "/images/women-hero-2.jpg", title: "Essentials", subtitle: "Everyday fits", fit: "cover" },
        { id: 3, type: "image", img: "/images/women-hero-3.jpg", title: "Best Picks", subtitle: "Top rated by shoppers", fit: "cover" },
        { id: 4, type: "video", src: "/videos/hero-1.mp4", poster: "/images/look-1.jpg", title: "Lookbook", subtitle: "Shop the latest designs" },
      ];
    }
    // MEN
    return [
      { id: 1, type: "image", img: "/images/men-hero-1.png", title: "Men — New In", subtitle: "Latest arrivals", fit: "contain" },
      { id: 2, type: "image", img: "/images/men-hero-2.jpg", title: "Essentials", subtitle: "Everyday fits", fit: "cover" },
      { id: 3, type: "image", img: "/images/men-hero-3.jpg", title: "Best Picks", subtitle: "Top rated by shoppers", fit: "cover" },
      { id: 4, type: "video", src: "/videos/hero-1.mp4", poster: "/images/look-1.jpg", title: "Lookbook", subtitle: "Shop the latest designs" },
    ];
  }, [gender]);

  return (
    <section className="w-full">
      <div className="relative aspect-[16/8] md:aspect-[16/7] overflow-hidden rounded-none md:rounded-2xl">
        <Carousel
          className="h-full"
          items={slides}
          autoplayMs={5000}
          showDots
          showArrows
          render={(s) => (
            <div className="relative h-full w-full">
              {s.type === "video" ? (
                <video
                  src={s.src}
                  poster={s.poster}
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={s.img}
                  alt={s.title}
                  className={`absolute inset-0 h-full w-full ${
                    s.fit === "contain" ? "object-contain bg-black" : "object-cover"
                  }`}
                />
              )}
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute bottom-8 left-6 md:left-12 text-white">
                <h2 className="text-2xl md:text-4xl font-extrabold drop-shadow">{s.title}</h2>
                <p className="mt-2 text-sm md:text-base opacity-90">{s.subtitle}</p>
              </div>
            </div>
          )}
        />
      </div>
    </section>
  );
}
