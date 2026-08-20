import Link from 'next/link';
import { categories } from '@/lib/mock-data';
import SiteImage from '../SiteImage';

export default function CategoryGrid() {
  return (
    <section className="section section-y">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-2">Explore</p>
          <h2 className="text-h2">Shop by Category</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
        {categories.map((c, i) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="group">
            <div className="overflow-hidden rounded-md">
              <SiteImage
                slotKey={`category-banner-${c.slug}`}
                fallbackSeed={i * 3}
                fallbackName={c.name}
                className="transition-transform duration-200 group-hover:scale-[1.03]"
              />
            </div>
            <p className="mt-2 text-center text-h4 text-charcoal">{c.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
