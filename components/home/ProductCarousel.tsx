import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '../ProductCard';

export default function ProductCarousel({
  title,
  eyebrow,
  products,
  viewAllHref,
}: {
  title: string;
  eyebrow: string;
  products: Product[];
  viewAllHref: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="section section-y">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-2">{eyebrow}</p>
          <h2 className="text-h2">{title}</h2>
        </div>
        <Link href={viewAllHref} className="btn-text hidden md:inline-flex">
          View All
        </Link>
      </div>
      <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
        {products.map((p) => (
          <div key={p.id} className="w-[46%] flex-none snap-start md:w-auto">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <Link href={viewAllHref} className="btn-text mt-6 flex justify-center md:hidden">
        View All
      </Link>
    </section>
  );
}
