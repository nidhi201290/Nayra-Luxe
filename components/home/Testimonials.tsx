import { Star } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Priya S.', quote: "Wore my necklace every day for 3 months, still looks brand new. Obsessed with the quality.", rating: 5 },
  { name: 'Ananya R.', quote: 'Ordered a ring as a gift and it arrived beautifully packaged. My friend loved it!', rating: 5 },
  { name: 'Simran K.', quote: 'Finally jewelry that survives my gym sessions and doesn’t turn my skin green. 10/10.', rating: 4 },
  { name: 'Neha M.', quote: 'The earrings are so lightweight and the gold plating hasn’t faded at all.', rating: 5 },
];

export default function Testimonials() {
  return (
    <section className="section section-y">
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Loved by customers</p>
        <h2 className="text-h2">What They're Saying</h2>
      </div>
      <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="card w-[80%] flex-none snap-start p-5 md:w-auto">
            <div className="mb-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-gold-primary text-gold-primary' : 'text-border'}`} />
              ))}
            </div>
            <p className="mb-3 text-body text-charcoal">&quot;{t.quote}&quot;</p>
            <p className="text-caption font-medium text-charcoal-muted">— {t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
