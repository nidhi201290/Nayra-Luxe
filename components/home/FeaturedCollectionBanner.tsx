import Link from 'next/link';
import SiteImage from '../SiteImage';

export default function FeaturedCollectionBanner() {
  return (
    <section className="section section-y">
      <div className="grid grid-cols-1 items-center gap-6 overflow-hidden rounded-lg bg-white shadow-sm md:grid-cols-2">
        <SiteImage
          slotKey="featured-collection-banner"
          fallbackSeed={12}
          fallbackName="Wedding Edit"
          className="h-full min-h-[280px]"
        />
        <div className="p-8 md:p-12">
          <p className="eyebrow mb-3">Curated Edit</p>
          <h2 className="mb-4 text-h1">The Wedding Edit</h2>
          <p className="mb-6 max-w-md text-body-lg text-charcoal-muted">
            Statement necklaces, stacked bangles and drop earrings for the big day — and every function around it.
          </p>
          <Link href="/collection/wedding-edit" className="btn-primary">
            Shop the Edit
          </Link>
        </div>
      </div>
    </section>
  );
}
