'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';
import WhatsAppWidget from './WhatsAppWidget';
import MiniCartDrawer from './MiniCartDrawer';
import { useSiteMediaStore } from '@/lib/admin-store';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const hydrateSiteMedia = useSiteMediaStore((s) => s.hydrate);

  useEffect(() => {
    fetch('/api/site-media')
      .then((res) => res.json())
      .then((data) => {
        if (data.images) hydrateSiteMedia(data.images);
      })
      .catch((err) => console.error('Failed to load site media:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppWidget />
      <MiniCartDrawer />
    </>
  );
}
