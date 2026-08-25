'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.71.45 3.38 1.3 4.85L2.05 22l5.36-1.4a9.9 9.9 0 0 0 4.63 1.18h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.33-1.93 1.4-.5.08-1.12.11-1.8-.11-.42-.13-.95-.3-1.64-.58-2.89-1.25-4.78-4.16-4.93-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.13 1.01-2.42.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.83 2 .9 2.15.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.3.15.47.12.65-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.66-.15.27.1 1.71.81 2 .96.3.15.5.22.57.35.07.13.07.75-.17 1.43Z" />
    </svg>
  );
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919811553264';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nayraluxe.com';

export default function WhatsAppWidget() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 1500);
    const hideTimer = setTimeout(() => setShowTooltip(false), 6000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (pathname.startsWith('/checkout') || pathname.startsWith('/admin')) return null;

  const message =
    pathname.startsWith('/product/')
      ? `Hi, I'm interested in a product on Nayra Luxe — ${SITE_URL}${pathname}`
      : 'Hi, I have a question about Nayra Luxe';

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const isPdp = pathname.startsWith('/product/');

  return (
    <div className={`fixed right-4 z-30 flex items-center gap-2 ${isPdp ? 'bottom-24 md:bottom-6' : 'bottom-6'}`}>
      {showTooltip && (
        <span className="animate-bounce-in rounded-md bg-white px-3 py-2 text-caption text-charcoal shadow-lg">
          Need help? Chat with us
        </span>
      )}
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-lg transition-transform hover:scale-105"
      >
        <WhatsAppIcon className="h-7 w-7 text-white" />
      </a>
    </div>
  );
}
