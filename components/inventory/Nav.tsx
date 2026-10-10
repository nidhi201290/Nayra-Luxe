"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const links = [
  { href: "/inventory/dashboard", label: "Dashboard" },
  { href: "/inventory", label: "Inventory" },
  { href: "/invoices", label: "Invoices" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-0.5 sm:gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-blush text-ink"
                    : "text-charcoal-muted hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
