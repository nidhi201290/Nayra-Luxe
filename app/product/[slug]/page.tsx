import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getProductBySlug, products } from '@/lib/mock-data';
import ProductDetail from '@/components/pdp/ProductDetail';
import { absoluteUrl, SITE_NAME } from '@/lib/seo';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  const image = product.images?.[0] ?? '/logo.png';
  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `/product/${product.slug}`,
      type: 'website',
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [image],
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.categorySlug);
  const productUrl = absoluteUrl(`/product/${product.slug}`);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    url: productUrl,
    image: product.images?.length ? product.images : [absoluteUrl('/logo.png')],
    brand: { '@type': 'Brand', name: SITE_NAME },
    aggregateRating: product.reviewCount
      ? { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount }
      : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.salePrice,
      url: productUrl,
      availability: product.variants.some((v) => v.stock > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      category
        ? { '@type': 'ListItem', position: 2, name: category.name, item: absoluteUrl(`/category/${category.slug}`) }
        : null,
      { '@type': 'ListItem', position: category ? 3 : 2, name: product.name, item: productUrl },
    ].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ProductDetail product={product} />
    </>
  );
}
