import type { Metadata } from 'next';
import ShopExperience from '@/components/shop/ShopExperience';
import { products } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse the full Nayra Luxe catalog — anti-tarnish, 18K gold plated jewelry.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop All Products',
    description: 'Browse the full Nayra Luxe catalog — anti-tarnish, 18K gold plated jewelry.',
    url: '/shop',
    type: 'website',
  },
};

export default function ShopPage() {
  return (
    <div>
      <div className="section pt-8">
        <h1 className="text-h1">Shop All</h1>
        <p className="mt-2 text-body text-charcoal-muted">Anti-tarnish, 18K gold plated jewelry for everyday luxe.</p>
      </div>
      <ShopExperience products={products} showCategoryFilter />
    </div>
  );
}
