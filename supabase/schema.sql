-- Nayra Luxe — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push` if using the CLI)
-- against a fresh project. Safe to re-run: every statement is idempotent.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------

create table if not exists categories (
  slug text primary key,
  name text not null,
  description text not null default '',
  tone text not null default 'gold' check (tone in ('gold', 'blush', 'ivory'))
);

create table if not exists collections (
  slug text primary key,
  name text not null,
  description text not null default ''
);

create table if not exists products (
  id text primary key default ('prod-' || gen_random_uuid()),
  slug text not null unique,
  name text not null,
  category_slug text not null references categories (slug) on update cascade,
  collection_slugs text[] not null default '{}',
  base_price numeric(10, 2) not null,
  sale_price numeric(10, 2) not null,
  material text not null default '',
  plating text not null default '',
  description text not null default '',
  details text[] not null default '{}',
  care text[] not null default '{}',
  sku text not null unique,
  is_bestseller boolean not null default false,
  is_new boolean not null default false,
  status text not null default 'active' check (status in ('active', 'draft', 'out-of-stock')),
  rating numeric(2, 1) not null default 0,
  review_count integer not null default 0,
  variants jsonb not null default '[]',   -- ProductVariant[]
  reviews jsonb not null default '[]',    -- Review[]
  images text[] not null default '{}',    -- public Supabase Storage URLs
  image_hue integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_slug_idx on products (category_slug);
create index if not exists products_collection_slugs_idx on products using gin (collection_slugs);
create index if not exists products_status_idx on products (status);

create table if not exists coupons (
  code text primary key,
  discount_type text not null check (discount_type in ('flat', 'percent')),
  discount_value numeric(10, 2) not null,
  min_order_value numeric(10, 2) not null default 0,
  expiry_date date not null,
  usage_limit integer not null default 0,
  used_count integer not null default 0
);

-- ---------------------------------------------------------------------------
-- Customers, addresses, orders
-- ---------------------------------------------------------------------------

create table if not exists addresses (
  id text primary key default ('addr-' || gen_random_uuid()),
  user_phone text,                        -- matches auth.phone once real auth lands
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  landmark text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key default ('order-' || gen_random_uuid()),
  order_number text not null unique,
  user_phone text,
  status text not null default 'Placed' check (
    status in ('Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned')
  ),
  items jsonb not null default '[]',      -- OrderItem[]
  subtotal numeric(10, 2) not null,
  discount numeric(10, 2) not null default 0,
  shipping_fee numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  address jsonb not null,                 -- Address snapshot at time of order
  tracking_number text,
  courier text,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_phone_idx on orders (user_phone);
create index if not exists orders_created_at_idx on orders (created_at desc);

-- ---------------------------------------------------------------------------
-- Site media (hero banners, category tiles, etc. set from the admin Media page)
-- ---------------------------------------------------------------------------

create table if not exists site_media (
  key text primary key,                   -- matches lib/media-slots.ts MEDIA_SLOTS[].key
  url text not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Media library — every file uploaded through /api/upload gets a row here,
-- backed by a file of the same name in the `media` storage bucket. This is
-- what makes uploads durable (survives redeploys) instead of writing to the
-- serverless filesystem.
-- ---------------------------------------------------------------------------

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  storage_path text not null,
  folder text not null check (folder in ('products', 'media')),
  content_type text not null,
  size_bytes integer not null,
  created_at timestamptz not null default now()
);

create index if not exists media_folder_idx on media (folder);
create index if not exists media_created_at_idx on media (created_at desc);

-- ---------------------------------------------------------------------------
-- Storage bucket for uploaded images (public read, so product/site images
-- can be rendered directly by URL).
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- The storefront still runs mock phone-OTP auth (see README "What's not
-- wired up"), so there is no real auth.uid()/auth.phone() to key policies on
-- yet. Catalog data is public read. Writes to catalog/coupons/media go
-- through the service-role key from admin API routes only. Orders/addresses
-- allow anon insert (checkout is client-driven today) — tighten this to
-- auth.uid()-scoped policies once real Supabase Auth replaces the mock OTP.
-- ---------------------------------------------------------------------------

alter table categories enable row level security;
alter table collections enable row level security;
alter table products enable row level security;
alter table coupons enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table site_media enable row level security;
alter table media enable row level security;

drop policy if exists "categories public read" on categories;
create policy "categories public read" on categories for select using (true);

drop policy if exists "collections public read" on collections;
create policy "collections public read" on collections for select using (true);

drop policy if exists "products public read" on products;
create policy "products public read" on products for select using (true);

drop policy if exists "coupons public read" on coupons;
create policy "coupons public read" on coupons for select using (true);

drop policy if exists "site_media public read" on site_media;
create policy "site_media public read" on site_media for select using (true);

drop policy if exists "media public read" on media;
create policy "media public read" on media for select using (true);

drop policy if exists "addresses anon insert" on addresses;
create policy "addresses anon insert" on addresses for insert with check (true);
drop policy if exists "addresses anon read" on addresses;
create policy "addresses anon read" on addresses for select using (true);

drop policy if exists "orders anon insert" on orders;
create policy "orders anon insert" on orders for insert with check (true);
drop policy if exists "orders anon read" on orders;
create policy "orders anon read" on orders for select using (true);

-- Storage: public read on the `media` bucket, writes only via service role
-- (the /api/upload route), which bypasses RLS entirely.
drop policy if exists "media bucket public read" on storage.objects;
create policy "media bucket public read" on storage.objects
  for select using (bucket_id = 'media');
