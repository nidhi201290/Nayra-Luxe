'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Heart, Menu, Search, User, X } from 'lucide-react';
import Logo from './Logo';
import { useWishlistStore } from '@/lib/store';
import SearchOverlay from './SearchOverlay';
import NavCategoryDropdown from './NavCategoryDropdown';
import { categories } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/shop', label: 'All Products' },
  { href: '/collection/bestsellers', label: 'Collections' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
        <div className="section flex h-16 items-center justify-between md:h-20">
          <button
            type="button"
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6 text-charcoal" />
          </button>

          <Logo className="mx-auto md:mx-0" />

          <nav className="hidden items-center gap-6 md:flex">
            <NavCategoryDropdown />
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-[16px] font-medium uppercase text-charcoal transition-colors hover:text-gold-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5 text-charcoal transition-colors hover:text-gold-primary" />
            </button>
            <Link href="/login" aria-label="Account" className="hidden md:block">
              <User className="h-5 w-5 text-charcoal transition-colors hover:text-gold-primary" />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="relative">
              <Heart className="h-5 w-5 text-charcoal transition-colors hover:text-gold-primary" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold-primary text-[10px] text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-charcoal/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex h-full w-72 flex-col gap-6 bg-ivory p-6">
            <div className="flex items-center justify-between">
              <Logo />
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5 text-charcoal" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              <Link href="/" className="font-display text-[16px] font-medium uppercase text-charcoal" onClick={() => setMobileOpen(false)}>
                Home
              </Link>

              <div>
                <button
                  type="button"
                  aria-expanded={mobileCategoryOpen}
                  onClick={() => setMobileCategoryOpen((v) => !v)}
                  className="flex w-full items-center justify-between font-display text-[16px] font-medium uppercase text-charcoal"
                >
                  Category
                  <ChevronDown className={cn('h-4 w-4 transition-transform', mobileCategoryOpen && 'rotate-180')} />
                </button>
                {mobileCategoryOpen && (
                  <div className="mt-3 flex flex-col gap-3 pl-4">
                    {categories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/category/${c.slug}`}
                        className="text-body text-charcoal-muted hover:text-gold-primary"
                        onClick={() => setMobileOpen(false)}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-display text-[16px] font-medium uppercase text-charcoal"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login" className="font-display text-[16px] font-medium uppercase text-charcoal" onClick={() => setMobileOpen(false)}>
                Login / Account
              </Link>
            </nav>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
