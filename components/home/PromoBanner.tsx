import { coupons } from '@/lib/mock-data';

export default function PromoBanner() {
  return (
    <section className="section">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className="flex items-center justify-between rounded-md bg-blush px-6 py-5"
          >
            <div>
              <p className="text-body-lg font-medium text-charcoal">
                {coupon.discountType === 'flat' ? `Get ₹${coupon.discountValue} off` : `Get ${coupon.discountValue}% off`}
              </p>
              <p className="text-caption text-charcoal-muted">On orders above ₹{coupon.minOrderValue}</p>
            </div>
            <span className="rounded-full border border-gold-primary bg-white px-4 py-2 text-body font-semibold tracked-caps text-charcoal">
              {coupon.code}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
