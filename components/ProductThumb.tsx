'use client';

import Image from 'next/image';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAdminProductStore } from '@/lib/admin-store';
import ProductImage from './ProductImage';

interface ProductThumbProps {
  product: Product;
  imageIndex?: number;
  className?: string;
  iconClassName?: string;
}

export default function ProductThumb({ product, imageIndex = 0, className, iconClassName }: ProductThumbProps) {
  // Photos are uploaded/attached via the admin panel, which lives in a separate
  // store from the static catalog these product objects are usually passed in
  // from — look there first so uploads actually show up wherever this card renders.
  const liveImages = useAdminProductStore((s) => s.products.find((p) => p.id === product.id)?.images);
  const src = (liveImages ?? product.images)?.[imageIndex];

  if (src) {
    return (
      <div className={cn('relative aspect-[4/5] w-full overflow-hidden', className)}>
        <Image src={src} alt={product.name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <ProductImage seed={product.imageHue + imageIndex} name={product.name} className={className} iconClassName={iconClassName} />
  );
}
