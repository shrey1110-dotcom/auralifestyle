export default function PromoBanners() {
  const banners = [
    {
      title: "Modern Fits, Fresh Looks",
      subtitle: "Oversized tees, relaxed denim & clean sneakers",
      cta: "Shop Modern",
      img: "https://picsum.photos/seed/modern-fits/1600/800",
      href: "/"
    },
    {
      title: "Style Under ₹999",
      subtitle: "Premium feel without the premium price",
      cta: "Grab the Deals",
      img: "https://picsum.photos/seed/under-999/1600/800",
      href: "/"
    }
  ];

  return (
    <section className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((b, i) => (
          <a key={i} href={b.href} className="group relative rounded-2xl overflow-hidden shadow-soft">
            <img src={b.img} alt={b.title} className="h-64 md:h-72 w-full object-cover group-hover:scale-[1.02] transition" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <div className="text-xl md:text-2xl font-extrabold">{b.title}</div>
              <div className="opacity-90 text-sm md:text-base">{b.subtitle}</div>
              <div className="mt-2 inline-block px-3 py-2 rounded-lg bg-white text-zinc-900 text-sm font-semibold group-hover:translate-y-[-1px] transition">
                {b.cta}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
