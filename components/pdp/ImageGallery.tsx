'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useAdminProductStore } from '@/lib/admin-store';
import ProductImage from '../ProductImage';
import { cn } from '@/lib/utils';

const PLACEHOLDER_SHOTS = ['Main', 'Close-up', 'Worn', 'Packaging'];

export default function ImageGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  // See ProductThumb for why this checks the admin store rather than product.images directly.
  const liveImages = useAdminProductStore((s) => s.products.find((p) => p.id === product.id)?.images);
  const images = liveImages ?? product.images;
  const hasRealPhotos = !!images && images.length > 0;

  return (
    <div>
      {hasRealPhotos ? (
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md">
          <Image src={images[active]} alt={product.name} fill className="object-cover" />
        </div>
      ) : (
        <ProductImage seed={product.imageHue + active} name={product.name} className="rounded-md" />
      )}

      <div className="mt-3 flex gap-2">
        {hasRealPhotos
          ? images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActive(i)}
                className={cn(
                  'relative aspect-square flex-1 overflow-hidden rounded-sm border-2',
                  active === i ? 'border-gold-primary' : 'border-transparent'
                )}
                aria-label={`View photo ${i + 1}`}
              >
                <Image src={src} alt={product.name} fill className="object-cover" />
              </button>
            ))
          : PLACEHOLDER_SHOTS.map((label, i) => (
              <button
                key={label}
                onClick={() => setActive(i)}
                className={cn(
                  'flex-1 overflow-hidden rounded-sm border-2',
                  active === i ? 'border-gold-primary' : 'border-transparent'
                )}
                aria-label={`View ${label} shot`}
              >
                <ProductImage seed={product.imageHue + i} name={label} className="aspect-square" />
              </button>
            ))}
      </div>
    </div>
  );
}
