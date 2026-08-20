import Hero from '@/components/home/Hero';
import TrustStrip from '@/components/home/TrustStrip';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductCarousel from '@/components/home/ProductCarousel';
import PromoBanner from '@/components/home/PromoBanner';
import FeaturedCollectionBanner from '@/components/home/FeaturedCollectionBanner';
import Testimonials from '@/components/home/Testimonials';
import InstagramFeed from '@/components/home/InstagramFeed';
import AboutTeaser from '@/components/home/AboutTeaser';
import { getProductsByCollection } from '@/lib/mock-data';

export default function HomePage() {
  const bestsellers = getProductsByCollection('bestsellers').slice(0, 8);
  const newArrivals = getProductsByCollection('new-arrivals').slice(0, 8);

  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryGrid />
      <ProductCarousel
        eyebrow="Loved on repeat"
        title="Trending / Bestsellers"
        products={bestsellers}
        viewAllHref="/collection/bestsellers"
      />
      <PromoBanner />
      <ProductCarousel
        eyebrow="Just dropped"
        title="New Arrivals"
        products={newArrivals}
        viewAllHref="/collection/new-arrivals"
      />
      <FeaturedCollectionBanner />
      <Testimonials />
      <InstagramFeed />
      <AboutTeaser />
    </>
  );
}
