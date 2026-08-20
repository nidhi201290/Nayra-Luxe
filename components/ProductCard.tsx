'use client';

import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import ProductThumb from './ProductThumb';
import Price from './Price';
import { useWishlistStore } from '@/lib/store';
import { useLiveProduct } from '@/lib/admin-store';
import { cn } from '@/lib/utils';

export default function ProductCard({ product: staticProduct }: { product: Product }) {
  const product = useLiveProduct(staticProduct);
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="card group relative overflow-hidden hover:-translate-y-0.5 hover:border-gold-light hover:shadow-md">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-t-md">
          <ProductThumb
            product={product}
            className="transition-transform duration-200 group-hover:scale-[1.03]"
          />
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.isBestseller && (
              <span className="pill bg-gold-primary text-white">Bestseller</span>
            )}
            {product.isNew && !product.isBestseller && (
              <span className="pill bg-blush text-gold-primary">New</span>
            )}
          </div>
        </div>
        <div className="space-y-1 p-3">
          <h3 className="line-clamp-2 text-h4 text-charcoal">{product.name}</h3>
          <div className="flex items-center gap-1 text-caption text-charcoal-muted">
            <Star className="h-3 w-3 fill-gold-primary text-gold-primary" />
            <span>{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>
          <Price basePrice={product.basePrice} salePrice={product.salePrice} size="sm" />
        </div>
      </Link>
      <button
        type="button"
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={(e) => {
          e.preventDefault();
          toggle(product.id);
        }}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-colors"
      >
        <Heart
          className={cn('h-4 w-4', wishlisted ? 'fill-gold-primary text-gold-primary' : 'text-charcoal')}
        />
      </button>
    </div>
  );
}
