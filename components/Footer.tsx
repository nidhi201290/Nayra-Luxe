'use client';

import Link from 'next/link';
import { Instagram, Facebook, Send } from 'lucide-react';
import Logo from './Logo';
import { categories } from '@/lib/mock-data';

export default function Footer() {
  return (
    <footer className="bg-charcoal">
      <div className="section section-y grid grid-cols-2 gap-8 md:grid-cols-5">
        <div className="col-span-2 space-y-3">
          <Logo dark />
          <p className="max-w-xs text-body text-white/70">
            Anti-tarnish, 18K gold-plated jewelry crafted on 316L stainless steel — made for everyday luxe.
          </p>
          <div className="flex gap-3 pt-2">
            <a
              href="https://www.instagram.com/nayra_luxe/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-gold-primary hover:text-gold-primary"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-gold-primary hover:text-gold-primary"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-h4 text-white">Shop</h4>
          <ul className="space-y-2 text-body text-white/70">
            <li><Link href="/shop" className="hover:text-gold-primary">All Products</Link></li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-gold-primary">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-h4 text-white">Support</h4>
          <ul className="space-y-2 text-body text-white/70">
            <li><Link href="/contact" className="hover:text-gold-primary">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-gold-primary">FAQ</Link></li>
            <li><Link href="/policies/shipping" className="hover:text-gold-primary">Shipping Policy</Link></li>
            <li><Link href="/policies/returns" className="hover:text-gold-primary">Return &amp; Exchange</Link></li>
            <li><Link href="/policies/privacy" className="hover:text-gold-primary">Privacy Policy</Link></li>
            <li><Link href="/policies/terms" className="hover:text-gold-primary">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-h4 text-white">Stay in the loop</h4>
          <p className="mb-3 text-body text-white/70">Offers, new arrivals and styling edits — straight to your inbox.</p>
          <form
            className="flex gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input type="email" required placeholder="Email address" className="input-field" />
            <button type="submit" aria-label="Subscribe" className="btn-primary px-3">
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-4 text-caption text-white/70">care@nayraluxe.com · +91 98115 53264</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section flex flex-col items-center justify-between gap-2 py-4 text-caption text-white/60 md:flex-row">
          <p>© {new Date().getFullYear()} Nayra Luxe. All rights reserved.</p>
          <p>Payments secured by Razorpay · UPI · Cards · Netbanking</p>
        </div>
      </div>
    </footer>
  );
}
