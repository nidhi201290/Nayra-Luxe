'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { categories } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function NavCategoryDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function scheduleClose() {
    closeTimeout.current = setTimeout(() => setOpen(false), 150);
  }

  function cancelClose() {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 font-display text-[16px] font-medium uppercase text-charcoal transition-colors hover:text-gold-primary"
      >
        Category
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        // pt-3 (not a margin) keeps the gap between the button and the panel inside this
        // element's hoverable box — a margin-based gap here is a dead zone the pointer can
        // slip through, firing onMouseLeave before the user reaches the links below.
        <div className="absolute left-1/2 top-full z-40 w-52 -translate-x-1/2 pt-3">
          <div className="rounded-md border border-border bg-white py-2 shadow-lg">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-body text-charcoal transition-colors hover:bg-ivory hover:text-gold-primary"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
