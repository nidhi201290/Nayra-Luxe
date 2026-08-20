'use client';

import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { products } from '@/lib/mock-data';
import { useAdminProductStore } from '@/lib/admin-store';
import ShopExperience from '@/components/shop/ShopExperience';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const catalog = useAdminProductStore((s) => s.products);
  const searchable = catalog.length > 0 ? catalog : products;

  const results = q
    ? searchable.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.categorySlug.toLowerCase().includes(q.toLowerCase())
      )
    : [];

  return (
    <div>
      <div className="section pt-8">
        <h1 className="text-h1">Search Results</h1>
        <p className="mt-2 text-body text-charcoal-muted">
          {q ? `${results.length} results for "${q}"` : 'Enter a search term to get started.'}
        </p>
      </div>
      {!q || results.length === 0 ? (
        <div className="section section-y flex flex-col items-center gap-4 py-16 text-center">
          <Search className="h-12 w-12 text-charcoal-muted" />
          {q ? (
            <>
              <p className="text-body text-charcoal-muted">No results found for &quot;{q}&quot;.</p>
              <p className="text-caption text-charcoal-muted">Try browsing Necklaces, Rings, or Earrings instead.</p>
            </>
          ) : (
            <p className="text-body text-charcoal-muted">Use the search icon in the header to find products.</p>
          )}
        </div>
      ) : (
        <ShopExperience products={results} showCategoryFilter />
      )}
    </div>
  );
}
