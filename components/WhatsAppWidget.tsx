'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

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
        <MessageCircle className="h-7 w-7 fill-white text-whatsapp" />
      </a>
    </div>
  );
}
