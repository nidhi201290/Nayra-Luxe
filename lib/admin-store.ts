'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Coupon, Product } from './types';
import { products as seedProducts, coupons as seedCoupons } from './mock-data';

interface AdminAuthState {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAdmin: false,
      login: (password) => {
        const ok = password === 'nayra-admin';
        if (ok) set({ isAdmin: true });
        return ok;
      },
      logout: () => set({ isAdmin: false }),
    }),
    { name: 'nayra-admin-auth' }
  )
);

interface AdminProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, fields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useAdminProductStore = create<AdminProductState>()(
  persist(
    (set) => ({
      products: seedProducts,
      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
      updateProduct: (id, fields) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...fields } : p)),
        })),
      deleteProduct: (id) => set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
    }),
    { name: 'nayra-admin-products' }
  )
);

// Product-rendering components are usually handed a product object from a static
// list (mock-data.ts) — this resolves the live, admin-edited version by id so
// changes made in the admin panel (name, price, photos, etc.) actually show up
// on the storefront instead of only updating the admin's own table.
export function useLiveProduct(fallback: Product): Product {
  const live = useAdminProductStore((s) => s.products.find((p) => p.id === fallback.id));
  return live ?? fallback;
}

interface SiteMediaState {
  images: Record<string, string>;
  hydrated: boolean;
  hydrate: (images: Record<string, string>) => void;
  setImage: (key: string, url: string) => void;
  removeImage: (key: string) => void;
}

// Non-product imagery (hero banners, category tiles, about page, etc.) — keyed by
// slot key from lib/media-slots.ts and set from the admin Media page. Backed by
// the `site_media` table via /api/site-media so uploads are visible to every
// visitor, not just the browser that uploaded them; localStorage here is only
// an instant-paint cache until that fetch resolves.
export const useSiteMediaStore = create<SiteMediaState>()(
  persist(
    (set) => ({
      images: {},
      hydrated: false,
      hydrate: (images) => set({ images, hydrated: true }),
      setImage: (key, url) => {
        set((state) => ({ images: { ...state.images, [key]: url } }));
        fetch('/api/site-media', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, url }),
        }).catch((err) => console.error('Failed to persist site media:', err));
      },
      removeImage: (key) => {
        set((state) => ({
          images: Object.fromEntries(Object.entries(state.images).filter(([k]) => k !== key)),
        }));
        fetch(`/api/site-media?key=${encodeURIComponent(key)}`, { method: 'DELETE' }).catch((err) =>
          console.error('Failed to delete site media:', err)
        );
      },
    }),
    { name: 'nayra-site-media' }
  )
);

export function useSiteImage(key: string): string | undefined {
  return useSiteMediaStore((s) => s.images[key]);
}

interface AdminCouponState {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
}

export const useAdminCouponStore = create<AdminCouponState>()(
  persist(
    (set) => ({
      coupons: seedCoupons,
      addCoupon: (coupon) => set((state) => ({ coupons: [coupon, ...state.coupons] })),
      deleteCoupon: (code) => set((state) => ({ coupons: state.coupons.filter((c) => c.code !== code) })),
    }),
    { name: 'nayra-admin-coupons' }
  )
);
