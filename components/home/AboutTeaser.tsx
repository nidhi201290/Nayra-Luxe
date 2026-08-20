import Link from 'next/link';

export default function AboutTeaser() {
  return (
    <section className="section section-y">
      <div className="mx-auto max-w-2xl rounded-lg bg-blush px-6 py-12 text-center md:px-16">
        <p className="eyebrow mb-3">Our Story</p>
        <h2 className="mb-4 text-h2">Jewelry That Keeps Up With You</h2>
        <p className="mb-6 text-body-lg text-charcoal-muted">
          Nayra Luxe started with a simple frustration — beautiful jewelry that tarnished within weeks.
          Every piece we make is 18K gold plated over 316L stainless steel, so it survives your gym
          sessions, your beach trips and your everyday life, without losing its shine.
        </p>
        <Link href="/about" className="btn-secondary">
          Learn More
        </Link>
      </div>
    </section>
  );
}
