import { Coupon } from './types';
import { CartDetail } from './store';

export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING_FEE = 79;

export function computeSubtotal(details: CartDetail[]): number {
  return details.reduce((sum, d) => sum + d.product.salePrice * d.line.quantity, 0);
}

export function computeDiscount(subtotal: number, coupon: Coupon | null): number {
  if (!coupon || subtotal < coupon.minOrderValue) return 0;
  if (coupon.discountType === 'flat') return Math.min(coupon.discountValue, subtotal);
  return Math.round((subtotal * coupon.discountValue) / 100);
}

export function computeShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
}

export function computeTotal(subtotal: number, discount: number, shipping: number): number {
  return Math.max(0, subtotal - discount + shipping);
}
