import { Link } from "react-router-dom";

export default function ShopTheLook() {
  return (
    <section className="container py-10">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        {/* Desktop/Large: play the video */}
        <video
          src="/videos/hero-1.mp4"      // ← your video
          poster="/images/look-1.jpg"   // ← fallback poster
          className="hidden md:block w-full aspect-[21/9] object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Mobile: use the poster image for faster load */}
        <img
          src="/images/look-1.jpg"
          alt="Shop the Look"
          className="md:hidden w-full aspect-[4/3] object-cover"
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

        {/* Marketing copy + CTAs */}
        <div className="absolute left-5 md:left-10 bottom-6 md:bottom-10 text-white max-w-xl">
          <p className="uppercase tracking-wider text-xs md:text-sm opacity-90">Lookbook</p>
          <h3 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Shop the latest designs
          </h3>
          <p className="mt-2 text-sm md:text-base opacity-90">
            Culture in every thread — new drops, bold fits, everyday comfort.
          </p>

          <div className="mt-4 flex gap-3">
            <Link
              to="/men"
              className="px-5 py-2.5 rounded-xl bg-white text-zinc-900 font-medium"
            >
              Shop Men
            </Link>
            <Link
              to="/women"
              className="px-5 py-2.5 rounded-xl border border-white/80"
            >
              Shop Women
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
