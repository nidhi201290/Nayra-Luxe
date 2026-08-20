import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { collections, getCollectionBySlug, getProductsByCollection } from '@/lib/mock-data';
import ShopExperience from '@/components/shop/ShopExperience';
import SiteImage from '@/components/SiteImage';
import { absoluteUrl } from '@/lib/seo';

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const collection = getCollectionBySlug(params.slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.description,
    alternates: {
      canonical: `/collection/${collection.slug}`,
    },
    openGraph: {
      title: collection.name,
      description: collection.description,
      url: `/collection/${collection.slug}`,
      type: 'website',
    },
  };
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = getCollectionBySlug(params.slug);
  if (!collection) notFound();

  const collectionProducts = getProductsByCollection(collection.slug);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: collection.name, item: absoluteUrl(`/collection/${collection.slug}`) },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="relative overflow-hidden">
        <SiteImage
          slotKey={`collection-banner-${collection.slug}`}
          fallbackSeed={19}
          fallbackName={collection.name}
          className="aspect-[16/6] max-h-64"
        />
        <div className="absolute inset-0 flex flex-col justify-center bg-charcoal/20 px-4 md:px-16">
          <p className="text-caption tracked-caps text-white/90">
            <Link href="/" className="hover:underline">Home</Link> / {collection.name}
          </p>
          <h1 className="mt-2 text-h1 text-white">{collection.name}</h1>
          <p className="mt-2 max-w-md text-body text-white/90">{collection.description}</p>
        </div>
      </div>
      <ShopExperience products={collectionProducts} showFilters={false} />
    </div>
  );
}
