// src/pages/Shop.jsx
import { useStore } from "../context/StoreContext.jsx";
import ProductGrid from "../components/ProductGrid.jsx";

export default function Shop() {
  const { products } = useStore();

  return (
    <section className="container py-10">
      <h2 className="text-2xl font-bold mb-6">Shop All</h2>
      <ProductGrid items={products} />
    </section>
  );
}
