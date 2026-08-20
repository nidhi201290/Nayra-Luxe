export const SITE_NAME = 'Nayra Luxe';
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nayraluxe.com';

export function absoluteUrl(path: string): string {
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
