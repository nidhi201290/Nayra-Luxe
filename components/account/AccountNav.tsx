'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/account', label: 'Profile' },
  { href: '/account/orders', label: 'Order History' },
  { href: '/wishlist', label: 'Wishlist' },
];

export default function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-border pb-px md:flex-col md:gap-1 md:overflow-visible md:border-b-0 md:border-r md:pb-0 md:pr-6">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            'flex-none whitespace-nowrap rounded-md px-4 py-2 text-body font-medium transition-colors',
            pathname === tab.href ? 'bg-blush text-gold-primary' : 'text-charcoal hover:bg-ivory'
          )}
        >
          {tab.label}
        </Link>
      ))}
      <button
        onClick={() => {
          logout();
          router.push('/');
        }}
        className="flex-none whitespace-nowrap rounded-md px-4 py-2 text-left text-body font-medium text-error hover:bg-ivory"
      >
        Logout
      </button>
    </nav>
  );
}
