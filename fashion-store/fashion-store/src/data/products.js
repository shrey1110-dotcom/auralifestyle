// src/data/products.js
// Put your actual image files under: /public/images/

export const ALL_PRODUCTS = [
  // ---------- MEN ----------
  {
    id: "m-01",
    title: "Harry Potter Hoodie",
    price: 1499,
    mrp: 1899,
    image: "/images/harry_potter_men.png",
    gender: "men",
    sizes: ["S", "M", "L"],
    colors: ["Off-White"],
    colorSwatches: { OffWhite: "#fffcfcff" }
  },
  {
    id: "m-02",
    title: "Squid Game Hoodie",
    price: 1499,
    mrp: 1899,
    image: "/images/men_squid_game_black_hoodie.png",
    gender: "men",
    sizes: ["S", "M", "L"],
    colors: ["Black", "Off-White"],
    colorSwatches: { Black: "#0a0a0a", OffWhite: "#f6f6f6" },
    imagesByColor: {
      Black: ["/images/men_squid_game_black_hoodie.jpg", "/images/squid_game_hoodie_3.png"],
      White: ["/images/men_squid_game_white_hoodie.png"]
    }
  },
  {
    id: "m-03",
    title: "Deadpool Hoodie",
    price: 1499,
    mrp: 1899,
    image: "/images/men_deadpool_hoodie.png",
    gender: "men",
    sizes: ["S", "M", "L"],
    colors: ["Off-White"],
    colorSwatches: { OffWhite: "#fffcfcff" }
  },
  {
    id: "m-04",
    title: "Stranger Things Hoodie",
    price: 1499,
    mrp: 1899,
    image: "/images/men_stranger_things_hoodie.png",
    gender: "men",
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    colorSwatches: { Black: "#000000" }
  },
  {
    id: "jurassic-park",
    title: "Jurassic Park Hoodie",
    price: 1499,
    mrp: 1899,
    image: "/images/men_jurassic_park.png",
    gender: "men",
    sizes: ["S", "M", "L"],
    colors: ["Off-White"],
    colorSwatches: { OffWhite: "#fffcfcff" }
  },

  // Aura Basic Tee
  {
    id: "m-05-a",
    slug: "aura-basic-tee",
    title: "Aura Basic Tee",
    price: 799,
    mrp: 899,
    gender: "men",
    colors: ["Black", "White"],
    colorSwatches: { Black: "#0a0a0a", White: "#f6f6f6" },
    sizes: ["S", "M", "L"],
    image: "/images/M-01.png",
    imagesByColor: {
      Black: ["/images/M-01.png"],
      White: ["/images/M-02.png"]
    },
    images: ["/images/M-01.png"]
  },

  // AURA Race Ready Tee (keep single M-04.png entry)
  {
    id: "m-04-2",
    title: "AURA Race Ready Tee",
    price: 899,
    mrp: 999,
    image: "/images/M-04.png",
    gender: "men",
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    colorSwatches: { Black: "#0a0a0a" }
  },

  // Squid Game Tee (kept the slugged variant m-07 using M-05.jpg)
  {
    id: "m-07",
    slug: "aura-squid-game-tee",
    title: "AURA Squid Game Tee",
    price: 799,
    mrp: 899,
    gender: "men",
    sizes: ["S", "M", "L"],
    colors: ["Black", "White"],
    colorSwatches: { Black: "#0a0a0a", White: "#fffcfcff" },
    image: "/images/M-05.jpg",
    imagesByColor: {
      Black: ["/images/M-05.jpg", "/images/Squid-game.png"],
      White: ["/images/squid_game_white_tee_men.png"]
    }
  },

  {
    id: "m-12",
    title: "AURA Rimberio Tee",
    price: 799,
    mrp: 899,
    image: "/images/M-12.png",
    gender: "men",
    sizes: ["S", "M", "L"],
    colors: ["White"],
    colorSwatches: { White: "#ffffff" }
  },

  // ---------- WOMEN ----------

  {
    id: "w-06-a",
    title: "AURA Rimberio Tee (Women)",
    price: 799,
    mrp: 899,
    image: "/images/W-06 f.png",
    gender: "women",
    sizes: ["S", "M", "L"],
    colors: ["White"],
    colorSwatches: { White: "#ffffff" }
  },

  {
    id: "w-01-c",
    title: "Harry Potter Hoodie (Women)",
    price: 1499,
    mrp: 1899,
    image: "/images/harry_potter_women.png",
    gender: "women",
    sizes: ["S", "M", "L"],
    colors: ["Off-White"],
    colorSwatches: { OffWhite: "#fffcfcff" }
  },
  {
    id: "w-02",
    title: "Squid Game Hoodie (Women)",
    price: 1499,
    mrp: 1899,
    image: "/images/women_squid_game_black_hoodie.png",
    gender: "women",
    sizes: ["S", "M", "L"],
    colors: ["Black", "Off-White"],
    colorSwatches: { Black: "#0a0a0a", OffWhite: "#f6f6f6" },
    imagesByColor: {
      Black: ["/images/women_squid_game_black_hoodie.png"],
      OffWhite: ["/images/women_squid_game_white_hoodie.png"]
    }
  },
  {
    id: "w-04",
    title: "Stranger Things Hoodie (Women)",
    price: 1499,
    mrp: 1899,
    image: "/images/women_stranger_things_hoodie.png",
    gender: "women",
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    colorSwatches: { Black: "#000000" }
  },
  {
    id: "w-jurassic-park",
    title: "Jurassic Park Hoodie (Women)",
    price: 1499,
    mrp: 1899,
    images: [
      "/images/women_jurassic_park.png",
      "/images/women_stranger_things_hoodie.png"
    ],
    gender: "women",
    sizes: ["S", "M", "L"],
    colors: ["Off-White"],
    colorSwatches: { OffWhite: "#fffcfcff" }
  },
  {
    id: "matcha-hoodie",
    title: "Matcha Hoodie",
    price: 1499,
    mrp: 1899,
    image: "/images/matcha_hoodie.png",
    gender: "women",
    sizes: ["S", "M", "L"],
    colors: ["Off-White"],
    colorSwatches: { OffWhite: "#fffcfcff" }
  },
  {
    id: "w-05",
    title: "AURA Race Ready Tee (Women)",
    price: 799,
    mrp: 899,
    image: "/images/women_race_ready_tee.png",
    gender: "women",
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    colorSwatches: { Black: "#0a0a0a" }
  },
  {
    id: "w-07",
    slug: "aura-squid-game-tee-women",
    title: "AURA Squid Game Tee (Women)",
    price: 799,
    mrp: 899,
    gender: "women",
    sizes: ["S", "M", "L"],
    colors: ["Black", "White"],
    colorSwatches: { Black: "#0a0a0a", White: "#fffcfcff" },
    image: "/images/women_squid_game_black_tee.png",
    imagesByColor: {
      Black: ["/images/women_squid_game_black_tee.png"],
      White: ["/images/squid_game_white_tee_women.png"]
    }
  }
];

// Make both import styles work:
export default ALL_PRODUCTS;
