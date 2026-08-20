import { categories, collections } from './mock-data';

export interface MediaSlot {
  key: string;
  label: string;
  group: string;
}

export const MEDIA_SLOTS: MediaSlot[] = [
  { key: 'hero-slide-1', label: 'Slide 1 — "Everyday Luxe, Made to Last"', group: 'Homepage Hero Banner' },
  { key: 'hero-slide-2', label: 'Slide 2 — "Loved On Repeat"', group: 'Homepage Hero Banner' },
  { key: 'hero-slide-3', label: 'Slide 3 — "The Wedding Edit"', group: 'Homepage Hero Banner' },
  { key: 'featured-collection-banner', label: 'Featured Collection Banner', group: 'Homepage' },
  { key: 'about-banner', label: 'About Page Banner', group: 'About Page' },
  ...categories.map((c) => ({
    key: `category-banner-${c.slug}`,
    label: c.name,
    group: 'Category Tiles & Banners',
  })),
  ...collections.map((c) => ({
    key: `collection-banner-${c.slug}`,
    label: c.name,
    group: 'Collection Banners',
  })),
];
