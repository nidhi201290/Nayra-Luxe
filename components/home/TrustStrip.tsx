import { Gem, ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';

const ITEMS = [
  { icon: ShieldCheck, label: 'Anti-Tarnish Guarantee' },
  { icon: Truck, label: 'Free Shipping over ₹1999' },
  // { icon: RotateCcw, label: 'Easy 7-Day Returns' },
  { icon: Gem, label: '18K Gold PVD Plated' },
  { icon: Gem, label: '316 Stainless Steel' },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-border bg-white">
      <div className="section flex flex-wrap items-center justify-center gap-6 py-6 md:justify-between md:gap-4">
        {ITEMS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-caption text-charcoal">
            <Icon className="h-5 w-5 flex-none text-gold-primary" />
            <span className="max-w-[110px] md:max-w-none">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
