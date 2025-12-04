import { Link } from "react-router-dom";

/**
 * Horizontal product carousel (cards).
 * - Media uses object-contain (no zoom).
 * - Card media area height is fixed, responsive.
 */
export default function ProductCarousel({
  title,
  items = [], // [{id, img, title, price}]
}) {
  return (
    <section>
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}

      <div className="relative">
        <div className="grid grid-flow-col auto-cols-[70%] sm:auto-cols-[45%] md:auto-cols-[32%] lg:auto-cols-[24%] gap-4 overflow-x-auto scroll-smooth no-scrollbar pr-2">
          {items.map((it) => (
            <Link
              key={it.id}
              to={`/product/${it.id}`}
              className="border rounded-xl overflow-hidden bg-white hover:shadow transition"
            >
              <div className="w-full h-[42vh] sm:h-[40vh] md:h-[38vh] lg:h-[36vh] flex items-center justify-center bg-white">
                <img
                  src={it.img}
                  alt={it.title}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium line-clamp-2">{it.title}</h3>
                {typeof it.price !== "undefined" && (
                  <div className="text-sm font-semibold mt-1">
                    ₹{Number(it.price).toLocaleString("en-IN")}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
