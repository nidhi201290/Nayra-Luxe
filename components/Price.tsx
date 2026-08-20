import { cn, discountPercent, formatINR } from '@/lib/utils';

export default function Price({
  basePrice,
  salePrice,
  size = 'md',
}: {
  basePrice: number;
  salePrice: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const pct = discountPercent(basePrice, salePrice);
  // Sale-price and MRP/discount sizes matched to mehere.shop's live computed styles
  // (sale price 20px/700, MRP + discount 16px/400) for the default 'md' context.
  const priceClass = size === 'lg' ? 'text-h3 font-semibold' : size === 'md' ? 'text-[20px] font-bold' : 'text-body font-semibold';
  const subClass = size === 'md' ? 'text-[16px]' : 'text-caption';

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={cn('text-charcoal', priceClass)}>{formatINR(salePrice)}</span>
      {pct > 0 && (
        <>
          <span className={cn(subClass, 'text-charcoal-muted line-through')}>{formatINR(basePrice)}</span>
          <span className={cn(subClass, 'font-semibold text-sale')}>{pct}% off</span>
        </>
      )}
    </div>
  );
}
