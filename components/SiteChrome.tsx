'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';
import WhatsAppWidget from './WhatsAppWidget';
import MiniCartDrawer from './MiniCartDrawer';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

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
