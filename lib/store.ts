'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Address, CartLine, Order, Product, ProductVariant } from './types';
import { products } from './mock-data';

function findProductById(productId: string, catalog: Product[]) {
  return catalog.find((p) => p.id === productId);
}

interface CartState {
  lines: CartLine[];
  isDrawerOpen: boolean;
  addItem: (productId: string, variantId: string, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isDrawerOpen: false,
      addItem: (productId, variantId, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find(
            (l) => l.productId === productId && l.variantId === variantId
          );
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === productId && l.variantId === variantId
                  ? { ...l, quantity: l.quantity + quantity }
                  : l
              ),
              isDrawerOpen: true,
            };
          }
          return {
            lines: [...state.lines, { productId, variantId, quantity }],
            isDrawerOpen: true,
          };
        }),
      removeItem: (productId, variantId) =>
        set((state) => ({
          lines: state.lines.filter(
            (l) => !(l.productId === productId && l.variantId === variantId)
          ),
        })),
      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((l) =>
              l.productId === productId && l.variantId === variantId
                ? { ...l, quantity }
                : l
            )
            .filter((l) => l.quantity > 0),
        })),
      clear: () => set({ lines: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
    }),
    { name: 'nayra-cart' }
  )
);

interface WishlistState {
  productIds: string[];
  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds.filter((id) => id !== productId)
            : [...state.productIds, productId],
        })),
      isWishlisted: (productId) => get().productIds.includes(productId),
    }),
    { name: 'nayra-wishlist' }
  )
);

export interface CartDetail {
  line: CartLine;
  product: Product;
  variant: ProductVariant | undefined;
}

// `catalog` should be the live admin-edited product list (useAdminProductStore's
// `products`) so cart/checkout reflect admin edits — falls back to the static
// seed catalog for any caller that doesn't have it handy.
export function getCartDetails(lines: CartLine[], catalog: Product[] = products): CartDetail[] {
  return lines.reduce<CartDetail[]>((acc, line) => {
    const product = findProductById(line.productId, catalog);
    if (!product) return acc;
    const variant = product.variants.find((v) => v.id === line.variantId);
    acc.push({ line, product, variant });
    return acc;
  }, []);
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrder: (id: string) => Order | undefined;
  updateOrder: (id: string, fields: Partial<Order>) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      getOrder: (id) => get().orders.find((o) => o.id === id),
      updateOrder: (id, fields) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, ...fields } : o)),
        })),
    }),
    { name: 'nayra-orders' }
  )
);

interface AddressState {
  addresses: Address[];
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      addresses: [],
      addAddress: (address) =>
        set((state) => ({
          addresses: address.isDefault
            ? [...state.addresses.map((a) => ({ ...a, isDefault: false })), address]
            : [...state.addresses, address],
        })),
      removeAddress: (id) => set((state) => ({ addresses: state.addresses.filter((a) => a.id !== id) })),
    }),
    { name: 'nayra-addresses' }
  )
);

interface AuthState {
  isAuthenticated: boolean;
  phone: string | null;
  name: string | null;
  login: (phone: string) => void;
  logout: () => void;
  updateProfile: (fields: { name?: string; phone?: string }) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      phone: null,
      name: null,
      login: (phone) => set({ isAuthenticated: true, phone }),
      logout: () => set({ isAuthenticated: false, phone: null, name: null }),
      updateProfile: (fields) => set((state) => ({ ...state, ...fields })),
    }),
    { name: 'nayra-auth' }
  )
);
