import { Link } from "react-router-dom";

const CATS = [
  { key: "Men",         img: "https://picsum.photos/seed/men-1/1200/800" },
  { key: "Women",       img: "https://picsum.photos/seed/women-2/1200/800" },
  { key: "Sneakers",    img: "https://picsum.photos/seed/sneakers-3/1200/800" },
  { key: "Accessories", img: "https://picsum.photos/seed/accessories-4/1200/800" }
];

export default function CategoryTiles() {
  return (
    <section className="container py-10">
      <h3 className="text-2xl font-bold mb-6">Shop by Category</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATS.map(c => (
          <Link key={c.key} to="/" className="group relative rounded-2xl overflow-hidden shadow-soft">
            <img src={c.img} alt={c.key} className="h-40 md:h-56 w-full object-cover group-hover:scale-[1.03] transition" />
            <span className="absolute inset-x-0 bottom-0 bg-black/40 text-white py-2 text-center text-sm md:text-base">{c.key}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
