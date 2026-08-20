'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/lib/store';
import { products } from '@/lib/mock-data';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const productIds = useWishlistStore((s) => s.productIds);
  const items = products.filter((p) => productIds.includes(p.id));

  return (
    <div className="section section-y">
      <h1 className="mb-6 text-h1">Your Wishlist</h1>
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Heart className="h-12 w-12 text-charcoal-muted" />
          <p className="text-body text-charcoal-muted">Save your favourite pieces here.</p>
          <Link href="/shop" className="btn-primary">Explore Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 tablet:grid-cols-3 tablet:gap-4 desktop:grid-cols-4 desktop:gap-6">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
