'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { products } from '@/lib/mock-data';
import { useAdminProductStore } from '@/lib/admin-store';
import Price from './Price';
import ProductThumb from './ProductThumb';

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const catalog = useAdminProductStore((s) => s.products);
  const searchable = catalog.length > 0 ? catalog : products;

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return searchable.filter((p) => p.name.toLowerCase().includes(q) || p.categorySlug.includes(q)).slice(0, 6);
  }, [query, searchable]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Close search" className="absolute inset-0 bg-charcoal/40" onClick={onClose} />
      <div className="relative mx-auto mt-0 max-w-content bg-white p-6 shadow-lg md:mt-8 md:rounded-md">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-border pb-4">
          <Search className="h-5 w-5 text-charcoal-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for necklaces, rings, earrings..."
            className="flex-1 bg-transparent text-body-lg text-charcoal outline-none placeholder:text-charcoal-muted"
          />
          <button type="button" aria-label="Close" onClick={onClose}>
            <X className="h-5 w-5 text-charcoal" />
          </button>
        </form>

        {results.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
            {results.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-md p-2 hover:bg-ivory"
              >
                <ProductThumb product={p} className="h-14 w-14 flex-none rounded-sm" />
                <div>
                  <p className="line-clamp-1 text-body font-medium text-charcoal">{p.name}</p>
                  <Price basePrice={p.basePrice} salePrice={p.salePrice} size="sm" />
                </div>
              </Link>
            ))}
          </div>
        )}
        {query.trim().length >= 2 && results.length === 0 && (
          <p className="mt-4 text-body text-charcoal-muted">No results found for &quot;{query}&quot;.</p>
        )}
      </div>
    </div>
  );
}
