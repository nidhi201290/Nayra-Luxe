'use client';

import Link from 'next/link';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useCartStore, getCartDetails } from '@/lib/store';
import { useAdminProductStore } from '@/lib/admin-store';
import ProductThumb from './ProductThumb';
import WhatsAppIcon from './WhatsAppIcon';
import { formatINR } from '@/lib/utils';

const FREE_SHIPPING_THRESHOLD = 999;
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919811553264';

export default function MiniCartDrawer() {
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const lines = useCartStore((s) => s.lines);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const catalog = useAdminProductStore((s) => s.products);

  const details = getCartDetails(lines, catalog);
  const subtotal = details.reduce((sum, d) => sum + d.product.salePrice * d.line.quantity, 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const orderMessage = [
    `Hi, I'd like to order:`,
    '',
    ...details.map(({ line, product, variant }) => {
      const variantLabel = variant?.size ? `Size ${variant.size}` : variant?.color;
      return `${product.name}${variantLabel ? ` (${variantLabel})` : ''} × ${line.quantity} — ${formatINR(product.salePrice * line.quantity)}`;
    }),
    '',
    `Total: ${formatINR(subtotal)}`,
  ].join('\n');
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Close cart" className="absolute inset-0 bg-charcoal/40" onClick={closeDrawer} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="text-h4">Your Bag ({details.reduce((s, d) => s + d.line.quantity, 0)})</h3>
          <button aria-label="Close" onClick={closeDrawer}>
            <X className="h-5 w-5 text-charcoal" />
          </button>
        </div>

        {details.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-charcoal-muted" />
            <p className="text-body text-charcoal-muted">Your cart is empty</p>
            <button onClick={closeDrawer} className="btn-primary">
              <Link href="/shop">Continue Shopping</Link>
            </button>
          </div>
        ) : (
          <>
            <div className="border-b border-border p-4">
              {remaining > 0 ? (
                <p className="mb-2 text-caption text-charcoal-muted">
                  Add <span className="font-semibold text-gold-primary">{formatINR(remaining)}</span> more for free shipping
                </p>
              ) : (
                <p className="mb-2 text-caption font-medium text-success">You&apos;ve unlocked free shipping!</p>
              )}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-gold-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-4">
                {details.map(({ line, product, variant }) => (
                  <li key={`${line.productId}-${line.variantId}`} className="flex gap-3">
                    <ProductThumb product={product} className="h-20 w-20 flex-none rounded-sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <Link href={`/product/${product.slug}`} onClick={closeDrawer} className="line-clamp-2 min-w-0 text-body font-medium text-charcoal">
                          {product.name}
                        </Link>
                        <button aria-label="Remove" onClick={() => removeItem(line.productId, line.variantId)}>
                          <X className="h-4 w-4 text-charcoal-muted" />
                        </button>
                      </div>
                      {variant && (
                        <p className="text-caption text-charcoal-muted">{variant.size ? `Size ${variant.size}` : variant.color}</p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-sm border border-border">
                          <button
                            aria-label="Decrease quantity"
                            className="px-2 py-1"
                            onClick={() => updateQuantity(line.productId, line.variantId, line.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-body">{line.quantity}</span>
                          <button
                            aria-label="Increase quantity"
                            className="px-2 py-1"
                            onClick={() => updateQuantity(line.productId, line.variantId, line.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-body font-semibold text-charcoal">
                          {formatINR(product.salePrice * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 border-t border-border p-4">
              <div className="flex justify-between text-body-lg font-medium text-charcoal">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <Link href="/cart" onClick={closeDrawer} className="btn-secondary w-full">
                View Cart
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={closeDrawer}
                className="btn-primary flex w-full items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp/90"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Order on WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
