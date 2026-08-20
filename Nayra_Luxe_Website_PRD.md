# Product Requirements Document (PRD)
# Nayra Luxe — E-commerce Website

**Version:** 1.0
**Prepared for:** Development via Claude Code
**Product Owner:** Nidhi (Founder, Nayra Luxe)
**Reference Site:** https://www.mehere.shop/

---

## 1. Executive Summary

Nayra Luxe is an Instagram-first jewelry brand selling **anti-tarnish, 18K gold-plated, 316 stainless steel jewelry** — Necklaces, Bracelets, Chain Pendants, Rings, and Earrings. The brand currently sells via Instagram DMs/orders and needs a **fully responsive, self-serve e-commerce website** so customers can browse, select variants, and place orders directly online instead of over chat.

The site should feel elegant, minimal, and premium — similar in structure and flow to mehere.shop — but with its own visual identity (Nayra Luxe branding, colors, logo, tone).

### 1.1 Goals
- Enable customers to discover, browse, and purchase jewelry online without manual DM handling.
- Reduce order-taking friction currently happening over Instagram (screenshots, manual payment confirmation).
- Build a scalable catalog structure (categories, collections, variants) that can grow over time.
- Create a mobile-first experience, since majority of traffic will come from Instagram (mobile browsers/in-app browser).
- Establish a trustworthy, premium brand feel to justify price point and reduce cart abandonment.

### 1.2 Non-Goals (v1)
- No multi-vendor/marketplace functionality.
- No international shipping/multi-currency in v1 (INR only, India-only shipping).
- No native mobile app — responsive web only.
- No loyalty/rewards points system in v1 (coupon codes only).

---

## 2. Brand & Product Context

| Attribute | Detail |
|---|---|
| Brand name | Nayra Luxe |
| Instagram handle | Nayra Luxe (existing page, has followers/engagement) |
| Material | 316L Stainless Steel base |
| Plating | 18K Gold Plated |
| Key selling point | Anti-tarnish, waterproof, sweatproof, everyday-wear jewelry |
| Categories | Necklaces, Bracelets, Chain Pendants, Rings, Earrings (extendable: Anklets, Combos/Gift Sets, Watches later) |
| Price positioning | Affordable luxury / mid-range (₹400–₹3000 range typical for this category) |
| Target audience | Women 18–35, India, Instagram-driven discovery, gifting occasions |
| Currency | INR (₹) only |
| Order geography | India only (v1) |

### 2.1 Design Direction
- **Aesthetic:** Clean, minimal, luxury — soft gold, cream/ivory, blush, black/charcoal accents. Lots of white space, high-quality product photography as hero.
- **Typography:** Elegant serif or refined sans-serif for headings (e.g., a serif like Playfair Display / Cormorant paired with a clean sans like Inter/Poppins for body).
- **Imagery:** Large product images with zoom, lifestyle shots, multiple angles.
- **Tone of voice:** Warm, aspirational, feminine, trustworthy (anti-tarnish/quality reassurance messaging throughout).

---

## 3. Tech Stack Recommendation

Since this will be built with Claude Code, recommend a modern, maintainable stack:

| Layer | Recommendation | Notes |
|---|---|---|
| Frontend | Next.js 14+ (App Router) + TypeScript + Tailwind CSS | SEO-friendly (SSR/SSG), fast, responsive-first |
| State management | React Context / Zustand for cart & auth state | Lightweight, no need for Redux at this scale |
| Backend | Next.js API routes (or separate Node.js/Express service) | Keep it in one repo initially for simplicity |
| Database | PostgreSQL (via Prisma ORM) or MongoDB | Prisma + PostgreSQL recommended for relational catalog/orders data |
| Auth | Phone number OTP login (primary) + optional email/Google login | Match reference site UX (phone OTP is common in Indian D2C) |
| Payments | Razorpay (supports UPI, cards, netbanking, wallets — standard for Indian D2C) | **Online payment only — no COD** at launch, per founder decision |
| Image hosting | Cloudinary or AWS S3 + CloudFront | For optimized, responsive product images |
| Shipping | **Shiprocket API** (confirmed shipping partner) | Automate order push, tracking ID sync, and shipping label generation via Shiprocket's API; use their serviceability API for the pincode delivery-check on the PDP/checkout |
| Hosting | Vercel (frontend) + Railway/Render/Supabase (DB) | Fast to deploy, good free/low-cost tier for a starting brand |
| Admin Panel | Custom-built admin dashboard (Next.js protected routes) | For managing products, orders, inventory, coupons |
| Notifications | WhatsApp Business API / Twilio for order confirmations (v1.1); email via Resend/SendGrid for v1 | Order confirmation + shipping updates |
| Analytics | Google Analytics 4 + Meta Pixel (for Instagram/FB ad retargeting) | Critical since traffic originates from Instagram |

> Claude Code should confirm final stack feasibility based on the developer's hosting/budget constraints before scaffolding, but the above is the recommended default.

---

## 4. Information Architecture / Sitemap

```
Home (/)
├── Shop / All Products (/shop)
├── Category Pages (/category/:slug)
│   ├── Necklaces
│   ├── Bracelets
│   ├── Chain Pendants
│   ├── Rings
│   ├── Earrings
├── Collections (/collection/:slug)   [e.g. "New Arrivals", "Bestsellers", "Gift Sets", "Wedding Edit"]
├── Product Detail Page (/product/:slug)
├── Cart (/cart)
├── Checkout (/checkout)
├── Order Confirmation (/order-confirmation/:orderId)
├── My Orders (/account/orders)
├── My Account (/account)
│   ├── Profile
│   ├── Addresses
│   ├── Order History
│   ├── Wishlist
├── Login / OTP Verification (/login)
├── Wishlist (/wishlist)
├── Search Results (/search?q=)
├── About Us (/about)
├── Contact Us (/contact)
├── Policies
│   ├── Shipping Policy (/policies/shipping)
│   ├── Return & Exchange Policy (/policies/returns)
│   ├── Privacy Policy (/policies/privacy)
│   ├── Terms & Conditions (/policies/terms)
│   ├── FAQ (/faq)
├── Admin Panel (/admin) — separate protected area
│   ├── Dashboard
│   ├── Products (CRUD)
│   ├── Categories/Collections (CRUD)
│   ├── Orders (view/update status)
│   ├── Coupons (CRUD)
│   ├── Customers
│   ├── Inventory
```

---

## 5. Page-by-Page Functional Specifications

### 5.1 Homepage (`/`)

**Purpose:** First impression, brand storytelling, and fastest path to top categories/products.

**Sections (top to bottom):**
1. **Announcement bar** — rotating text: e.g. "Free Shipping on orders above ₹999 | Anti-Tarnish Guarantee" (sticky, dismissible optional)
2. **Header/Navbar** (sticky on scroll):
   - Logo (center or left)
   - Nav links: Home, Shop, Necklaces, Bracelets, Rings, Earrings, Collections, About
   - Search icon (opens search overlay)
   - Account/Login icon
   - Wishlist icon (with count badge)
   - Cart icon (with item count badge, opens mini-cart drawer)
   - Mobile: hamburger menu with slide-out drawer nav
3. **Hero banner/carousel** — 3–5 rotating slides, full-width lifestyle/product images, each with CTA button ("Shop Now") linking to a collection/category
4. **Trust strip** — icons row: "Anti-Tarnish Guarantee", "Free Shipping over ₹999", "Easy 7-Day Returns", "100% Secure Online Payment", "Made with 316 Stainless Steel"
5. **Shop by Category** — grid of 5 category tiles (Necklaces, Bracelets, Chain Pendants, Rings, Earrings), each clickable image card
6. **Trending / Bestsellers** — horizontally scrollable or grid product carousel with Product Cards (see 5.6)
7. **Promo/Offer banners** — coupon code callouts (e.g. "Get ₹150 off | Code: NAYRA150")
8. **New Arrivals** — product carousel
9. **Featured Collection banner** — large image + text block linking to a curated collection (e.g. "The Wedding Edit")
10. **Customer Testimonials / Reviews strip** — carousel of customer photos/quotes (social proof, esp. important since brand is Instagram-native — can embed UGC)
11. **Instagram feed embed** — grid of recent Instagram posts linking back to @NayraLuxe, reinforcing brand's social presence
12. **About Us teaser** — short brand story block + "Learn More" link to `/about`
13. **Newsletter/WhatsApp signup** — email or phone capture for offers
14. **Footer** (see 5.13)

---

### 5.2 Shop / All Products Page (`/shop`)

**Purpose:** Browse the full catalog with filtering/sorting.

**Layout:**
- Left sidebar (desktop) / Filter drawer (mobile): filter by Category, Price Range (slider), Material, Color/Plating, Availability (In Stock), Discount %
- Top bar: Sort dropdown (Popularity, Price Low-High, Price High-Low, Newest, Bestselling), result count, active filter chips (removable)
- Product grid: responsive grid (4 cols desktop / 2 cols tablet / 2 cols mobile), using Product Cards
- Pagination or infinite scroll (recommend infinite scroll or "Load More" button for mobile-first UX)
- Empty state: "No products match your filters" with a "Clear filters" CTA

---

### 5.3 Category Page (`/category/:slug`)

**Purpose:** Same as Shop page but pre-filtered to one category (Necklaces, Bracelets, Chain Pendants, Rings, Earrings).

**Additional elements vs. Shop page:**
- Category hero banner at top (category name, short description, lifestyle image)
- Breadcrumb: Home > Category Name
- SEO-friendly H1 and meta description per category
- Same filter/sort/grid structure as 5.2, scoped to category

---

### 5.4 Collection Page (`/collection/:slug`)

**Purpose:** Curated groupings that aren't strict categories — e.g. "New Arrivals", "Bestsellers", "Gift Sets Under ₹999", "Wedding Edit", "Combo Offers".

- Same structure as category page
- Admin should be able to manually assign products to a collection (many-to-many relationship between products and collections)

---

### 5.5 Product Detail Page (PDP) (`/product/:slug`)

**Purpose:** Convert browsing into add-to-cart/purchase. This is the most critical page.

**Layout:**
- Breadcrumb: Home > Category > Product Name
- **Left/top: Image gallery**
  - Multiple product images (min 3–5 per product): main shot, close-up, worn/lifestyle shot, packaging shot
  - Thumbnail strip or dots for navigation
  - Pinch-to-zoom on mobile, hover-zoom on desktop
  - Optional: short video/reel embed showing the product
- **Right/bottom: Product info panel**
  - Product title
  - Price: MRP (strikethrough) + Sale price + "% Off" badge, "Incl. of all taxes" note
  - Rating stars + review count (links to reviews section)
  - Short description (2–3 lines: material, plating, key highlight)
  - **Variant selectors:**
    - Size (for rings — with a **size guide modal/link**)
    - Color/finish (Gold / Rose Gold / Silver-tone if applicable)
    - Each variant shows availability (disable/gray-out out-of-stock combinations)
  - Quantity selector
  - **Add to Cart** button (primary CTA)
  - **Buy Now** button (secondary CTA — skips to checkout)
  - Wishlist (heart icon) toggle
  - Delivery check: pincode input → "Check delivery availability" + estimated delivery date
  - Trust badges row: Anti-Tarnish | 7-Day Easy Return | 100% Secure Online Payment | Fast Dispatch
  - Share buttons (WhatsApp, Instagram, Copy Link) — important for a social-driven brand
- **Product description tabs/accordion:**
  - Product Details (material composition, dimensions, weight)
  - Care Instructions (how to maintain anti-tarnish coating)
  - Shipping & Returns summary
  - Size Guide (for rings/bracelets)
- **Reviews & Ratings section:**
  - Overall rating breakdown (star distribution)
  - Individual reviews with customer name, rating, photo (optional), date, verified purchase badge
  - **"Write a Review" is restricted to verified purchasers only** — a customer can only review a product after their order for that product is marked Delivered. Trigger a "Rate your purchase" prompt via order history/email after delivery.
- **You May Also Like / Related Products** — carousel of similar/complementary products (cross-sell)
- **Recently Viewed** — carousel (tracked via local storage/cookies)
- Sticky "Add to Cart" bar on mobile scroll (shows product thumbnail, price, Add to Cart button when scrolled past main CTA)

---

### 5.6 Product Card Component (reused across grids)

- Product image (hover shows second image, if available, on desktop)
- "Bestseller" / "New" / "Sale" badge (top-left corner, conditional)
- Discount % badge
- Wishlist heart icon (top-right corner, toggle-able without navigating away)
- Product title (truncated to 2 lines)
- Price: strikethrough MRP + sale price + discount %
- Star rating + review count (small text)
- Quick "Add to Cart" button (appears on hover on desktop / always visible on mobile) — for simple products; opens variant selector modal if product has size/color options
- Click anywhere on card → navigates to PDP

---

### 5.7 Cart Page / Mini-Cart Drawer

**Mini-cart drawer** (opens on cart icon click, slides from right):
- List of items: thumbnail, name, variant (size/color), price, quantity stepper, remove (X)
- Subtotal
- Coupon code input (apply/remove)
- "Free shipping" progress bar (e.g. "Add ₹250 more for free shipping")
- CTA: "View Cart" (goes to full cart page) and "Checkout" (primary button)
- Empty state: "Your cart is empty" with "Continue Shopping" CTA

**Full Cart Page (`/cart`):**
- Same item list as above but full-width table/list layout
- Order summary sidebar: Subtotal, Discount (if coupon applied), Shipping (Free/₹X), Total
- Coupon code field
- "Proceed to Checkout" CTA
- Recommended products below ("Add these to your order")

---

### 5.8 Checkout Page (`/checkout`)

**Flow (single-page or multi-step — recommend single scrollable page for mobile simplicity):**

1. **Contact Info** — Phone number (auto-filled if logged in) + Email (optional)
2. **Shipping Address**
   - Full name, Address Line 1/2, City, State, Pincode, Landmark (optional), Phone
   - "Save this address" checkbox (for logged-in users)
   - Address book selector if user has saved addresses
3. **Delivery method** — Standard delivery (show estimated date based on pincode)
4. **Payment method:**
   - UPI / Cards / Netbanking / Wallets (via Razorpay)
   - **No COD at launch — online prepaid payment only.** Order is only confirmed after successful payment via Razorpay.
5. **Order Summary sidebar** (sticky on desktop, collapsible on mobile):
   - Item list (thumbnail, name, variant, qty, price)
   - Subtotal, Discount, Shipping, Total
   - Coupon code field (if not already applied)
6. **Place Order** button
7. Trust signals near payment: SSL secure badge, "100% Secure Payments" text

**Post-payment:**
- Redirect to Order Confirmation page
- Trigger order confirmation email/WhatsApp message
- Trigger Meta Pixel "Purchase" event for retargeting/analytics

---

### 5.9 Order Confirmation Page (`/order-confirmation/:orderId`)

- Success message with checkmark animation/icon
- Order ID, estimated delivery date
- Order summary (items, quantities, prices, total paid)
- Shipping address confirmation
- "Track Order" / "View Order Details" CTA
- "Continue Shopping" CTA
- Note: "You'll receive updates on WhatsApp/Email"

---

### 5.10 My Account (`/account`)

- **Profile tab:** Name, phone, email (editable)
- **Order History tab (`/account/orders`):** List of past orders with status (Placed, Confirmed, Shipped, Out for Delivery, Delivered, Cancelled, Returned), order date, total, "View Details" (expands to show items + tracking info)
- **Addresses tab:** Saved addresses, add/edit/delete, set default
- **Wishlist tab:** Saved products, move to cart, remove

---

### 5.11 Login / Authentication (`/login`)

- Primary: **Phone number + OTP** login (match reference site pattern — common and trusted in Indian D2C)
- Optional secondary: Continue with Google
- Guest checkout should also be allowed (don't force login to purchase — reduces friction) — but encourage login post-purchase to track orders
- OTP screen: 6-digit input, resend OTP timer, auto-read OTP on mobile where supported

---

### 5.12 Search (`/search`)

- Accessible via search icon in header → opens overlay/modal with search input
- Live/instant search suggestions as user types (product names, categories)
- Full results page with same grid/filter structure as Shop page
- "No results found" state with suggested categories

---

### 5.13 Footer (site-wide)

- Logo + short brand tagline
- Quick links: Shop, About, Contact, FAQ
- Policy links: Shipping Policy, Return Policy, Privacy Policy, Terms & Conditions
- Customer care: phone/WhatsApp number, email, hours
- Social icons: Instagram (primary), Facebook, Pinterest (if applicable)
- Newsletter signup (email capture)
- Payment method icons (Razorpay, UPI, Visa/Mastercard) — online payment only, no COD
- Copyright line

---

### 5.14 Sticky WhatsApp Chat Widget (site-wide)

**Purpose:** Persistent, always-visible way for visitors to reach Nayra Luxe directly on WhatsApp from any page — important since the brand's existing customer relationship/trust is built on Instagram/WhatsApp-style conversation, not just a storefront.

- **Placement:** Floating circular icon, fixed position, bottom-right corner of viewport, on every page (desktop and mobile) — standard WhatsApp green icon with subtle shadow/bounce animation on load
- **Behavior:**
  - Stays fixed while scrolling, above all other content (high z-index), but shouldn't overlap the mobile sticky "Add to Cart" bar on the PDP — offset vertically when that bar is present
  - On click/tap: opens `https://wa.me/<business-number>` in a new tab, pre-filled with a context-aware message where possible, e.g.:
    - From a Product Detail Page → "Hi, I'm interested in [Product Name] — [page URL]"
    - From any other page → generic "Hi, I have a question about Nayra Luxe"
  - Optional (nice-to-have): small "Need help? Chat with us" tooltip/label that appears on first page load, then collapses to icon-only
  - Optional (nice-to-have): a lightweight badge/notification dot to draw attention without being intrusive
- **Should NOT appear on:** Checkout page (avoid distracting from payment completion) and Admin panel
- **Config:** WhatsApp business number should be a single environment variable / admin-configurable setting, not hardcoded across components, so it's easy to update

---

### 5.15 Static/Info Pages

- **About Us** — brand story, mission, why anti-tarnish matters, founder note, quality/material explanation
- **Contact Us** — form (name, email, message) + WhatsApp click-to-chat button + Instagram DM link + business email
- **FAQ** — accordion: shipping timelines, anti-tarnish care, returns/exchange process, payment options, sizing help
- **Shipping Policy, Return & Exchange Policy, Privacy Policy, Terms & Conditions** — standard legal/informational pages (static content, editable via admin or hardcoded initially)

---

## 6. Admin Panel Requirements (`/admin`)

A protected, password/login-gated dashboard for Nidhi (or team) to manage the store without touching code.

### 6.1 Dashboard
- Key metrics: Today's orders, revenue, pending orders, low-stock alerts

### 6.2 Product Management
- Add/Edit/Delete product
- Fields: Name, slug, description, category, collections (multi-select), material/plating tags, base price, sale price, SKU, images (multi-upload), variants (size/color with individual stock counts), stock quantity, status (Active/Draft/Out of Stock), featured flag (bestseller/new arrival tags)

### 6.3 Category & Collection Management
- CRUD for categories and collections, reorder, set banner image per category

### 6.4 Order Management
- View all orders, filter by status/date
- Update order status (Placed → Confirmed → Shipped → Delivered / Cancelled / Returned)
- Add tracking number/courier info
- View customer + shipping details per order
- Export orders (CSV) for shipping label generation if not using an automated API

### 6.5 Coupon/Discount Management
- Create coupon codes: fixed amount or % off, minimum order value, expiry date, usage limit

### 6.6 Customer Management
- View customer list, order history per customer, contact info

### 6.7 Inventory Alerts
- Low stock threshold warnings

---

## 7. Core Functional Requirements Summary

| Feature | Priority | Notes |
|---|---|---|
| Responsive design (mobile/tablet/desktop) | Must-have | Mobile-first, since traffic mostly from Instagram |
| Product catalog with categories/collections | Must-have | |
| Product variants (size/color) with stock tracking | Must-have | Especially for rings (size) |
| Cart & mini-cart drawer | Must-have | |
| Guest checkout | Must-have | Reduce friction |
| Phone OTP login | Must-have | |
| Online payment (Razorpay: UPI/Cards/Netbanking) | Must-have | Sole payment method at launch — no COD |
| Coupon codes | Should-have | |
| Wishlist | Should-have | |
| Order tracking / My Orders | Must-have | |
| Product reviews & ratings | Should-have | Builds trust |
| Search with suggestions | Should-have | |
| Admin panel for products/orders | Must-have | |
| WhatsApp/email order notifications | Should-have | v1.1 acceptable |
| Sticky/floating WhatsApp chat icon (site-wide) | Must-have | Bottom-right, all pages except Checkout/Admin |
| Instagram feed embed on homepage | Nice-to-have | Reinforces brand |
| Size guide modal | Should-have | For rings especially |
| SEO optimization (meta tags, sitemap, structured data) | Must-have | Organic discovery beyond Instagram |
| Analytics (GA4 + Meta Pixel) | Must-have | For ad retargeting since brand runs on Instagram |

---

## 8. Data Model (High-Level Schema)

```
User
- id, name, phone, email, password_hash (if applicable), created_at

Address
- id, user_id (FK), full_name, phone, line1, line2, city, state, pincode, landmark, is_default

Category
- id, name, slug, description, banner_image, sort_order

Collection
- id, name, slug, description, banner_image

Product
- id, name, slug, description, category_id (FK), base_price, sale_price,
  material, plating, status (active/draft), is_bestseller, is_new, sku, created_at

ProductImage
- id, product_id (FK), image_url, sort_order

ProductVariant
- id, product_id (FK), size, color, stock_quantity, sku_suffix, price_override (nullable)

ProductCollection (many-to-many)
- product_id (FK), collection_id (FK)

Review
- id, product_id (FK), user_id (FK), order_item_id (FK, required — proves verified purchase), rating, comment, images, created_at

Cart / CartItem
- cart_id, user_id (nullable for guest/session-based), product_id, variant_id, quantity

Order
- id, user_id (nullable), order_number, status, subtotal, discount, shipping_fee, total,
  payment_method, payment_status, shipping_address (snapshot), created_at

OrderItem
- id, order_id (FK), product_id, variant_id, product_name_snapshot, price_snapshot, quantity

Coupon
- id, code, discount_type (flat/percent), discount_value, min_order_value, expiry_date, usage_limit, used_count

Wishlist
- id, user_id (FK), product_id (FK)
```

---

## 9. Non-Functional Requirements

- **Responsiveness:** Fully responsive across breakpoints — mobile (≤480px), tablet (481–1024px), desktop (1025px+). Mobile-first build priority since Instagram traffic lands primarily on mobile.
- **Performance:** 
  - Optimized/lazy-loaded images (WebP format, responsive srcset)
  - Page load target: <3s on 4G mobile
  - Use Next.js Image component and SSG/ISR for product/category pages where possible
- **SEO:** Server-side rendered pages, dynamic meta tags per product/category, sitemap.xml, robots.txt, structured data (Product schema with price/availability for rich snippets)
- **Security:** HTTPS everywhere, secure payment handling via Razorpay (PCI compliance offloaded to Razorpay), input validation/sanitization, rate-limiting on OTP requests
- **Accessibility:** Reasonable contrast ratios, alt text on all product images, keyboard-navigable menus
- **Browser support:** Latest 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari and Chrome (Android) prioritized given Instagram in-app browser usage
- **Scalability:** Catalog structure should support growth to 500+ SKUs without redesign

---

## 10. Success Metrics (Post-Launch)

- Conversion rate (visits → orders)
- Cart abandonment rate
- Average order value (AOV)
- Repeat purchase rate
- Traffic source breakdown (Instagram vs. organic vs. direct)
- Top-performing categories/products

---

## 11. Suggested Build Phases (for Claude Code)

**Phase 1 — Foundation**
- Project scaffold (Next.js + Tailwind + TypeScript), design system (colors, typography, spacing tokens based on brand direction in section 2.1)
- Database schema + Prisma setup
- Header, Footer, Homepage (static/mock data first)

**Phase 2 — Catalog**
- Product, Category, Collection models + admin CRUD
- Shop page, Category page, Collection page with filters/sort
- Product Detail Page with variants, gallery, reviews UI

**Phase 3 — Cart & Checkout**
- Cart state management, mini-cart drawer, full cart page
- Checkout flow, address management
- Razorpay integration (online payment only)

**Phase 4 — Accounts & Orders**
- Phone OTP auth
- My Account, Order History, Wishlist
- Order confirmation + notification emails

**Phase 5 — Admin Panel**
- Product/Order/Coupon/Category management dashboard

**Phase 6 — Polish & Launch**
- SEO setup, analytics integration, performance audit, cross-device QA, static policy pages content, Instagram feed embed

---

## 12. Founder Decisions (Confirmed)

1. **Logo & brand color palette:** Already exists and will be provided by the founder. Design system (Section 2.1) should be finalized against the actual logo/palette once shared, rather than invented from scratch.
2. **Product photography:** Some existing product photos are available and will be used at launch. Remaining SKUs will need placeholder/stock imagery until real photography is ready — admin panel's multi-image upload (Section 6.2) should make it easy to swap in real photos later without a redesign.
3. **Payment method:** **Online payment only (Razorpay — UPI/Cards/Netbanking/Wallets). No Cash on Delivery at launch.** This has been reflected throughout the PRD (checkout flow, trust badges, footer, functional requirements).
4. **Guest checkout:** **Enabled.** Customers can purchase without creating an account (Section 5.8 checkout flow). They're encouraged, but not required, to sign up post-purchase (e.g. via an "OTP-login to save this order to your account" prompt on the confirmation page) so orders still get tied to their phone number for future order-history lookup.
5. **Shipping partner:** **Shiprocket**, integrated via API for order push, tracking, and label generation (Section 3 tech stack updated). Admin panel's Order Management (Section 6.4) should surface Shiprocket tracking status directly rather than requiring manual CSV export.
6. **Reviews policy:** **Verified purchasers only.** A review can only be submitted against a delivered order item (Section 5.5, data model Section 8 updated to require an `order_item_id` on each review).
7. **Catalog size:** **50–100 SKUs** at launch. This is small enough for manual entry via the admin panel (Section 6.2) to be practical — a bulk CSV import tool is a nice-to-have, not required for v1, but worth adding if the catalog is expected to grow significantly (e.g. past 150–200 SKUs) or if SKUs need frequent re-uploading in bulk.

All open questions have now been answered — this PRD is ready to hand to Claude Code for build.

---

*End of PRD*
