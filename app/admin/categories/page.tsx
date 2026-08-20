'use client';

import { categories, collections } from '@/lib/mock-data';
import { useAdminProductStore } from '@/lib/admin-store';

export default function AdminCategoriesPage() {
  const products = useAdminProductStore((s) => s.products);

  return (
    <div>
      <h1 className="mb-6 text-h1">Categories &amp; Collections</h1>

      <div className="mb-10">
        <h2 className="mb-4 font-body text-h4">Categories</h2>
        <div className="overflow-x-auto rounded-md border border-border bg-white">
          <table className="w-full text-left text-body">
            <thead className="border-b border-border bg-ivory text-caption uppercase text-charcoal-muted">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Products</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.slug} className="border-b border-border last:border-none">
                  <td className="p-3 font-medium text-charcoal">{c.name}</td>
                  <td className="p-3 text-charcoal-muted">/{c.slug}</td>
                  <td className="p-3 text-charcoal-muted">{products.filter((p) => p.categorySlug === c.slug).length}</td>
                  <td className="p-3 text-charcoal-muted">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-caption text-charcoal-muted">Editing categories requires a connected database — currently seeded from the catalog structure.</p>
      </div>

      <div>
        <h2 className="mb-4 font-body text-h4">Collections</h2>
        <div className="overflow-x-auto rounded-md border border-border bg-white">
          <table className="w-full text-left text-body">
            <thead className="border-b border-border bg-ivory text-caption uppercase text-charcoal-muted">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Products</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((c) => (
                <tr key={c.slug} className="border-b border-border last:border-none">
                  <td className="p-3 font-medium text-charcoal">{c.name}</td>
                  <td className="p-3 text-charcoal-muted">/{c.slug}</td>
                  <td className="p-3 text-charcoal-muted">{products.filter((p) => p.collectionSlugs.includes(c.slug)).length}</td>
                  <td className="p-3 text-charcoal-muted">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
