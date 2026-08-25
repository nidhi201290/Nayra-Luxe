import { categories, collections } from './mock-data';

export interface MediaSlot {
  key: string;
  label: string;
  group: string;
}

export const MEDIA_SLOTS: MediaSlot[] = [
  { key: 'hero-slide-1-desktop', label: 'Slide 1 — "Everyday Luxe, Made to Last" (Desktop, 1920×600)', group: 'Homepage Hero Banner' },
  { key: 'hero-slide-1-mobile', label: 'Slide 1 — "Everyday Luxe, Made to Last" (Mobile, 1000×1000)', group: 'Homepage Hero Banner' },
  { key: 'hero-slide-2-desktop', label: 'Slide 2 — "Loved On Repeat" (Desktop, 1920×600)', group: 'Homepage Hero Banner' },
  { key: 'hero-slide-2-mobile', label: 'Slide 2 — "Loved On Repeat" (Mobile, 1000×1000)', group: 'Homepage Hero Banner' },
  { key: 'hero-slide-3-desktop', label: 'Slide 3 — "The Wedding Edit" (Desktop, 1920×600)', group: 'Homepage Hero Banner' },
  { key: 'hero-slide-3-mobile', label: 'Slide 3 — "The Wedding Edit" (Mobile, 1000×1000)', group: 'Homepage Hero Banner' },
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
