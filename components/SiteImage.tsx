'use client';

import Image from 'next/image';
import { useSiteImage } from '@/lib/admin-store';
import { cn } from '@/lib/utils';
import ProductImage from './ProductImage';

interface SiteImageProps {
  slotKey: string;
  fallbackSeed: number;
  fallbackName: string;
  className?: string;
  iconClassName?: string;
}

export default function SiteImage({ slotKey, fallbackSeed, fallbackName, className, iconClassName }: SiteImageProps) {
  const src = useSiteImage(slotKey);

  if (src) {
    return (
      <div className={cn('relative aspect-[4/5] w-full overflow-hidden', className)}>
        <Image src={src} alt={fallbackName} fill className="object-cover" />
      </div>
    );
  }

  return <ProductImage seed={fallbackSeed} name={fallbackName} className={className} iconClassName={iconClassName} />;
}
