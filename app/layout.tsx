import type { Metadata } from 'next';
import { Sora, Fira_Sans } from 'next/font/google';
import './globals.css';
import SiteChrome from '@/components/SiteChrome';
import { BASE_URL, SITE_NAME } from '@/lib/seo';

const sora = Sora({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-sora',
  display: 'swap',
});

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fira-sans',
  display: 'swap',
});

const DEFAULT_TITLE = 'Nayra Luxe — Anti-Tarnish 18K Gold Plated Jewelry';
const DEFAULT_DESCRIPTION =
  'Nayra Luxe — anti-tarnish, 18K gold-plated, 316L stainless steel jewelry. Necklaces, bracelets, chain pendants, rings and earrings made for everyday luxe.';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: '/',
    images: [{ url: '/logo.png', width: 2482, height: 1215, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ['/logo.png'],
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  sameAs: ['https://www.instagram.com/nayra_luxe/'],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${firaSans.variable}`}>
      <body className="flex min-h-screen flex-col font-body">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
