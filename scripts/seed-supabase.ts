// One-off seed script: pushes the existing mock catalog (lib/mock-data.ts)
// into Supabase so the tables aren't empty after running supabase/schema.sql.
//
// Usage (after filling .env.local and running schema.sql in the Supabase
// SQL editor):
//   npx tsx scripts/seed-supabase.ts
//
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in
// .env.local (service role, so it bypasses RLS for the bulk insert).

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { categories, collections, products, coupons } from '../lib/mock-data';

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) continue;
    const key = match[1];
    let value = (match[2] || '').trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Fill .env.local first.'
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function main() {
  console.log(`Seeding ${categories.length} categories...`);
  let { error } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' });
  if (error) throw error;

  console.log(`Seeding ${collections.length} collections...`);
  ({ error } = await supabase.from('collections').upsert(collections, { onConflict: 'slug' }));
  if (error) throw error;

  console.log(`Seeding ${coupons.length} coupons...`);
  ({ error } = await supabase.from('coupons').upsert(
    coupons.map((c) => ({
      code: c.code,
      discount_type: c.discountType,
      discount_value: c.discountValue,
      min_order_value: c.minOrderValue,
      expiry_date: c.expiryDate,
      usage_limit: c.usageLimit,
      used_count: c.usedCount,
    })),
    { onConflict: 'code' }
  ));
  if (error) throw error;

  console.log(`Seeding ${products.length} products...`);
  ({ error } = await supabase.from('products').upsert(
    products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category_slug: p.categorySlug,
      collection_slugs: p.collectionSlugs,
      base_price: p.basePrice,
      sale_price: p.salePrice,
      material: p.material,
      plating: p.plating,
      description: p.description,
      details: p.details,
      care: p.care,
      sku: p.sku,
      is_bestseller: p.isBestseller,
      is_new: p.isNew,
      status: p.status,
      rating: p.rating,
      review_count: p.reviewCount,
      variants: p.variants,
      reviews: p.reviews,
      images: p.images ?? [],
      image_hue: p.imageHue,
    })),
    { onConflict: 'id' }
  ));
  if (error) throw error;

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
