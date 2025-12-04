// src/data/products.js
// All products in /public/images — men M-01..M-10, women W-01,W-03,W-04,W-05,W-06 (front/back)

const MEN = [
  { id: "M-01", img: "/images/M-01.png", name: "Everyday Joggers – Slate Grey", price: 1599, mrp: 1999, colors: ["Slate Grey"], sizes: ["S","M","L","XL"] },
  { id: "M-02", img: "/images/M-02.png", name: "Essential Tee – Black",        price:  899, mrp: 1199, colors: ["Black"],      sizes: ["S","M","L","XL","XXL"] },
  { id: "M-03", img: "/images/M-03.png", name: "Athleisure Tee – Olive",       price:  999, mrp: 1299, colors: ["Olive"],      sizes: ["S","M","L","XL"] },
  { id: "M-04", img: "/images/M-04.png", name: "Graphic Tee – Mono",           price: 1099, mrp: 1499, colors: ["Black"],      sizes: ["S","M","L","XL"] },
  { id: "M-05", img: "/images/M-05.jpg", name: "Classic Hoodie – Charcoal",    price: 1899, mrp: 2399, colors: ["Charcoal"],   sizes: ["S","M","L","XL"] },
  { id: "M-06", img: "/images/M-06.jpg", name: "Relaxed Shorts – Sand",        price: 1199, mrp: 1499, colors: ["Sand"],       sizes: ["S","M","L","XL"] },
  { id: "M-07", img: "/images/M-07.jpg", name: "Street Shirt – Check",         price: 1499, mrp: 1899, colors: ["Check"],      sizes: ["S","M","L","XL"] },
  { id: "M-08", img: "/images/M-08.png", name: "Training Tee – Navy",          price:  999, mrp: 1299, colors: ["Navy"],       sizes: ["S","M","L","XL"] },
  { id: "M-11", img: "/images/M-11.png", name: "Street Oversize Tee – Black",        price: 1199, mrp: 1499, colors: ["Black"],       sizes: ["S","M","L","XL"] },
  { id: "M-12", img: "/images/M-12.png", name: "Athleisure Tee – White",        price: 1199, mrp: 1499, colors: ["White"],       sizes: ["S","M","L","XL"] },
  { id: "M-09", img: "/images/M-09.png", name: "Street Oversize Tee – Dragon", price: 1299, mrp: 1699, colors: ["Black"],      sizes: ["S","M","L","XL","XXL"] },
  
].map((p) => ({
  ...p,
  gender: "men",
  images: [p.img],
  details:
    "Premium cotton. Crew neck / relaxed fits depending on style. Machine wash cold, inside out. Do not bleach. Dry in shade.",
  fabric: "100% cotton, 180–200 GSM",
  tags: ["featured"],
  rating: 4.5,
}));

const WOMEN = [
  { id: "W-01", img: "/images/W-01.png", name: "Essential Rib Tee – Black", price:  899, mrp: 1199, colors: ["Black"], sizes: ["S","M","L"] },
  { id: "W-03", img: "/images/w-03.jpg", name: "Rib Top – Mauve",           price:  999, mrp: 1299, colors: ["Mauve"], sizes: ["S","M","L","XL"] }, // file is lowercase 'w-03.jpg'
  { id: "W-04", img: "/images/W-04.png", name: "Crop Tee – Sage",           price:  999, mrp: 1299, colors: ["Sage"],  sizes: ["S","M","L","XL"] },
  { id: "W-05", img: "/images/W-05.png", name: "Oversize Tee – Noir",       price: 1099, mrp: 1499, colors: ["Black"], sizes: ["S","M","L","XL"] },
  { id: "W-13", img: "/images/W-13.png", name: "Oversize Tee – Noir",       price: 1099, mrp: 1499, colors: ["Black"], sizes: ["S","M","L","XL"] },
  // W-06 has front + back images
  {
    id: "W-06",
    gender: "women",
    name: "Moto Oversize Tee – White",
    price: 1099,
    mrp: 1499,
    images: ["/images/W-06 f.png", "/images/W-06 b.png"], // KEEP EXACT FILENAMES
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"],
    details:
      "100% cotton oversized tee with soft hand-feel print. Crew neck, half sleeves. Machine wash cold, inside out.",
    fabric: "100% cotton, 180 GSM",
    tags: ["latest","featured"],
    rating: 4.6,
  },
  

  // ========== WOMEN ==========
  {
    id: "W-07",
    gender: "women",
    name: "Oversize Moto Tee – White Front",
    price: 1099,
    mrp: 1499,
    images: ["/images/W-07 f.png"], // exact filename
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"],
    details:
      "Oversized fit moto-inspired tee with front print. Soft cotton for all-day comfort. Machine wash cold.",
    fabric: "100% cotton, 180 GSM",
    tags: ["latest"],
    rating: 4.4,
  },
  {
    id: "W-08",
    gender: "women",
    name: "Cropped Graphic Tee – Black",
    price: 999,
    mrp: 1299,
    images: ["/images/W-08.png"], // exact filename
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    details:
      "Cropped fit graphic tee in soft jersey cotton. Crew neck, half sleeves. Machine wash cold with similar colors.",
    fabric: "100% cotton, 180 GSM",
    tags: ["featured"],
    rating: 4.3,
  },
  {
    id: "W-09",
    gender: "women",
    name: "Cropped Graphic Tee – Black",
    price: 999,
    mrp: 1299,
    images: ["/images/W-09.png"], // exact filename
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    details:
      "Cropped fit graphic tee in soft jersey cotton. Crew neck, half sleeves. Machine wash cold with similar colors.",
    fabric: "100% cotton, 180 GSM",
    tags: ["featured"],
    rating: 4.3,
  },
  {
    id: "W-10",
    gender: "women",
    name: "Cropped Graphic Tee – Black",
    price: 999,
    mrp: 1299,
    images: ["/images/W-10.png"], // exact filename
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    details:
      "Cropped fit graphic tee in soft jersey cotton. Crew neck, half sleeves. Machine wash cold with similar colors.",
    fabric: "100% cotton, 180 GSM",
    tags: ["featured"],
    rating: 4.3,
  },
  {
    id: "W-11",
    gender: "women",
    name: "Cropped Graphic Tee – Black",
    price: 999,
    mrp: 1299,
    images: ["/images/W-11.png"], // exact filename
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    details:
      "Cropped fit graphic tee in soft jersey cotton. Crew neck, half sleeves. Machine wash cold with similar colors.",
    fabric: "100% cotton, 180 GSM",
    tags: ["featured"],
    rating: 4.3,
  },
  {
    id: "W-12",
    gender: "women",
    name: "Cropped Graphic Tee – Black",
    price: 999,
    mrp: 1299,
    images: ["/images/W-12.png"], // exact filename
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    details:
      "Cropped fit graphic tee in soft jersey cotton. Crew neck, half sleeves. Machine wash cold with similar colors.",
    fabric: "100% cotton, 180 GSM",
    tags: ["featured"],
    rating: 4.3,
  },
].map((p) =>
  p.images
    ? p
    : {
        ...p,
        gender: "women",
        images: [p.img],
        details:
          "Soft cotton with flattering fit. Crew neck / crop as per style. Machine wash cold. Do not bleach.",
        fabric: "100% cotton, 180 GSM",
        tags: ["featured"],
        rating: 4.4,
      }
);

export const DUMMY_PRODUCTS = [...MEN, ...WOMEN];

// convenience helpers
export const allMen = () => DUMMY_PRODUCTS.filter((p) => p.gender === "men");
export const allWomen = () =>
  DUMMY_PRODUCTS.filter((p) => p.gender === "women");
export const byId = (id) =>
  DUMMY_PRODUCTS.find((p) => String(p.id) === String(id));
