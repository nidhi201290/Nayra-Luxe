import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, getCategoryBySlug, getProductsByCategory } from '@/lib/mock-data';
import ShopExperience from '@/components/shop/ShopExperience';
import SiteImage from '@/components/SiteImage';
import { absoluteUrl } from '@/lib/seo';

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: {
      canonical: `/category/${category.slug}`,
    },
    openGraph: {
      title: category.name,
      description: category.description,
      url: `/category/${category.slug}`,
      type: 'website',
    },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(category.slug);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: category.name, item: absoluteUrl(`/category/${category.slug}`) },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="relative overflow-hidden">
        <SiteImage
          slotKey={`category-banner-${category.slug}`}
          fallbackSeed={7}
          fallbackName={category.name}
          className="aspect-[16/6] max-h-64"
        />
        <div className="absolute inset-0 flex flex-col justify-center bg-charcoal/20 px-4 md:px-16">
          <p className="text-caption tracked-caps text-white/90">
            <Link href="/" className="hover:underline">Home</Link> / {category.name}
          </p>
          <h1 className="mt-2 text-h1 text-white">{category.name}</h1>
          <p className="mt-2 max-w-md text-body text-white/90">{category.description}</p>
        </div>
      </div>
      <ShopExperience products={categoryProducts} />
    </div>
  );
}
