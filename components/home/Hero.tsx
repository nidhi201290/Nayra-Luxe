'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import SiteImage from '../SiteImage';

const SLIDES = [
  { key: 'hero-slide-1', href: '/collection/new-arrivals', title: 'Everyday Luxe, Made to Last' },
  { key: 'hero-slide-2', href: '/collection/bestsellers', title: 'Loved On Repeat' },
  { key: 'hero-slide-3', href: '/collection/wedding-edit', title: 'The Wedding Edit' },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative min-h-[420px] overflow-hidden md:min-h-[560px]">
      <Link href={slide.href} aria-label={slide.title} className="absolute inset-0 z-0 block">
        <SiteImage
          slotKey={`${slide.key}-desktop`}
          fallbackSeed={index}
          fallbackName={slide.title}
          className="hidden aspect-auto h-full w-full md:block"
        />
        <SiteImage
          slotKey={`${slide.key}-mobile`}
          fallbackSeed={index}
          fallbackName={slide.title}
          className="aspect-auto h-full w-full md:hidden"
        />
      </Link>

      <button
        aria-label="Previous slide"
        onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-sm md:block"
      >
        <ChevronLeft className="h-5 w-5 text-charcoal" />
      </button>
      <button
        aria-label="Next slide"
        onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-sm md:block"
      >
        <ChevronRight className="h-5 w-5 text-charcoal" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn('h-1.5 rounded-full transition-all', i === index ? 'w-6 bg-gold-primary' : 'w-1.5 bg-charcoal/30')}
          />
        ))}
      </div>
    </section>
  );
}
