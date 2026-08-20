import { MetadataRoute } from 'next';
import { categories, collections, products } from '@/lib/mock-data';
import { BASE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const home = [{ url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 }];

  const staticRoutes = ['/shop', '/about', '/contact', '/faq', '/policies/shipping', '/policies/returns', '/policies/privacy', '/policies/terms'].map(
    (path) => ({ url: `${BASE_URL}${path}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: path === '/shop' ? 0.9 : 0.5 })
  );

  const categoryRoutes = categories.map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));
  const collectionRoutes = collections.map((c) => ({
    url: `${BASE_URL}/collection/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));
  const productRoutes = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: p.isBestseller || p.isNew ? 0.8 : 0.7,
  }));

  return [...home, ...staticRoutes, ...categoryRoutes, ...collectionRoutes, ...productRoutes];
}
