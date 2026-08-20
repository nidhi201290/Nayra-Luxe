# Nayra Luxe

Anti-tarnish, 18K gold-plated jewelry storefront — Next.js 14 (App Router) + TypeScript + Tailwind CSS.

Built from `Nayra_Luxe_Website_PRD.md` and `Nayra_Luxe_Design_System.md` (both in this repo). This is the **frontend phase**: every page from the PRD is built out with the real design system tokens and the actual brand logo, running on mock data with working client-side cart/wishlist/order state. Payments, phone-OTP auth, and the database are not wired up yet — see [What's not wired up](#whats-not-wired-up) below.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # next lint
```

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, tokens matched to the design system doc |
| Fonts | Sora (headings/nav) + Fira Sans (body) via `next/font/google` |
| State | Zustand (cart, wishlist, orders, addresses, auth — all `localStorage`-persisted) |
| Icons | Lucide |

## Project structure

```
app/                  Routes (App Router — see Pages below)
components/           Shared UI, grouped by area (home/, shop/, pdp/, checkout/, admin/, account/)
lib/
  mock-data.ts        36 seeded SKUs across 5 categories + 4 collections
  store.ts            Zustand stores: cart, wishlist, orders, addresses, auth
  admin-store.ts       Zustand stores for the admin panel (products, coupons, admin auth)
  types.ts            Shared TypeScript types
  cart-utils.ts       Subtotal/discount/shipping/total math
public/
  logo.png            Full lockup (source asset)
  logo-mark.png        Emblem-only crop, used site-wide in the header/footer/admin
```

## Pages

**Storefront** — `/`, `/shop`, `/category/[slug]`, `/collection/[slug]`, `/product/[slug]`, `/search`, `/cart`, `/checkout`, `/order-confirmation/[orderId]`, `/wishlist`

**Account** — `/login` (mock phone-OTP), `/account`, `/account/orders`

**Info/legal** — `/about`, `/contact`, `/faq`, `/policies/shipping`, `/policies/returns`, `/policies/privacy`, `/policies/terms`

**Admin** (`/admin`, password `nayra-admin`) — dashboard, products, categories, orders, coupons, customers. Orders placed on the storefront show up here in real time.

## What's not wired up

These need real credentials/accounts before launch — the PRD and design system flag them, and the UI/data model is ready for them, but the integrations themselves are out of scope for this phase:

- **Payments** — Razorpay. Checkout currently simulates payment and creates a local order.
- **Auth** — Phone OTP is mocked (any 6-digit code works). No real SMS provider.
- **Database** — all data is in-memory/`localStorage` via `lib/mock-data.ts`, not persisted server-side.
- **Shipping** — Shiprocket. Pincode delivery checks on the PDP are simulated.
- **Notifications** — WhatsApp/email order confirmations.
- **Analytics** — GA4 / Meta Pixel.

Config placeholders for these live in `.env.example`.

## Design system compliance

`Nayra_Luxe_Design_System.md` is the source of truth for colors, spacing, radius, shadows, and (per founder direction) typography, which was matched to `mehere.shop`'s live fonts (Sora + Fira Sans) rather than the doc's original serif pairing — see Section 3 of that doc for the override note.

Known asset gaps, called out in the design doc itself:
- No reversed/light logo version for dark backgrounds
- No extracted standalone SVGs for the diamond glyph / laurel-leaf motif (Section 5) — decorative icon moments currently use generic Lucide icons instead
- No vector (SVG/AI) source for the logo

## Browser verification

Every UI change in this project has been checked in a real headless browser (Playwright) — screenshots and console-error checks, not just `next build` passing. If you're picking this up to extend it, do the same before calling something done.
