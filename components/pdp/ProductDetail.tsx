'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Heart, Instagram, Link2, MessageCircle, ShieldCheck, RotateCcw, Lock, Truck, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import ImageGallery from './ImageGallery';
import Price from '../Price';
import PincodeCheck from './PincodeCheck';
import ProductCarousel from '../home/ProductCarousel';
import { useWishlistStore } from '@/lib/store';
import { useLiveProduct } from '@/lib/admin-store';
import { getRelatedProducts } from '@/lib/mock-data';
import { cn, formatINR } from '@/lib/utils';
import WhatsAppIcon from '../WhatsAppIcon';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919811553264';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nayraluxe.com';

type Tab = 'details' | 'care' | 'shipping' | 'size-guide';

const TABS: { id: Tab; label: string }[] = [
  { id: 'details', label: 'Product Details' },
  { id: 'care', label: 'Care Instructions' },
  { id: 'shipping', label: 'Shipping & Returns' },
];

export default function ProductDetail({ product: staticProduct }: { product: Product }) {
  const product = useLiveProduct(staticProduct);
  const isRing = product.categorySlug === 'rings';
  const tabs = isRing ? [...TABS, { id: 'size-guide' as Tab, label: 'Size Guide' }] : TABS;

  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>('details');

  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const related = useMemo(() => getRelatedProducts(product), [product]);

  const ratingBreakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    product.reviews.forEach((r) => {
      counts[5 - r.rating] += 1;
    });
    return counts;
  }, [product.reviews]);

  const outOfStock = selectedVariant ? selectedVariant.stock === 0 : false;

  const variantLabel = selectedVariant?.size ? `Size ${selectedVariant.size}` : selectedVariant?.color;
  const orderMessage = [
    `Hi, I'd like to order:`,
    '',
    `${product.name}${variantLabel ? ` (${variantLabel})` : ''} × ${quantity}`,
    `Price: ${formatINR(product.salePrice * quantity)}`,
    '',
    `${SITE_URL}/product/${product.slug}`,
  ].join('\n');
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`;

  return (
    <div className="section section-y">
      <p className="mb-6 text-caption text-charcoal-muted">
        <Link href="/" className="hover:text-gold-primary">Home</Link> {' / '}
        <Link href={`/category/${product.categorySlug}`} className="hover:text-gold-primary capitalize">
          {product.categorySlug.replace('-', ' ')}
        </Link>{' '}
        / {product.name}
      </p>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <ImageGallery product={product} />

        <div>
          <h1 className="text-h1">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-caption text-charcoal-muted">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn('h-4 w-4', i < Math.round(product.rating) ? 'fill-gold-primary text-gold-primary' : 'text-border')}
                />
              ))}
            </div>
            <a href="#reviews" className="hover:text-gold-primary">
              {product.rating} ({product.reviewCount} reviews)
            </a>
          </div>

          <div className="mt-4">
            <Price basePrice={product.basePrice} salePrice={product.salePrice} size="lg" />
            <p className="mt-1 text-caption text-charcoal-muted">Incl. of all taxes</p>
          </div>

          <p className="mt-4 text-body-lg text-charcoal-muted">{product.description}</p>

          <div className="mt-6">
            <p className="mb-2 text-body font-medium text-charcoal">
              {isRing ? 'Select Size' : 'Select Color'}
              {isRing && (
                <button className="btn-text ml-2 text-caption">Size Guide</button>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  disabled={v.stock === 0}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={cn(
                    'rounded-md border px-4 py-2 text-body transition-colors',
                    v.id === selectedVariantId
                      ? 'border-gold-primary bg-blush text-gold-primary'
                      : 'border-border text-charcoal hover:border-gold-primary',
                    v.stock === 0 && 'cursor-not-allowed border-border text-charcoal-muted opacity-50 line-through'
                  )}
                >
                  {v.size ? `Size ${v.size}` : v.color}
                </button>
              ))}
            </div>
            {outOfStock && <p className="mt-2 text-caption text-error">This variant is out of stock.</p>}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-sm border border-border">
              <button
                aria-label="Decrease quantity"
                className="px-3 py-2"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="px-3 text-body">{quantity}</span>
              <button aria-label="Increase quantity" className="px-3 py-2" onClick={() => setQuantity((q) => q + 1)}>
                +
              </button>
            </div>
            <button aria-label="Toggle wishlist" onClick={() => toggle(product.id)} className="flex items-center gap-2 text-body text-charcoal">
              <Heart className={cn('h-5 w-5', wishlisted ? 'fill-gold-primary text-gold-primary' : 'text-charcoal')} />
              Wishlist
            </button>
          </div>

          <div className="mt-6">
            <a
              href={outOfStock ? undefined : whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-disabled={outOfStock}
              className={cn(
                'btn-primary flex w-full items-center justify-center gap-2',
                outOfStock && 'pointer-events-none opacity-50'
              )}
            >
              <WhatsAppIcon className="h-5 w-5" />
              Order on WhatsApp
            </a>
          </div>

          <div className="mt-6">
            <PincodeCheck />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-caption text-charcoal-muted md:grid-cols-4">
            <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-gold-primary" /> Anti-Tarnish</div>
            <div className="flex items-center gap-1.5"><RotateCcw className="h-4 w-4 text-gold-primary" /> 7-Day Return</div>
            <div className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-gold-primary" /> Secure Payment</div>
            <div className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-gold-primary" /> Fast Dispatch</div>
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
            <span className="text-caption text-charcoal-muted">Share:</span>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Check out ${product.name} on Nayra Luxe`)}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Share on WhatsApp"
            >
              <MessageCircle className="h-4 w-4 text-charcoal hover:text-gold-primary" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Share on Instagram">
              <Instagram className="h-4 w-4 text-charcoal hover:text-gold-primary" />
            </a>
            <button aria-label="Copy link" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
              <Link2 className="h-4 w-4 text-charcoal hover:text-gold-primary" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex flex-wrap gap-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'border-b-2 pb-3 text-body font-medium transition-colors',
                activeTab === tab.id ? 'border-gold-primary text-gold-primary' : 'border-transparent text-charcoal-muted'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="py-6 text-body text-charcoal-muted">
          {activeTab === 'details' && (
            <ul className="list-inside list-disc space-y-1">
              {product.details.map((d) => <li key={d}>{d}</li>)}
              <li>SKU: {product.sku}</li>
            </ul>
          )}
          {activeTab === 'care' && (
            <ul className="list-inside list-disc space-y-1">
              {product.care.map((c) => <li key={c}>{c}</li>)}
            </ul>
          )}
          {activeTab === 'shipping' && (
            <p>
              Free shipping on orders above ₹999. Dispatched within 1-2 business days via Shiprocket. Easy
              7-day returns/exchanges on unworn items in original packaging — see our{' '}
              <Link href="/policies/returns" className="text-gold-primary hover:underline">Return Policy</Link> for details.
            </p>
          )}
          {activeTab === 'size-guide' && (
            <p>
              Not sure of your ring size? Wrap a strip of paper around your finger, mark where it overlaps, and
              measure the length in millimeters to match against our size chart. Sizes 5–9 available.
            </p>
          )}
        </div>
      </div>

      <div id="reviews" className="mt-16 border-t border-border pt-10">
        <h2 className="mb-6 text-h2">Reviews & Ratings</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <p className="text-display text-charcoal">{product.rating}</p>
            <div className="mb-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn('h-4 w-4', i < Math.round(product.rating) ? 'fill-gold-primary text-gold-primary' : 'text-border')} />
              ))}
            </div>
            <p className="mb-4 text-caption text-charcoal-muted">{product.reviewCount} verified reviews</p>
            {ratingBreakdown.map((count, i) => (
              <div key={i} className="mb-1 flex items-center gap-2 text-caption text-charcoal-muted">
                <span className="w-8">{5 - i}★</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full bg-gold-primary"
                    style={{ width: `${product.reviews.length ? (count / product.reviews.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-4">{count}</span>
              </div>
            ))}
          </div>

          <div className="md:col-span-2">
            <div className="mb-6 rounded-md bg-ivory p-4 text-caption text-charcoal-muted">
              Only verified purchasers who have received a delivered order can write a review. You&apos;ll get a
              &quot;Rate your purchase&quot; prompt in your order history once your item is delivered.
            </div>
            <ul className="space-y-6">
              {product.reviews.map((r) => (
                <li key={r.id} className="border-b border-border pb-6 last:border-none">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-body font-medium text-charcoal">{r.author}</span>
                    {r.verified && <span className="pill bg-blush text-caption text-gold-primary">Verified Purchase</span>}
                  </div>
                  <div className="mb-2 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn('h-3.5 w-3.5', i < r.rating ? 'fill-gold-primary text-gold-primary' : 'text-border')} />
                    ))}
                  </div>
                  <p className="text-body text-charcoal-muted">{r.comment}</p>
                  <p className="mt-1 text-caption text-charcoal-muted">{r.date}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <ProductCarousel
            eyebrow="Complete the look"
            title="You May Also Like"
            products={related}
            viewAllHref={`/category/${product.categorySlug}`}
          />
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-border bg-white p-3 shadow-lg md:hidden">
        <div>
          <p className="line-clamp-1 text-caption text-charcoal">{product.name}</p>
          <Price basePrice={product.basePrice} salePrice={product.salePrice} size="sm" />
        </div>
        <a
          href={outOfStock ? undefined : whatsappHref}
          target="_blank"
          rel="noreferrer"
          aria-disabled={outOfStock}
          className={cn(
            'btn-primary flex flex-none items-center gap-2',
            outOfStock && 'pointer-events-none opacity-50'
          )}
        >
          <WhatsAppIcon className="h-4 w-4" />
          Order on WhatsApp
        </a>
      </div>
    </div>
  );
}
