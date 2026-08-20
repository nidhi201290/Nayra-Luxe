import type { Metadata } from 'next';
import { ShieldCheck, Droplets, Sparkles } from 'lucide-react';
import SiteImage from '@/components/SiteImage';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'The Nayra Luxe story — anti-tarnish, 18K gold plated jewelry made for everyday luxe.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Us',
    description: 'The Nayra Luxe story — anti-tarnish, 18K gold plated jewelry made for everyday luxe.',
    url: '/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div>
      <SiteImage slotKey="about-banner" fallbackSeed={4} fallbackName="About Nayra Luxe" className="aspect-[16/7] max-h-80" />
      <div className="section section-y max-w-3xl">
        <p className="eyebrow mb-3">Our Story</p>
        <h1 className="mb-6 text-h1">Jewelry That Keeps Up With You</h1>
        <p className="mb-4 text-body-lg text-charcoal-muted">
          Nayra Luxe began the way most good ideas do — with a frustration. Beautiful jewelry that turned
          green within weeks, that couldn&apos;t survive a shower or a gym session, that had to be babied
          to last. We wanted jewelry that could actually be worn every single day.
        </p>
        <p className="mb-4 text-body-lg text-charcoal-muted">
          Every Nayra Luxe piece is crafted from 316L surgical-grade stainless steel and finished with a
          thick layer of 18K gold plating — the same combination used in premium waterproof jewelry
          worldwide. It doesn&apos;t tarnish, doesn&apos;t fade, and doesn&apos;t turn your skin green.
        </p>
        <p className="mb-10 text-body-lg text-charcoal-muted">
          What started as an Instagram page sharing pieces with a small community has grown into a full
          collection of necklaces, bracelets, rings and earrings — still designed with the same promise:
          quality you don&apos;t have to think twice about.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-md bg-blush p-6 text-center">
            <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-gold-primary" />
            <h3 className="mb-1 text-h4">Anti-Tarnish</h3>
            <p className="text-caption text-charcoal-muted">Won&apos;t fade, chip, or discolor with everyday wear.</p>
          </div>
          <div className="rounded-md bg-blush p-6 text-center">
            <Droplets className="mx-auto mb-3 h-8 w-8 text-gold-primary" />
            <h3 className="mb-1 text-h4">Waterproof</h3>
            <p className="text-caption text-charcoal-muted">Shower, swim, and sweat in it — worry-free.</p>
          </div>
          <div className="rounded-md bg-blush p-6 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-gold-primary" />
            <h3 className="mb-1 text-h4">Hypoallergenic</h3>
            <p className="text-caption text-charcoal-muted">Safe for sensitive skin, no nickel or lead.</p>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="mb-2 text-h4">A note from our founder</p>
          <p className="text-body-lg italic text-charcoal-muted">
            &quot;We built Nayra Luxe for the woman who wants jewelry that fits into her actual life — not
            jewelry she has to plan her life around. Thank you for trusting us with that.&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
