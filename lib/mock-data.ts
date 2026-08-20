import { Category, Collection, Coupon, Product, Review } from './types';

export const categories: Category[] = [
  { slug: 'necklaces', name: 'Necklaces', description: 'Layered chains, pendants and statement pieces for everyday luxe.', tone: 'gold' },
  { slug: 'bracelets', name: 'Bracelets', description: 'Stackable bangles and chain bracelets, anti-tarnish and waterproof.', tone: 'blush' },
  { slug: 'chain-pendants', name: 'Chain Pendants', description: 'Delicate pendants on fine chains, dainty and everyday-ready.', tone: 'ivory' },
  { slug: 'rings', name: 'Rings', description: 'Stackable bands and statement rings in 18K gold plating.', tone: 'gold' },
  { slug: 'earrings', name: 'Earrings', description: 'Studs, hoops and drops for every occasion.', tone: 'blush' },
];

export const collections: Collection[] = [
  { slug: 'new-arrivals', name: 'New Arrivals', description: 'Fresh drops, just in.' },
  { slug: 'bestsellers', name: 'Bestsellers', description: 'Customer favourites, tried and loved.' },
  { slug: 'gift-sets', name: 'Gift Sets Under ₹999', description: 'Thoughtful gifting, without the guesswork.' },
  { slug: 'wedding-edit', name: 'The Wedding Edit', description: 'Statement pieces for the big day and every function around it.' },
];

const NAME_PARTS: Record<string, string[]> = {
  necklaces: ['Aurelia Layered Necklace', 'Meera Chain Necklace', 'Isla Pearl Drop Necklace', 'Zoya Herringbone Necklace', 'Anaya Coin Necklace', 'Elora Snake Chain Necklace', 'Kiara Choker Necklace', 'Rhea Beaded Necklace'],
  bracelets: ['Aria Cuban Bracelet', 'Nia Bangle Bracelet', 'Sana Tennis Bracelet', 'Vera Chain-Link Bracelet', 'Diya Charm Bracelet', 'Myra Cable Bracelet', 'Tara Beaded Bracelet'],
  'chain-pendants': ['Ishaani Initial Pendant', 'Leela Heart Pendant', 'Amara Evil Eye Pendant', 'Sia Star Pendant', 'Naina Infinity Pendant', 'Riya Sun Pendant', 'Vanya Moon Pendant'],
  rings: ['Kavya Stacking Ring', 'Ora Solitaire Ring', 'Pia Signet Ring', 'Zara Twist Ring', 'Alina Pearl Ring', 'Nyra Baguette Ring', 'Ira Knot Ring'],
  earrings: ['Sera Hoop Earrings', 'Miya Stud Earrings', 'Nova Drop Earrings', 'Elani Huggie Earrings', 'Farah Chandelier Earrings', 'Ojal Ear Cuff', 'Vidya Threader Earrings'],
};

const REVIEW_AUTHORS = ['Priya S.', 'Ananya R.', 'Simran K.', 'Neha M.', 'Riya T.', 'Kavya P.', 'Isha G.', 'Divya N.'];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildReviews(seed: number, count: number): Review[] {
  const rand = seededRandom(seed);
  const comments = [
    "Doesn't tarnish at all, wore it through a beach trip and it still looks new.",
    'Exactly like the pictures, feels premium for the price. Packaging was lovely too.',
    'Ordered as a gift, my sister loves it. Fast delivery as well.',
    'Good quality but slightly smaller than I imagined. Still keeping it.',
    'Been wearing it daily for 2 months, no fading or discoloration. Impressed.',
    'True to size and the gold plating looks rich, not cheap at all.',
  ];
  return Array.from({ length: count }).map((_, i) => ({
    id: `rev-${seed}-${i}`,
    author: REVIEW_AUTHORS[Math.floor(rand() * REVIEW_AUTHORS.length)],
    rating: Math.floor(rand() * 2) + 4,
    date: `2026-0${(i % 6) + 1}-${10 + (i % 15)}`,
    comment: comments[Math.floor(rand() * comments.length)],
    verified: true,
  }));
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function buildVariants(category: string, seed: number): Product['variants'] {
  const rand = seededRandom(seed);
  if (category === 'rings') {
    return ['5', '6', '7', '8', '9'].map((size, i) => ({
      id: `${seed}-${size}`,
      size,
      stock: Math.floor(rand() * 12),
      skuSuffix: `R${size}`,
    }));
  }
  const colors: Array<'Gold' | 'Rose Gold' | 'Silver-tone'> = ['Gold', 'Rose Gold', 'Silver-tone'];
  const numColors = 1 + Math.floor(rand() * 3);
  return colors.slice(0, numColors).map((color, i) => ({
    id: `${seed}-${color}`,
    color,
    stock: Math.floor(rand() * 15),
    skuSuffix: color.slice(0, 2).toUpperCase(),
  }));
}

function generateProducts(): Product[] {
  const products: Product[] = [];
  let idCounter = 1;

  (Object.keys(NAME_PARTS) as Array<keyof typeof NAME_PARTS>).forEach((categorySlug) => {
    NAME_PARTS[categorySlug].forEach((name, i) => {
      const seed = idCounter * 37 + i;
      const rand = seededRandom(seed);
      const base = 399 + Math.floor(rand() * 2400);
      const discountPct = [0, 10, 15, 20, 25][Math.floor(rand() * 5)];
      const sale = discountPct ? Math.round((base * (100 - discountPct)) / 100 / 10) * 10 : base;
      const isBestseller = rand() > 0.72;
      const isNew = rand() > 0.75;
      const reviewCount = 3 + Math.floor(rand() * 40);
      const collectionSlugs: string[] = [];
      if (isNew) collectionSlugs.push('new-arrivals');
      if (isBestseller) collectionSlugs.push('bestsellers');
      if (sale <= 999) collectionSlugs.push('gift-sets');
      if (categorySlug === 'necklaces' || categorySlug === 'earrings') {
        if (rand() > 0.6) collectionSlugs.push('wedding-edit');
      }

      const slug = slugify(name);
      products.push({
        id: `prod-${idCounter}`,
        slug,
        name,
        categorySlug: categorySlug as Product['categorySlug'],
        collectionSlugs,
        basePrice: base,
        salePrice: sale,
        material: '316L Stainless Steel',
        plating: '18K Gold Plated',
        description: `${name} in premium 18K gold plating over 316L stainless steel. Anti-tarnish, waterproof and sweatproof — designed for everyday wear that lasts.`,
        details: [
          'Material: 316L Stainless Steel base',
          'Plating: 18K Gold Plated',
          'Anti-tarnish, waterproof & sweatproof',
          'Hypoallergenic — safe for sensitive skin',
        ],
        care: [
          'Avoid contact with perfume, lotion and chlorinated water where possible',
          'Wipe gently with a soft, dry cloth after wear',
          'Store in the pouch provided, away from direct sunlight',
        ],
        sku: `NL-${categorySlug.slice(0, 3).toUpperCase()}-${String(idCounter).padStart(3, '0')}`,
        isBestseller,
        isNew,
        status: 'active',
        rating: Math.round((3.8 + rand() * 1.2) * 10) / 10,
        reviewCount,
        variants: buildVariants(categorySlug, seed),
        reviews: buildReviews(seed, Math.min(4, reviewCount)),
        imageHue: Math.floor(rand() * 360),
      });
      idCounter += 1;
    });
  });

  return products;
}

export const products: Product[] = generateProducts();

export const coupons: Coupon[] = [
  { code: 'NAYRA150', discountType: 'flat', discountValue: 150, minOrderValue: 999, expiryDate: '2026-12-31', usageLimit: 500, usedCount: 128 },
  { code: 'WELCOME10', discountType: 'percent', discountValue: 10, minOrderValue: 499, expiryDate: '2026-12-31', usageLimit: 1000, usedCount: 340 },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getProductsByCollection(collectionSlug: string) {
  return products.filter((p) => p.collectionSlugs.includes(collectionSlug));
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getCollectionBySlug(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export function getRelatedProducts(product: Product, count = 4) {
  return products
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, count);
}
