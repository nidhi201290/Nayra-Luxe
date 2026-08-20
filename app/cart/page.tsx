'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { getCartDetails, useCartStore } from '@/lib/store';
import { useAdminProductStore } from '@/lib/admin-store';
import { computeDiscount, computeShipping, computeSubtotal, computeTotal, FREE_SHIPPING_THRESHOLD } from '@/lib/cart-utils';
import { coupons, getProductsByCollection } from '@/lib/mock-data';
import ProductThumb from '@/components/ProductThumb';
import Price from '@/components/Price';
import { formatINR } from '@/lib/utils';
import ProductCarousel from '@/components/home/ProductCarousel';

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const catalog = useAdminProductStore((s) => s.products);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');

  const details = getCartDetails(lines, catalog);
  const subtotal = computeSubtotal(details);
  const appliedCoupon = coupons.find((c) => c.code === appliedCode) || null;
  const discount = computeDiscount(subtotal, appliedCoupon);
  const shipping = computeShipping(subtotal);
  const total = computeTotal(subtotal, discount, shipping);
  const recommended = getProductsByCollection('bestsellers').slice(0, 4);

  function applyCoupon() {
    const match = coupons.find((c) => c.code.toLowerCase() === couponInput.trim().toLowerCase());
    if (!match) {
      setCouponError('Invalid coupon code');
      setAppliedCode(null);
      return;
    }
    if (subtotal < match.minOrderValue) {
      setCouponError(`Minimum order value ₹${match.minOrderValue} required`);
      setAppliedCode(null);
      return;
    }
    setCouponError('');
    setAppliedCode(match.code);
  }

  if (details.length === 0) {
    return (
      <div className="section section-y flex flex-col items-center gap-4 py-24 text-center">
        <ShoppingBag className="h-14 w-14 text-charcoal-muted" />
        <h1 className="text-h2">Your cart is empty</h1>
        <Link href="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="section section-y">
      <h1 className="mb-6 text-h1">Your Cart</h1>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="divide-y divide-border rounded-md border border-border">
            {details.map(({ line, product, variant }) => (
              <li key={`${line.productId}-${line.variantId}`} className="flex gap-4 p-4">
                <ProductThumb product={product} className="h-24 w-24 flex-none rounded-sm" />
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-2">
                    <div className="min-w-0">
                      <Link href={`/product/${product.slug}`} className="line-clamp-2 text-body-lg font-medium text-charcoal hover:text-gold-primary">
                        {product.name}
                      </Link>
                      {variant && (
                        <p className="text-caption text-charcoal-muted">{variant.size ? `Size ${variant.size}` : variant.color}</p>
                      )}
                    </div>
                    <button aria-label="Remove item" onClick={() => removeItem(line.productId, line.variantId)}>
                      <X className="h-4 w-4 text-charcoal-muted" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-sm border border-border">
                      <button
                        aria-label="Decrease quantity"
                        className="px-2 py-1"
                        onClick={() => updateQuantity(line.productId, line.variantId, line.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-body">{line.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        className="px-2 py-1"
                        onClick={() => updateQuantity(line.productId, line.variantId, line.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <Price basePrice={product.basePrice * line.quantity} salePrice={product.salePrice * line.quantity} size="sm" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border border-border p-6 lg:sticky lg:top-24 lg:h-fit">
          <h2 className="mb-4 font-body text-h4">Order Summary</h2>
          <div className="mb-4 flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              placeholder="Coupon code"
              className="input-field"
            />
            <button onClick={applyCoupon} className="btn-secondary flex-none px-4">Apply</button>
          </div>
          {couponError && <p className="mb-3 text-caption text-error">{couponError}</p>}
          {appliedCoupon && (
            <p className="mb-3 text-caption text-success">Coupon {appliedCoupon.code} applied</p>
          )}

          <div className="space-y-2 border-t border-border pt-4 text-body">
            <div className="flex justify-between text-charcoal">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{formatINR(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-charcoal">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-caption text-charcoal-muted">
                Add {formatINR(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
              </p>
            )}
            <div className="flex justify-between border-t border-border pt-2 text-h4 text-charcoal">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>

          <Link href="/checkout" className="btn-primary mt-6 w-full">Proceed to Checkout</Link>
        </div>
      </div>

      <div className="mt-16">
        <ProductCarousel eyebrow="Add these" title="You Might Also Like" products={recommended} viewAllHref="/shop" />
      </div>
    </div>
  );
}
