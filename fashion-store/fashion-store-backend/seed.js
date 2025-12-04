import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/config/db.js";
import Product from "./src/models/Product.js";

const DUMMY = [
  {
    name: "Freedom Tee (Unisex)",
    slug: "ts-001",
    price: 799, mrp: 999,
    images: [
      "https://picsum.photos/seed/tee1-a/1200/1200",
      "https://picsum.photos/seed/tee1-b/1200/1200"
    ],
    sizes: ["S","M","L","XL","XXL"],
    colors: ["Black","White","Navy"],
    fabric: "100% Cotton, 180 GSM",
    category: ["Men","Women","Topwear","New Arrivals","Bestsellers","Official Merch"],
    description: "Ultra-soft cotton with bold print. Tailored regular fit.",
    tags: ["freedom","collection","graphic tee"],
    genderImages: {
      Men: "https://picsum.photos/seed/tee-men/1200/800",
      Women: "https://picsum.photos/seed/tee-women/1200/800"
    }
  },
  {
    name: "Everyday Joggers",
    slug: "jw-101",
    price: 1299, mrp: 1599,
    images: ["https://picsum.photos/seed/jogger-a/1200/1200","https://picsum.photos/seed/jogger-b/1200/1200"],
    colors: ["Charcoal","Olive","Beige"],
    sizes: ["S","M","L","XL"],
    fabric: "Cotton Blend, 240 GSM",
    category: ["Men","Bottomwear","Bestsellers"],
    description: "Tapered fit with soft brushed inside for all-day comfort.",
    tags: ["jogger","bottomwear"]
  }
];

(async () => {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(DUMMY);
  console.log("✅ Seeded", DUMMY.length, "products");
  process.exit(0);
})();
