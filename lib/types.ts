export type CategorySlug =
  | 'necklaces'
  | 'bracelets'
  | 'chain-pendants'
  | 'rings'
  | 'earrings';

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  tone: 'gold' | 'blush' | 'ivory';
}

export interface Collection {
  slug: string;
  name: string;
  description: string;
}

export interface ProductVariant {
  id: string;
  size?: string;
  color?: 'Gold' | 'Rose Gold' | 'Silver-tone';
  stock: number;
  skuSuffix: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: CategorySlug;
  collectionSlugs: string[];
  basePrice: number;
  salePrice: number;
  material: string;
  plating: string;
  description: string;
  details: string[];
  care: string[];
  sku: string;
  isBestseller: boolean;
  isNew: boolean;
  status: 'active' | 'draft' | 'out-of-stock';
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  reviews: Review[];
  imageHue: number;
  images?: string[];
}

export interface CartLine {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

export type OrderStatus =
  | 'Placed'
  | 'Confirmed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export interface OrderItem {
  productId: string;
  productName: string;
  variantLabel: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  address: Address;
  trackingNumber?: string;
  courier?: string;
}

export interface Coupon {
  code: string;
  discountType: 'flat' | 'percent';
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
}
