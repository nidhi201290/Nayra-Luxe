'use client';

import { useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Product } from '@/lib/types';
import { categories } from '@/lib/mock-data';
import { useAdminProductStore } from '@/lib/admin-store';
import { cn } from '@/lib/utils';
import ProductCard from '../ProductCard';

type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'newest' | 'bestselling';

const SORT_LABELS: Record<SortOption, string> = {
  popularity: 'Popularity',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  newest: 'Newest',
  bestselling: 'Bestselling',
};

const COLORS = ['Gold', 'Rose Gold', 'Silver-tone'] as const;

export default function ShopExperience({
  products: staticProducts,
  showCategoryFilter = false,
  showFilters = true,
}: {
  products: Product[];
  showCategoryFilter?: boolean;
  showFilters?: boolean;
}) {
  const catalog = useAdminProductStore((s) => s.products);
  // Resolve each product against the live, admin-edited catalog so filtering/sorting
  // (price range, etc.) matches what's actually displayed — see useLiveProduct.
  const products = useMemo(
    () => staticProducts.map((p) => catalog.find((c) => c.id === p.id) ?? p),
    [staticProducts, catalog]
  );

  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>('popularity');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.salePrice <= maxPrice);
    if (showCategoryFilter && selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.categorySlug));
    }
    if (selectedColors.length > 0) {
      list = list.filter((p) => p.variants.some((v) => v.color && selectedColors.includes(v.color)));
    }
    if (inStockOnly) {
      list = list.filter((p) => p.variants.some((v) => v.stock > 0));
    }

    const sorted = [...list];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case 'newest':
        sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case 'bestselling':
        sorted.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller));
        break;
      default:
        sorted.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
    }
    return sorted;
  }, [products, sort, selectedCategories, selectedColors, maxPrice, inStockOnly, showCategoryFilter]);

  function toggleCategory(slug: string) {
    setSelectedCategories((prev) => (prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]));
  }

  function toggleColor(color: string) {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
  }

  function clearFilters() {
    setSelectedCategories([]);
    setSelectedColors([]);
    setMaxPrice(3000);
    setInStockOnly(false);
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedColors.length > 0 || inStockOnly || maxPrice < 3000;

  const FilterPanel = (
    <div className="space-y-8">
      {showCategoryFilter && (
        <div>
          <h4 className="mb-3 text-h4">Category</h4>
          <div className="space-y-2">
            {categories.map((c) => (
              <label key={c.slug} className="flex items-center gap-2 text-body text-charcoal">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(c.slug)}
                  onChange={() => toggleCategory(c.slug)}
                  className="h-4 w-4 accent-[#AA7717]"
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="mb-3 text-h4">Price up to ₹{maxPrice}</h4>
        <input
          type="range"
          min={300}
          max={3000}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#AA7717]"
        />
      </div>

      <div>
        <h4 className="mb-3 text-h4">Color / Plating</h4>
        <div className="space-y-2">
          {COLORS.map((color) => (
            <label key={color} className="flex items-center gap-2 text-body text-charcoal">
              <input
                type="checkbox"
                checked={selectedColors.includes(color)}
                onChange={() => toggleColor(color)}
                className="h-4 w-4 accent-[#AA7717]"
              />
              {color}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-body text-charcoal">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 accent-[#AA7717]"
          />
          In Stock Only
        </label>
      </div>

      {hasActiveFilters && (
        <button onClick={clearFilters} className="btn-text text-caption">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="section section-y">
      <div className="flex gap-8">
        {showFilters && <aside className="hidden w-56 flex-none md:block">{FilterPanel}</aside>}

        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              {showFilters && (
                <button
                  onClick={() => setFilterOpen(true)}
                  className="flex items-center gap-2 text-body font-medium text-charcoal md:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
              )}
              <p className="text-caption text-charcoal-muted">{filtered.length} products</p>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="input-field w-auto py-2 text-body"
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedCategories.map((c) => (
                <span key={c} className="pill flex items-center gap-1 bg-blush text-gold-primary">
                  {categories.find((cat) => cat.slug === c)?.name}
                  <button onClick={() => toggleCategory(c)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {selectedColors.map((c) => (
                <span key={c} className="pill flex items-center gap-1 bg-blush text-gold-primary">
                  {c}
                  <button onClick={() => toggleColor(c)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-body-lg text-charcoal-muted">No products match your filters</p>
              <button onClick={clearFilters} className="btn-secondary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              className={cn(
                'grid grid-cols-2 gap-3 tablet:grid-cols-3 tablet:gap-4',
                showFilters ? 'desktop:grid-cols-3 desktop:gap-6' : 'desktop:grid-cols-4 desktop:gap-6'
              )}
            >
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showFilters && filterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button aria-label="Close filters" className="absolute inset-0 bg-charcoal/40" onClick={() => setFilterOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 overflow-y-auto bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-h4">Filters</h3>
              <button onClick={() => setFilterOpen(false)} aria-label="Close">
                <X className="h-5 w-5 text-charcoal" />
              </button>
            </div>
            {FilterPanel}
            <button onClick={() => setFilterOpen(false)} className="btn-primary mt-8 w-full">
              Show {filtered.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
