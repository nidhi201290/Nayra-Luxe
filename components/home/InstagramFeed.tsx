import { Instagram } from 'lucide-react';
import ProductImage from '../ProductImage';

export default function InstagramFeed() {
  return (
    <section className="section section-y">
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Follow Along</p>
        <h2 className="text-h2">@nayra_luxe on Instagram</h2>
      </div>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <a
            key={i}
            href="https://www.instagram.com/nayra_luxe/"
            target="_blank"
            rel="noreferrer"
            className="group relative block overflow-hidden rounded-sm"
          >
            <ProductImage seed={i * 5} name="Nayra Luxe" className="transition-transform duration-200 group-hover:scale-105" />
            <div className="absolute inset-0 flex items-center justify-center bg-charcoal/0 transition-colors group-hover:bg-charcoal/30">
              <Instagram className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
