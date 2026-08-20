'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useAdminProductStore } from '@/lib/admin-store';
import { categories } from '@/lib/mock-data';
import { formatINR } from '@/lib/utils';
import { CategorySlug, Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { uploadImage } from '@/lib/upload';
import ProductThumb from '@/components/ProductThumb';

interface ProductFormValues {
  name: string;
  categorySlug: CategorySlug;
  basePrice: string;
  salePrice: string;
  sku: string;
  description: string;
}

function emptyForm(): ProductFormValues {
  return { name: '', categorySlug: categories[0].slug, basePrice: '', salePrice: '', sku: '', description: '' };
}

function formFromProduct(p: Product): ProductFormValues {
  return {
    name: p.name,
    categorySlug: p.categorySlug,
    basePrice: String(p.basePrice),
    salePrice: String(p.salePrice),
    sku: p.sku,
    description: p.description,
  };
}

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdminProductStore();
  const [query, setQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [photoProductId, setPhotoProductId] = useState<string | null>(null);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  const photoProduct = products.find((p) => p.id === photoProductId) || null;
  const editingProduct = products.find((p) => p.id === editingProductId) || null;

  function handleAdd(values: ProductFormValues) {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      slug: values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: values.name,
      categorySlug: values.categorySlug,
      collectionSlugs: [],
      basePrice: Number(values.basePrice),
      salePrice: Number(values.salePrice) || Number(values.basePrice),
      material: '316L Stainless Steel',
      plating: '18K Gold Plated',
      description: values.description || `${values.name} — 18K gold plated over 316L stainless steel.`,
      details: ['Material: 316L Stainless Steel base', 'Plating: 18K Gold Plated'],
      care: ['Wipe gently with a soft, dry cloth after wear'],
      sku: values.sku || `NL-NEW-${Math.floor(Math.random() * 1000)}`,
      isBestseller: false,
      isNew: true,
      status: 'draft',
      rating: 0,
      reviewCount: 0,
      variants: [{ id: `${Date.now()}-default`, color: 'Gold', stock: 0, skuSuffix: 'GD' }],
      reviews: [],
      imageHue: Math.floor(Math.random() * 360),
    };
    addProduct(newProduct);
    setShowAddForm(false);
  }

  function handleEdit(id: string, values: ProductFormValues) {
    updateProduct(id, {
      name: values.name,
      categorySlug: values.categorySlug,
      basePrice: Number(values.basePrice),
      salePrice: Number(values.salePrice) || Number(values.basePrice),
      sku: values.sku,
      description: values.description,
    });
    setEditingProductId(null);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-h1">Products</h1>
        <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2">
        <Search className="h-4 w-4 text-charcoal-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 bg-transparent text-body outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-md border border-border bg-white">
        <table className="w-full text-left text-body">
          <thead className="border-b border-border bg-ivory text-caption uppercase text-charcoal-muted">
            <tr>
              <th className="p-3">Photo</th>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
              return (
                <tr key={p.id} className="border-b border-border last:border-none">
                  <td className="p-3">
                    <button
                      onClick={() => setPhotoProductId(p.id)}
                      className="relative block h-14 w-14 overflow-hidden rounded-sm border border-border"
                      aria-label={`Manage photos for ${p.name}`}
                    >
                      <ProductThumb product={p} className="h-14 w-14" />
                      <span className="absolute inset-0 flex items-center justify-center bg-charcoal/0 opacity-0 transition-opacity hover:bg-charcoal/40 hover:opacity-100">
                        <ImagePlus className="h-4 w-4 text-white" />
                      </span>
                    </button>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-charcoal">{p.name}</p>
                    <p className="text-caption text-charcoal-muted">{p.sku}</p>
                  </td>
                  <td className="p-3 capitalize text-charcoal-muted">{p.categorySlug.replace('-', ' ')}</td>
                  <td className="p-3 text-charcoal">{formatINR(p.salePrice)}</td>
                  <td className={cn('p-3', totalStock <= 5 ? 'text-warning' : 'text-charcoal-muted')}>{totalStock}</td>
                  <td className="p-3">
                    <select
                      value={p.status}
                      onChange={(e) => updateProduct(p.id, { status: e.target.value as Product['status'] })}
                      className="rounded-sm border border-border bg-white px-2 py-1 text-caption"
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-3">
                      <button aria-label={`Edit ${p.name}`} onClick={() => setEditingProductId(p.id)}>
                        <Pencil className="h-4 w-4 text-charcoal-muted hover:text-gold-primary" />
                      </button>
                      <button aria-label={`Delete ${p.name}`} onClick={() => deleteProduct(p.id)}>
                        <Trash2 className="h-4 w-4 text-charcoal-muted hover:text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <ProductFormModal
          title="Add Product"
          initialValues={emptyForm()}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAdd}
        />
      )}

      {editingProduct && (
        <ProductFormModal
          title={`Edit — ${editingProduct.name}`}
          initialValues={formFromProduct(editingProduct)}
          onClose={() => setEditingProductId(null)}
          onSubmit={(values) => handleEdit(editingProduct.id, values)}
        />
      )}

      {photoProduct && (
        <PhotoManagerModal
          product={photoProduct}
          onClose={() => setPhotoProductId(null)}
          onChange={(images) => updateProduct(photoProduct.id, { images })}
        />
      )}
    </div>
  );
}

function ProductFormModal({
  title,
  initialValues,
  onClose,
  onSubmit,
}: {
  title: string;
  initialValues: ProductFormValues;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void;
}) {
  const [form, setForm] = useState<ProductFormValues>(initialValues);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4">
      <div className="w-full max-w-md rounded-md bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-body text-h4">{title}</h2>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
          />
          <select
            value={form.categorySlug}
            onChange={(e) => setForm({ ...form, categorySlug: e.target.value as CategorySlug })}
            className="input-field"
          >
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="number"
              placeholder="Base price"
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Sale price"
              value={form.salePrice}
              onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
              className="input-field"
            />
          </div>
          <input
            placeholder="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field"
          />
          <button type="submit" className="btn-primary w-full">Save Product</button>
        </form>
      </div>
    </div>
  );
}

function PhotoManagerModal({
  product,
  onClose,
  onChange,
}: {
  product: Product;
  onClose: () => void;
  onChange: (images: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const images = product.images || [];

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadImage(file));
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4">
      <div className="w-full max-w-lg rounded-md bg-white p-6">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-body text-h4">Photos — {product.name}</h2>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <p className="mb-4 text-caption text-charcoal-muted">
          The first photo is used as the primary image across the site. JPEG, PNG, WebP, or GIF — max 5MB each.
        </p>

        {images.length > 0 && (
          <div className="mb-4 grid grid-cols-4 gap-3">
            {images.map((src, i) => (
              <div key={src} className="group relative aspect-square overflow-hidden rounded-sm border border-border">
                <Image src={src} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 rounded-full bg-charcoal/70 px-2 py-0.5 text-[10px] text-white">Primary</span>
                )}
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5 text-charcoal" />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="mb-3 text-caption text-error">{error}</p>}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="btn-secondary flex w-full items-center justify-center gap-2"
        >
          <ImagePlus className="h-4 w-4" />
          {uploading ? 'Uploading…' : 'Upload Photos'}
        </button>
      </div>
    </div>
  );
}
