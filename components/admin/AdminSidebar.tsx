'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Tags, ShoppingCart, Ticket, Users, Image as ImageIcon, ExternalLink, LogOut } from 'lucide-react';
import { useAdminAuthStore } from '@/lib/admin-store';
import Logo from '../Logo';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/media', label: 'Media', icon: ImageIcon },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/customers', label: 'Customers', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAdminAuthStore((s) => s.logout);

  return (
    <aside className="flex h-screen w-60 flex-none flex-col border-r border-border bg-white">
      <div className="border-b border-border p-4">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-body font-medium transition-colors',
                active ? 'bg-blush text-gold-primary' : 'text-charcoal hover:bg-ivory'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-border p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-md px-3 py-2 text-body text-charcoal hover:bg-ivory">
          <ExternalLink className="h-4 w-4" />
          View Store
        </Link>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-body text-error hover:bg-ivory">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
