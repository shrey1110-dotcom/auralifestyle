import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";

export default function GenderMockups({ productId = "ts-001" }) {
  const { products } = useStore();
  const p = products.find(x => x.id === productId);
  if (!p?.genderImages) return null;

  const blocks = [
    { label: "Men",   img: p.genderImages.Men,   href: `/product/${p.id}?g=Men` },
    { label: "Women", img: p.genderImages.Women, href: `/product/${p.id}?g=Women` },
  ];

  return (
    <section className="container py-8">
      <h3 className="text-2xl font-bold mb-4">Same Tee — Two Fits</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blocks.map(b => (
          <Link key={b.label} to={b.href} className="group relative rounded-2xl overflow-hidden shadow-soft">
            <img src={b.img} alt={`${b.label} mockup`} className="h-72 w-full object-cover group-hover:scale-[1.02] transition" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <div className="text-xl font-extrabold">{b.label}</div>
              <div className="mt-2 inline-block px-3 py-2 rounded-lg bg-white text-zinc-900 text-sm font-semibold group-hover:-translate-y-0.5 transition">
                Shop {b.label}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
