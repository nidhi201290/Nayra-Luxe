# Nayra Luxe — Design System

**Version:** 1.0
**Companion to:** Nayra Luxe Website PRD
**Purpose:** This document defines the visual language (color, type, spacing, components) for the Nayra Luxe website. Claude Code should treat every token and rule in this document as authoritative — new UI should be built from these values rather than arbitrary hex codes, font sizes, or spacing.

**Source of truth for brand colors:** extracted directly from the official Nayra Luxe logo file (`Nayra_Luxe.png`) via pixel sampling — these are the *exact* colors used in the logo, not approximations.

---

## 1. Logo

- **Primary logo:** Circular laurel-wreath emblem with interlocking "N" and "L" monogram and a small diamond icon, paired with the "NAYRA LUXE" wordmark in letter-spaced serif caps below it.
- **Format provided:** PNG, transparent background, 2482×1215px (landscape lockup — emblem stacked above wordmark).
- **Style:** Feminine, refined, jewelry-emblem style — laurel leaves, a monogram, and a diamond glyph signal craftsmanship and luxury. This visual language (thin linework, laurel leaf motifs, diamond/gem iconography) should inform supporting graphics across the site (dividers, icon set, badges), not just the logo itself.

### 1.1 Logo Usage Rules
- **Clear space:** Maintain a minimum clear space around the logo equal to the height of the "N" in the wordmark, on all sides. Nothing (text, images, edges) should intrude into this zone.
- **Minimum size:** Do not display the full lockup (emblem + wordmark) below 120px wide, or the wordmark becomes illegible. For small placements (favicon, mobile nav bar, app icon), use the monogram/emblem alone.
- **Backgrounds:** The logo as provided is gold (#AA7717) + black (#000000) on transparent — this works cleanly on white, ivory, and light backgrounds. **A reversed (white/light-gold) version will be needed for dark backgrounds** (e.g. a dark footer, if used) — Claude Code should flag this as an asset gap rather than auto-generating a recolored logo, since color-inversion of a detailed emblem like this often needs manual cleanup.
- **Don'ts:**
  - Don't recolor the logo outside the defined brand palette (Section 2).
  - Don't stretch, skew, or distort the aspect ratio.
  - Don't place the full lockup on busy photographic backgrounds without a solid/blurred backdrop behind it — the fine laurel linework disappears on textured images.
  - Don't rebuild or trace the logo in code (e.g. redrawing it as inline SVG) unless a vector source file is provided — use the supplied PNG (or a vector export of it) as the image asset everywhere.

### 1.2 Favicon / App Icon
- Crop to the circular emblem only (monogram + laurel + diamond, no wordmark), on a white or ivory square background, since the full lockup is illegible at favicon size.

---

## 2. Color System

All colors below are exact values sampled from the logo file, plus a supporting neutral/functional palette designed to complement them (since the logo alone doesn't define background, text, or state colors — those are proposed here for Claude Code to implement consistently).

### 2.1 Brand Colors (from logo — do not alter)

| Token | Hex | RGB | Usage |
|---|---|---|---|
| `--color-gold-primary` | `#AA7717` | 170, 119, 23 | Primary brand color. Logo monogram, primary buttons, links, active states, icon accents, price highlights |
| `--color-gold-light` | `#D49B33` | 212, 155, 51 | Secondary/highlight gold. Hover states, decorative accents (dividers, borders), diamond/icon details, gradients paired with primary gold |
| `--color-ink` | `#000000` | 0, 0, 0 | Logo wordmark black. Use for the logo only — see Section 2.3 for body text color (pure black is harsher than needed for long-form UI text) |

### 2.2 Supporting Neutral Palette (proposed, to pair with the brand colors)

| Token | Hex | Usage |
|---|---|---|
| `--color-ivory` | `#FAF5EC` | Primary page background (softer than pure white, warms up the gold) |
| `--color-white` | `#FFFFFF` | Card backgrounds, product image backgrounds, header/nav background |
| `--color-charcoal` | `#2B2B2B` | Primary body text color (softer than pure black, better for long-form reading — see contrast notes in 2.4) |
| `--color-charcoal-muted` | `#6B6B6B` | Secondary text — captions, meta info, timestamps, helper text |
| `--color-border` | `#E7DFD1` | Dividers, input borders, card outlines — warm beige-gray that harmonizes with gold rather than a cold gray |
| `--color-blush` | `#F4E3D8` | Soft background fills — badges, promo banners, section backgrounds for visual variation without leaving the palette |

### 2.3 Functional / Feedback Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-success` | `#3F7D58` | Order confirmed, in-stock indicators, success toasts |
| `--color-error` | `#B3261E` | Form validation errors, out-of-stock, failed payment |
| `--color-sale` | `#B3261E` | Discount badges / strikethrough price tags (reuse error red — reads as "deal" red in e-commerce UI, distinct from gold) |
| `--color-warning` | `#B8860B` | Low-stock warnings ("Only 2 left") — a deeper gold-amber, stays in-palette |

### 2.4 Accessibility / Contrast Notes — important for Claude Code

Contrast ratios were checked against WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text ≥18px/24px-bold and for UI components/icons):

| Pair | Ratio | Verdict |
|---|---|---|
| Gold Primary (`#AA7717`) on White/Ivory | 3.9:1 | ❌ Fails for normal body text. ✅ OK for large headings (≥24px), buttons with bold/large label text, icons, decorative elements |
| Charcoal (`#2B2B2B`) on White/Ivory | 13–14:1 | ✅ Passes easily — **use Charcoal, not Gold, for all body/paragraph text** |
| Black (`#000000`) on White | 21:1 | ✅ Passes — reserved for the logo wordmark, not recommended for large blocks of UI body text (too harsh against the warm palette) |
| Gold Light (`#D49B33`) on White | 2.5:1 | ❌ Never use for text — decorative/border/icon use only |
| White text on Gold Primary background | 3.9:1 | ⚠️ OK for large button labels (bold, ≥16px), not for small print |

**Rule of thumb for Claude Code:** Gold is a **brand accent and interactive-state color**, not a body-text color. Use Charcoal for all readable paragraph/label text; reserve Gold Primary for headings, buttons, links, icons, borders, and highlighted numerals (prices, badges).

### 2.5 Color Usage Guide by Context

| UI Element | Color |
|---|---|
| Page background | Ivory (`--color-ivory`) |
| Card / product tile background | White |
| Body text | Charcoal |
| Headings | Charcoal (default) or Gold Primary for special/decorative headings (e.g. section titles like "Bestsellers") |
| Primary button background | Gold Primary, white text |
| Primary button hover | Gold Light |
| Secondary/outline button | Transparent bg, Gold Primary border + text |
| Links | Gold Primary, underline on hover |
| Price (sale) | Charcoal or Gold Primary for sale price, Charcoal-muted + strikethrough for MRP |
| Discount badge | `--color-sale` background, white text |
| Bestseller / New badge | Gold Primary background, white text OR Blush background with Gold Primary text |
| Input borders | `--color-border`, Gold Primary on focus |
| Dividers | `--color-border` |
| Icons (nav, cart, wishlist) | Charcoal default, Gold Primary on hover/active |

---

## 3. Typography

> **Override (founder-directed, supersedes the original serif direction below the divider):** the founder asked Claude Code to match **mehere.shop's actual typefaces** rather than the logo-derived serif pairing this section originally specified. Live computed styles pulled from mehere.shop: section headings set in **Sora** (36px/700/line-height 54px), nav links in Sora (16px/500/uppercase/normal tracking), and body copy/product titles/prices in **Fira Sans** (18px/400 for titles, 20px/700 for sale price, 16px/400 for MRP + discount %, 12px/500 for nav-secondary labels and coupon codes). This moves the brand from an "elegant editorial serif" feel toward mehere.shop's cleaner, modern D2C sans-only look. Colors, spacing, radius, and shadows are **not** part of this override — those stay as defined in Sections 2 and 4.

### 3.1 Typefaces

| Role | Typeface | Fallback stack | Source |
|---|---|---|---|
| Headings (H1–H2, large section/page titles, nav links) | **Sora** | `'Sora', -apple-system, sans-serif` | Google Fonts |
| Body / UI text (paragraphs, buttons, forms, product titles, prices, H3+ sub-headings) | **Fira Sans** | `'Fira Sans', -apple-system, sans-serif` | Google Fonts |

### 3.2 Type Scale

| Token | Size (px / rem) | Weight | Line-height | Usage |
|---|---|---|---|---|
| `--text-display` | 48px / 3rem | 700, Sora | 1.5 | Hero banner headline |
| `--text-h1` | 36px / 2.25rem | 700, Sora | 1.5 | Page titles, large section titles ("Bestsellers") — matches mehere.shop exactly |
| `--text-h2` | 28px / 1.75rem | 700, Sora | 1.4 | Secondary section titles |
| `--text-h3` | 22px / 1.375rem | 600, Fira Sans (inherited body font) | 1.3 | Card group headers, modal titles |
| `--text-h4` | 18px / 1.125rem | 400, Fira Sans | 1.5 | Product card titles, form section labels — matches mehere.shop's product-title styling |
| `--text-body-lg` | 18px / 1.125rem | 400, Fira Sans | 1.6 | Primary body copy, category names |
| `--text-body` | 14px / 0.875rem | 400, Fira Sans | 1.6 | Secondary text, form labels, announcement bar |
| `--text-caption` | 12px / 0.75rem | 500, Fira Sans | 1.5 | Meta info, nav-secondary labels, coupon codes |
| `--text-button` | 14px | 600, Fira Sans | 1 | Button labels |
| *(component-level)* Sale price | 20px | 700, Fira Sans | — | Matches mehere.shop's price styling exactly |
| *(component-level)* MRP / discount % | 16px | 400, Fira Sans | — | Matches mehere.shop's price styling exactly |
| *(component-level)* Nav link | 16px | 500, Sora, uppercase | — | Matches mehere.shop's nav exactly |

### 3.3 Typography Rules
- Headings default to **Charcoal**; use **Gold Primary** sparingly for emphasis headings (e.g. a homepage section eyebrow label in gold, small-caps, tracked).
- Only H1/H2-level headings (page titles, large section titles) and nav links use Sora — H3 and smaller (card titles, modal titles, subsection labels) use Fira Sans, matching mehere.shop's actual pattern of reserving the display font for a handful of big moments rather than the whole heading hierarchy.
- Avoid more than 2 typefaces total on any single page (Sora + Fira Sans is the ceiling).
- Body copy should never drop below 14px for accessibility/readability, especially on mobile where most traffic originates (Instagram in-app browser).

---

## 4. Spacing & Layout System

### 4.1 Spacing Scale (4px base unit)

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Icon-to-label gaps, tight inline spacing |
| `--space-2` | 8px | Form field internal padding, chip padding |
| `--space-3` | 12px | Card internal padding (mobile) |
| `--space-4` | 16px | Standard component padding, gap between related elements |
| `--space-6` | 24px | Card internal padding (desktop), gap between cards in a grid |
| `--space-8` | 32px | Section internal padding (mobile) |
| `--space-12` | 48px | Section vertical padding (desktop) |
| `--space-16` | 64px | Major section separation on homepage |
| `--space-24` | 96px | Hero/large banner vertical breathing room (desktop) |

### 4.2 Grid & Breakpoints

| Breakpoint | Width | Columns | Gutter |
|---|---|---|---|
| Mobile | ≤480px | 2-column product grid | 12px |
| Tablet | 481–1024px | 2–3 column product grid | 16px |
| Desktop | 1025px+ | 4-column product grid, 12-column layout grid | 24px |

- **Max content width:** 1280px, centered, with fluid side padding (`--space-4` mobile → `--space-8` desktop).
- **Mobile-first:** build all components at the mobile breakpoint first per the PRD's mobile-first priority, then scale up.

### 4.3 Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Inputs, small badges |
| `--radius-md` | 8px | Buttons, product cards |
| `--radius-lg` | 16px | Modals, large image containers |
| `--radius-full` | 999px | Pill badges, avatar/icon circles, the wishlist heart button |

### 4.4 Elevation / Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.06)` | Product cards at rest |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.10)` | Product cards on hover, dropdowns |
| `--shadow-lg` | `0 12px 32px rgba(0,0,0,0.14)` | Modals, mini-cart drawer, sticky mobile Add-to-Cart bar |

Keep shadows soft and warm — avoid pure black shadows; if fine-tuning, a very subtle warm-tinted shadow (e.g. `rgba(43,43,43,0.08)` using Charcoal) fits the palette better than default black.

---

## 5. Iconography

- **Style:** Thin-line (1.5px stroke), rounded caps — matches the delicate laurel linework in the logo. Avoid heavy filled/glyph-style icons; avoid overly geometric/tech-feeling icon sets.
- **Recommended library:** [Lucide](https://lucide.dev/) (open-source, thin-line, easily restyled) or Phosphor Icons (Light weight).
- **Color:** Charcoal by default, Gold Primary on hover/active/selected states (cart, wishlist-filled, account).
- **Custom brand icon moments:** Use the diamond glyph from the logo (simplified) as a recurring motif for "quality/anti-tarnish guarantee" trust badges, and a laurel-leaf sprig as a decorative divider between homepage sections — both should be extracted as standalone SVGs from brand assets rather than freely reinterpreted.

---

## 6. Imagery Guidelines

- **Product photography:** White or ivory seamless background for primary catalog shots (consistency across grid/PDP); a secondary lifestyle/worn shot per product against warm neutral tones (skin tones, linen, soft blush backdrops) — avoid cool-toned or heavily saturated backdrops that clash with the gold palette.
- **Hero/banner imagery:** Soft, warm-lit, editorial-style photography or flat lays; avoid harsh studio lighting or neon/cool color grading.
- **Overlay text on images:** When placing headline text over a photo, use a subtle warm-dark gradient scrim (Charcoal at low opacity) behind white or Ivory text — never place Gold Primary text directly on a busy photo (fails contrast).
- **Consistency:** All product images should be cropped to the same aspect ratio (recommend 4:5 portrait, common for jewelry e-commerce and Instagram-native crops) for a clean grid.

---

## 7. Component Guidelines

### 7.1 Buttons

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary | Gold Primary | White | none | Gold Light background |
| Secondary/Outline | Transparent | Gold Primary | 1.5px Gold Primary | Fills with Blush background |
| Tertiary/Text link | Transparent | Charcoal | none, underline on hover | Text turns Gold Primary |
| Disabled | `--color-border` | `--color-charcoal-muted` | none | no interaction |

- Padding: `12px 24px` (mobile), `14px 32px` (desktop) for standard buttons.
- Border radius: `--radius-md` (8px) — matches the softness of the laurel emblem's curves without being a full pill (reserve full pill shape for badges/tags, keeping a visual distinction).
- Label style: uppercase or title-case, `--text-button` token, slight letter-spacing as noted in 3.3.

### 7.2 Product Card
- White background, `--radius-md`, `--shadow-sm` at rest → `--shadow-md` on hover, image lifts slightly (`transform: translateY(-2px)`).
- Badge (Bestseller/New/Sale) top-left, `--radius-full` pill, per palette in 2.5.
- Wishlist heart icon top-right, circular white background with `--shadow-sm`, fills Gold Primary when active.

### 7.3 Badges / Tags
- Pill-shaped (`--radius-full`), `--text-caption` size, generous horizontal padding (12px).
- Discount/Sale: `--color-sale` background, white text.
- Bestseller/New: Gold Primary background, white text — or Blush background with Gold Primary text for a softer variant (use Blush version on lighter/busier image backgrounds for legibility).

### 7.4 Forms & Inputs
- Border: `--color-border`, `--radius-sm`, padding `12px 16px`.
- Focus state: border becomes Gold Primary, subtle glow (`box-shadow: 0 0 0 3px rgba(170,119,23,0.15)`).
- Error state: border becomes `--color-error`, helper text below in `--color-error`, `--text-caption`.
- Labels: `--text-body`, Charcoal, positioned above the field (not placeholder-only, for accessibility).

### 7.5 Navigation
- Header background: White, `--shadow-sm` on scroll (sticky).
- Active/current nav link: Charcoal text with a thin Gold Primary underline.
- Mobile drawer: Ivory background, laurel-leaf motif optionally used as a subtle background watermark at low opacity for brand texture.

### 7.6 Sticky WhatsApp Chat Icon (from PRD Section 5.14)
- Use standard WhatsApp green (`#25D366`) for the icon itself (recognizability matters more than palette-matching for this specific icon — users need to instantly recognize it as WhatsApp), but the surrounding shadow/ring can use `--shadow-lg` from this system for consistency with the rest of the site's elevation style.

---

## 8. Motion & Interaction

- **Transitions:** 200–250ms ease-in-out for hover states (buttons, cards, links) — nothing snappier/tech-feeling; the brand tone is unhurried and elegant.
- **Page transitions:** Simple fade/slide-up on route change (150–200ms), avoid flashy animation.
- **Image hover:** Gentle scale (1.0 → 1.03) on product card image hover, not an abrupt swap.
- **Loading states:** Skeleton loaders using `--color-border` tone (not gray), pulsing subtly — keeps the loading state on-brand rather than generic.

---

## 9. Implementation Reference — CSS Custom Properties

Claude Code can drop this block directly into the global stylesheet (e.g. `globals.css`) as the single source of design tokens:

```css
:root {
  /* Brand Colors */
  --color-gold-primary: #AA7717;
  --color-gold-light: #D49B33;
  --color-ink: #000000;

  /* Neutrals */
  --color-ivory: #FAF5EC;
  --color-white: #FFFFFF;
  --color-charcoal: #2B2B2B;
  --color-charcoal-muted: #6B6B6B;
  --color-border: #E7DFD1;
  --color-blush: #F4E3D8;

  /* Functional */
  --color-success: #3F7D58;
  --color-error: #B3261E;
  --color-sale: #B3261E;
  --color-warning: #B8860B;

  /* Typography */
  --font-display: 'Sora', -apple-system, sans-serif;
  --font-body: 'Fira Sans', -apple-system, sans-serif;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 999px;

  /* Shadow */
  --shadow-sm: 0 1px 3px rgba(43,43,43,0.06);
  --shadow-md: 0 4px 12px rgba(43,43,43,0.10);
  --shadow-lg: 0 12px 32px rgba(43,43,43,0.14);
}
```

### 9.1 Tailwind Config Extension (if using Tailwind CSS, per PRD tech stack)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        gold: { primary: '#AA7717', light: '#D49B33' },
        ink: '#000000',
        ivory: '#FAF5EC',
        charcoal: { DEFAULT: '#2B2B2B', muted: '#6B6B6B' },
        border: '#E7DFD1',
        blush: '#F4E3D8',
        success: '#3F7D58',
        error: '#B3261E',
        sale: '#B3261E',
        warning: '#B8860B',
      },
      fontFamily: {
        display: ['Sora', '-apple-system', 'sans-serif'],
        body: ['Fira Sans', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px', md: '8px', lg: '16px', full: '999px',
      },
    },
  },
};
```

---

## 11. Reference Site — UX & Interaction Patterns (from mehere.shop)

Nayra Luxe's **colors and logo identity come from Sections 1–2 above** (your own brand), not from the reference site. **Typography is the one exception** — per founder direction (Section 3), the type system now matches mehere.shop's actual fonts (Sora + Fira Sans) rather than the original serif pairing. What's otherwise worth borrowing from mehere.shop is its **interaction and layout patterns** — proven UX conventions for Indian D2C jewelry e-commerce that Claude Code should replicate structurally, then restyle with the Nayra Luxe palette from this document.

| Pattern | What mehere.shop does | Apply to Nayra Luxe as |
|---|---|---|
| Announcement bar | Rotating offer text at the very top ("Free Gift on orders above ₹1999") | Keep — style with Ivory/Gold Primary background, Charcoal or White text (Section 7) |
| Product card badge | "Bestseller" label pinned top-left on card image | Keep placement; restyle as the Gold Primary or Blush pill from Section 7.3 |
| Price display order | Sale price shown first/larger, MRP struck through beside it, then a "% Off" callout | Keep this order — it's a proven pattern for scan-ability; render sale price in Charcoal or Gold Primary, MRP in `--color-charcoal-muted` with strikethrough, discount badge in `--color-sale` |
| Card CTA row | "Add To Cart" + "Buy Now" + "View details" as a stacked action group on/under each card | Keep the three-action pattern for PDP; on grid cards keep it lighter — primary "Add to Cart" visible, "Buy Now"/"View details" can stay reserved for the PDP to avoid cluttering the grid |
| Variant products | Cards for products with size/color options show a "choose options" prompt instead of a direct add-to-cart | Keep — this maps to Section 5.6 of the PRD (quick-add opens a variant modal when a product has size/color options) |
| Coupon callout tiles | Discount codes shown as their own promotional tiles ("Get ₹149 off | Code: MEHERE149") right below the hero | Keep the pattern, restyle tiles with Blush background + Gold Primary code text per Section 2.5 |
| Category tile grid | Large square/portrait image tiles with the category name overlaid or below | Keep — matches PRD Section 5.1's "Shop by Category" grid; use the 4:5 image crop from Section 6 |
| Delivery/location check | A "check delivery to your pincode" prompt near login/cart | Keep — maps to the PDP delivery-check field in PRD Section 5.5, and ties into the Shiprocket serviceability API from the PRD's tech stack |
| Login pattern | Phone-number + OTP as the primary login method, presented in a slide-over/modal rather than a separate page | Keep — matches PRD Section 5.11 exactly; style the modal per Section 7.4 (forms) and 7.5 (overlays use `--shadow-lg`) |
| Navigation structure | Flat top-level nav: Home / Featured / Categories / Collections / My Orders / All Products | Adapt to Nayra Luxe's nav from PRD Section 5.1 (Home, Shop, category names, Collections, About) — same shallow, one-level-deep philosophy so mobile nav stays simple |

**Note on imagery/copy:** Do not reuse mehere.shop's actual product photos, banner images, or written copy — those are their brand assets. The table above is about *structure and interaction*, not content. Nayra Luxe's own product photography (per the PRD's asset checklist) and copy should fill every one of these patterns.

---

## 12. Asset Checklist (what's provided vs. still needed)

| Asset | Status |
|---|---|
| Primary logo (PNG, transparent, full lockup) | ✅ Provided (`Nayra_Luxe.png`) |
| Logo — favicon/emblem-only crop | ⚠️ Needs to be cropped from the source file (Section 1.2) |
| Logo — reversed/light version for dark backgrounds | ❌ Not yet available — flag if a dark-background placement is designed |
| Logo — vector (SVG/AI) source | ❌ Not yet confirmed — recommend requesting from whoever designed the logo, for crisp scaling at all sizes instead of relying on the PNG |
| Brand color palette | ✅ Extracted from logo (Section 2.1) |
| Typography | ✅ Sora + Fira Sans, matched to mehere.shop per founder direction (Section 3) |
| Product photography | ⚠️ Partial — some products photographed, rest pending (per PRD Section 12) |

---

*End of Design System*
