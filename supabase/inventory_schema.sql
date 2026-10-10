-- Nayra Luxe Inventory & Invoice System — Supabase schema
-- Run this once in the Supabase SQL editor for your project (same project as
-- the main site's supabase/schema.sql).
--
-- Tables are prefixed `inventory_` so they don't collide with the shop's own
-- `products` table (different shape — this is purchase-batch stock tracking,
-- not the storefront catalog).

create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- Products & Batches
-- ─────────────────────────────────────────────────────────────

create table if not exists inventory_products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null check (category in ('Necklace', 'Bracelet', 'Earring', 'Ring')),
  image_url text,
  low_stock_threshold int not null default 3,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists inventory_batches (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references inventory_products(id) on delete cascade,
  purchase_date date not null default current_date,
  original_price numeric(10,2) not null check (original_price >= 0),
  selling_price numeric(10,2) not null check (selling_price >= 0),
  quantity_bought int not null check (quantity_bought >= 0),
  quantity_remaining int not null check (quantity_remaining >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_inventory_batches_product_id on inventory_batches(product_id);

-- ─────────────────────────────────────────────────────────────
-- Invoice numbering: DDMMYYHHMM + a sequence number that
-- increments forever and never resets.
-- ─────────────────────────────────────────────────────────────

create sequence if not exists inventory_invoice_sequence start 1;

create or replace function generate_inventory_invoice_number()
returns text
language plpgsql
as $$
declare
  seq_val bigint;
  ts_part text;
begin
  seq_val := nextval('inventory_invoice_sequence');
  ts_part := to_char(now(), 'DDMMYYHH24MI');
  return ts_part || seq_val::text;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- Invoices & Line Items
-- ─────────────────────────────────────────────────────────────

create table if not exists inventory_invoices (
  id uuid primary key default uuid_generate_v4(),
  invoice_number text not null unique default generate_inventory_invoice_number(),
  customer_name text not null,
  payment_mode text not null check (payment_mode in ('UPI', 'Cash', 'Card', 'Bank Transfer', 'Other')),
  payment_status text not null check (payment_status in ('Paid', 'Pending')) default 'Pending',
  subtotal numeric(10,2) not null default 0,
  grand_total numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists inventory_invoice_line_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references inventory_invoices(id) on delete cascade,
  product_id uuid not null references inventory_products(id),
  product_name_snapshot text not null,
  category_snapshot text not null,
  batch_id uuid not null references inventory_batches(id),
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  is_discounted boolean not null default false,
  line_total numeric(10,2) not null
);

create index if not exists idx_inventory_line_items_invoice_id on inventory_invoice_line_items(invoice_id);

-- ─────────────────────────────────────────────────────────────
-- Stock deduction: FIFO across batches (oldest purchase_date first).
-- Called once per line item when an invoice is created.
-- ─────────────────────────────────────────────────────────────

create or replace function deduct_inventory_stock_fifo(p_product_id uuid, p_quantity int)
returns table (batch_id uuid, deducted int)
language plpgsql
as $$
declare
  remaining_to_deduct int := p_quantity;
  batch_record record;
  deduct_amount int;
begin
  for batch_record in
    select id, quantity_remaining
    from inventory_batches
    where product_id = p_product_id
      and is_active = true
      and quantity_remaining > 0
    order by purchase_date asc, created_at asc
    for update
  loop
    exit when remaining_to_deduct <= 0;

    deduct_amount := least(batch_record.quantity_remaining, remaining_to_deduct);

    update inventory_batches
    set quantity_remaining = quantity_remaining - deduct_amount
    where id = batch_record.id;

    batch_id := batch_record.id;
    deducted := deduct_amount;
    return next;

    remaining_to_deduct := remaining_to_deduct - deduct_amount;
  end loop;

  if remaining_to_deduct > 0 then
    raise exception 'Insufficient stock for product %: % unit(s) short', p_product_id, remaining_to_deduct;
  end if;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- Row Level Security — this data (stock costs, invoices, customer names) is
-- read and written exclusively through server-side API routes using the
-- service role key, which bypasses RLS. Deliberately NO policies are defined
-- below, so the public anon key (exposed in the browser bundle) gets zero
-- access — not read, not write — to any of these four tables.
-- ─────────────────────────────────────────────────────────────

alter table inventory_products enable row level security;
alter table inventory_batches enable row level security;
alter table inventory_invoices enable row level security;
alter table inventory_invoice_line_items enable row level security;
