'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ShieldCheck } from 'lucide-react';
import { getCartDetails, useCartStore, useOrderStore } from '@/lib/store';
import { useAdminProductStore } from '@/lib/admin-store';
import { computeDiscount, computeShipping, computeSubtotal, computeTotal } from '@/lib/cart-utils';
import { coupons } from '@/lib/mock-data';
import { formatINR } from '@/lib/utils';
import { Order, OrderItem } from '@/lib/types';
import Price from '../Price';
import ProductThumb from '../ProductThumb';

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

export default function CheckoutForm() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const clearCart = useCartStore((s) => s.clear);
  const addOrder = useOrderStore((s) => s.addOrder);
  const catalog = useAdminProductStore((s) => s.products);

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const details = getCartDetails(lines, catalog);
  const subtotal = computeSubtotal(details);
  const appliedCoupon = coupons.find((c) => c.code === appliedCode) || null;
  const discount = computeDiscount(subtotal, appliedCoupon);
  const shipping = computeShipping(subtotal);
  const total = computeTotal(subtotal, discount, shipping);

  function applyCoupon() {
    const match = coupons.find((c) => c.code.toLowerCase() === couponInput.trim().toLowerCase());
    if (match && subtotal >= match.minOrderValue) setAppliedCode(match.code);
  }

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      const orderId = `ord-${Date.now()}`;
      const items: OrderItem[] = details.map((d) => ({
        productId: d.product.id,
        productName: d.product.name,
        variantLabel: d.variant?.size ? `Size ${d.variant.size}` : d.variant?.color || '',
        price: d.product.salePrice,
        quantity: d.line.quantity,
      }));

      const order: Order = {
        id: orderId,
        orderNumber: `NL${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'Confirmed',
        items,
        subtotal,
        discount,
        shippingFee: shipping,
        total,
        createdAt: new Date().toISOString(),
        address: {
          id: `addr-${Date.now()}`,
          fullName,
          phone,
          line1,
          line2,
          city,
          state: stateVal,
          pincode,
          landmark,
          isDefault: false,
        },
      };

      addOrder(order);
      clearCart();
      router.push(`/order-confirmation?orderId=${orderId}`);
    }, 1200);
  }

  if (details.length === 0) {
    return (
      <div className="section section-y text-center">
        <p className="text-body-lg text-charcoal-muted">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary mt-4 inline-flex">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handlePlaceOrder} className="section section-y grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <section>
          <h2 className="mb-4 font-body text-h4">1. Contact Info</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="input-field" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" className="input-field" />
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-body text-h4">2. Shipping Address</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="input-field md:col-span-2" />
            <input required value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Address Line 1" className="input-field md:col-span-2" />
            <input value={line2} onChange={(e) => setLine2(e.target.value)} placeholder="Address Line 2 (optional)" className="input-field md:col-span-2" />
            <input required value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="input-field" />
            <input required value={stateVal} onChange={(e) => setStateVal(e.target.value)} placeholder="State" className="input-field" />
            <input
              required
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Pincode"
              className="input-field"
            />
            <input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Landmark (optional)" className="input-field" />
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-body text-h4">3. Delivery Method</h2>
          <div className="rounded-md border border-gold-primary bg-blush p-4 text-body text-charcoal">
            Standard Delivery — Estimated in 4–6 business days
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-body text-h4">4. Payment Method</h2>
          <div className="space-y-2">
            {([
              ['upi', 'UPI'],
              ['card', 'Credit / Debit Card'],
              ['netbanking', 'Netbanking'],
              ['wallet', 'Wallets'],
            ] as [PaymentMethod, string][]).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-3 rounded-md border border-border p-3 text-body text-charcoal has-[:checked]:border-gold-primary has-[:checked]:bg-blush"
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === value}
                  onChange={() => setPaymentMethod(value)}
                  className="h-4 w-4 accent-[#AA7717]"
                />
                {label}
              </label>
            ))}
          </div>
          <p className="mt-3 text-caption text-charcoal-muted">
            Online prepaid payment only via Razorpay — Cash on Delivery is not available.
          </p>
        </section>
      </div>

      <div className="rounded-md border border-border p-6 lg:sticky lg:top-24 lg:h-fit">
        <h2 className="mb-4 font-body text-h4">Order Summary</h2>
        <ul className="mb-4 space-y-3">
          {details.map(({ line, product, variant }) => (
            <li key={`${line.productId}-${line.variantId}`} className="flex gap-3">
              <ProductThumb product={product} className="h-14 w-14 flex-none rounded-sm" />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-body text-charcoal">{product.name}</p>
                <p className="text-caption text-charcoal-muted">
                  {variant?.size ? `Size ${variant.size}` : variant?.color} · Qty {line.quantity}
                </p>
              </div>
              <Price basePrice={product.basePrice * line.quantity} salePrice={product.salePrice * line.quantity} size="sm" />
            </li>
          ))}
        </ul>

        {!appliedCoupon && (
          <div className="mb-4 flex gap-2">
            <input value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} placeholder="Coupon code" className="input-field" />
            <button type="button" onClick={applyCoupon} className="btn-secondary flex-none px-4">Apply</button>
          </div>
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
          <div className="flex justify-between border-t border-border pt-2 text-h4 text-charcoal">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
        </div>

        <button type="submit" disabled={processing} className="btn-primary mt-6 w-full">
          {processing ? 'Processing Payment…' : `Place Order — ${formatINR(total)}`}
        </button>

        <div className="mt-4 flex items-center justify-center gap-4 text-caption text-charcoal-muted">
          <span className="flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> SSL Secure</span>
          <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> 100% Secure Payments</span>
        </div>
      </div>
    </form>
  );
}
