import 'dotenv/config.js';
import { connectDB } from './config/db.js';
import Product from './models/Product.js';

async function run() {
  await connectDB();

  await Product.deleteMany({});

  await Product.insertMany([
    {
      title: 'Oversized Tee - Monochrome',
      slug: 'oversized-tee-monochrome',
      price: 899,
      images: ['/images/tee-1.jpg'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White'],
      stock: 100
    },
    {
      title: 'Graphic Tee - Neon',
      slug: 'graphic-tee-neon',
      price: 999,
      images: ['/images/tee-2.jpg'],
      sizes: ['M', 'L', 'XL'],
      colors: ['Neon'],
      stock: 60
    }
  ]);

  console.log('✅ Seeded products');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
