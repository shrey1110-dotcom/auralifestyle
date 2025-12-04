import Carousel from "./Carousel.jsx";

const slides = [
  {
    id: 1,
    type: "image",
    img: "/images/look-1.jpg",
    fit: "cover",
  },
  {
    id: 2,
    type: "image",
    img: "/images/poster_aura.png",
    fit: "cover",
  },
];

export default function CultureCarousel() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200">
      <div className="relative aspect-[16/9] sm:aspect-[16/8] md:aspect-[16/7]">
        <Carousel
          className="h-full"
          items={slides}
          autoplayMs={4200}
          showDots
          showArrows
          render={(s) => (
            <div className="relative h-full w-full">
              <img
                src={s.img}
                alt={s.title}
                className={`absolute inset-0 h-full w-full ${
                  s.fit === "contain"
                    ? "object-contain bg-black"
                    : "object-cover"
                }`}
              />
              <div className="absolute inset-0" />
              <div className="absolute bottom-6 left-6 md:left-10 text-white">
                <h3 className="text-2xl md:text-4xl font-extrabold drop-shadow">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm md:text-base opacity-90">
                  {s.subtitle}
                </p>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
