import { twMerge } from 'tailwind-merge';

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function discountPercent(basePrice: number, salePrice: number): number {
  if (basePrice <= salePrice) return 0;
  return Math.round(((basePrice - salePrice) / basePrice) * 100);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return twMerge(classes.filter(Boolean).join(' '));
}
