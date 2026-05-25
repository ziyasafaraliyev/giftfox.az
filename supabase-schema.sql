-- Gift Fox Supabase setup
-- Run this in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  category text not null,
  occasion text not null,
  product_type text not null default 'ready_box' check (product_type in ('ready_box', 'custom_item')),
  price numeric(10, 2) not null check (price >= 0),
  rating numeric(2, 1) not null default 4.8 check (rating >= 0 and rating <= 5),
  image_url text not null,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  note text,
  total numeric(10, 2) not null default 0,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create unique index if not exists products_name_unique on public.products (name);

alter table public.products
add column if not exists product_type text not null default 'ready_box';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_product_type_check'
  ) then
    alter table public.products
    add constraint products_product_type_check
    check (product_type in ('ready_box', 'custom_item'));
  end if;
end $$;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Anyone can read products" on public.products;
create policy "Anyone can read products"
on public.products for select
using (true);

drop policy if exists "Admin can manage products" on public.products;
create policy "Admin can manage products"
on public.products for all
using ((auth.jwt() ->> 'email') = 'ziyasefereliyev211@gmail.com')
with check ((auth.jwt() ->> 'email') = 'ziyasefereliyev211@gmail.com');

drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders"
on public.orders for insert
with check (true);

drop policy if exists "Admin can read and update orders" on public.orders;
create policy "Admin can read and update orders"
on public.orders for all
using ((auth.jwt() ->> 'email') = 'ziyasefereliyev211@gmail.com')
with check ((auth.jwt() ->> 'email') = 'ziyasefereliyev211@gmail.com');

drop policy if exists "Anyone can create order items" on public.order_items;
create policy "Anyone can create order items"
on public.order_items for insert
with check (true);

drop policy if exists "Admin can read and update order items" on public.order_items;
create policy "Admin can read and update order items"
on public.order_items for all
using ((auth.jwt() ->> 'email') = 'ziyasefereliyev211@gmail.com')
with check ((auth.jwt() ->> 'email') = 'ziyasefereliyev211@gmail.com');

drop policy if exists "Anyone can read product images" on storage.objects;
create policy "Anyone can read product images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Admin can upload product images" on storage.objects;
create policy "Admin can upload product images"
on storage.objects for insert
with check (
  bucket_id = 'product-images'
  and (auth.jwt() ->> 'email') = 'ziyasefereliyev211@gmail.com'
);

drop policy if exists "Admin can update product images" on storage.objects;
create policy "Admin can update product images"
on storage.objects for update
using (
  bucket_id = 'product-images'
  and (auth.jwt() ->> 'email') = 'ziyasefereliyev211@gmail.com'
)
with check (
  bucket_id = 'product-images'
  and (auth.jwt() ->> 'email') = 'ziyasefereliyev211@gmail.com'
);

drop policy if exists "Admin can delete product images" on storage.objects;
create policy "Admin can delete product images"
on storage.objects for delete
using (
  bucket_id = 'product-images'
  and (auth.jwt() ->> 'email') = 'ziyasefereliyev211@gmail.com'
);

insert into public.products (name, description, category, occasion, product_type, price, rating, image_url, in_stock)
values
  ('Midnight Cocoa Box', 'Small-batch chocolate, spiced biscuits, velvet cocoa, and a handwritten note.', 'Gourmet', 'Birthday', 'ready_box', 48, 4.9, 'https://images.unsplash.com/photo-1607344645866-009c320f4c32?auto=format&fit=crop&w=900&q=80', true),
  ('Bloom & Candle Set', 'Fresh seasonal stems paired with a clean-burning soy candle and linen wrap.', 'Wellness', 'Thank You', 'ready_box', 64, 4.8, 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=900&q=80', true),
  ('New Home Ritual', 'Ceramic tray, olive wood spoon, room mist, tea towel, and pantry treats.', 'Home', 'Housewarming', 'ready_box', 82, 4.9, 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=900&q=80', true),
  ('Golden Desk Drop', 'Premium notebook, brass pen, roasted coffee, and branded message card.', 'Corporate', 'Corporate', 'ready_box', 56, 4.7, 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=80', true),
  ('Little Joy Crate', 'Plush friend, activity cards, fruit candies, stickers, and playful packaging.', 'Kids', 'Birthday', 'custom_item', 42, 4.8, 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80', true),
  ('Rose Morning Hamper', 'Rose preserves, sparkling tea, macarons, bath soak, and a keepsake card.', 'Romantic', 'Anniversary', 'custom_item', 74, 5.0, 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=80', true)
on conflict (name) do nothing;

insert into public.products (name, description, category, occasion, product_type, price, rating, image_url, in_stock)
values
  ('"Babyfox" milk chocolate bar with milk filling, 45 g', '100% natural milk chocolate bar with milk filling.', 'Babyfox', 'Custom', 'custom_item', 2.90, 4.8, 'https://kdv-group.com/uploads/catalog-offer/c36645e2496be32c1829165dfddd15d8.jpg', true),
  ('«BABYFOX» milk chocolate with caramel filling, 45g', 'Milk chocolate bar with caramel filling.', 'Babyfox', 'Custom', 'custom_item', 3.20, 4.8, 'https://kdv-group.com/uploads/catalog-offer/2f41f4e71ff5924838917742a85d8fe8.jpg', true),
  ('«BABYFOX» milk chocolate with nut filling, 45g', 'Milk chocolate bar with nut filling.', 'Babyfox', 'Custom', 'custom_item', 3.40, 4.8, 'https://kdv-group.com/uploads/catalog-offer/ecc3c0671ca3e6deec90d409bc799687.jpg', true),
  ('“Babyfox” Creamy White wafer bar, 18.2g', 'Creamy White wafer bar with hazelnut paste and milk chocolate.', 'Babyfox', 'Custom', 'custom_item', 2.70, 4.8, 'https://kdv-group.com/uploads/catalog-offer/eead547cfe4621c3e19430b223a5a7d0.jpg', true),
  ('“Babyfox” Creamy Dark wafer bar, 18.2g', 'Creamy Dark wafer bar with rich chocolate filling.', 'Babyfox', 'Custom', 'custom_item', 2.70, 4.8, 'https://kdv-group.com/uploads/catalog-offer/3c988515048e86c2189f8ebeb74a7780.jpg', true),
  ('“Babyfox” Creamy Choco wafer bar, 23g', 'Creamy Choco wafer bar with smooth milk chocolate.', 'Babyfox', 'Custom', 'custom_item', 2.90, 4.8, 'https://kdv-group.com/uploads/catalog-offer/5871d0f4f0fd8085eb900b781d03b05d.jpg', true),
  ('«BabyFox» “Creamy” wafer bars 23g * 5', 'Pack of five Creamy wafer bars.', 'Babyfox', 'Custom', 'custom_item', 12.50, 4.8, 'https://kdv-group.com/uploads/catalog-offer/4a0506f4ceac7b24d1e7f8b76a513734.jpg', true),
  ('«Babyfox» Dragee consists of two-layer chocolate in colored glaze. 45g.', 'Two-layer chocolate dragee in colorful glaze.', 'Babyfox', 'Custom', 'custom_item', 3.90, 4.8, 'https://kdv-group.com/uploads/catalog-offer/804a17755f1e22f5b32f0baea2c62658.jpg', true),
  ('"Babyfox" chewy jelly, with berry and fruit juice, 30 g', 'Berry jelly candy with fruit juice.', 'Babyfox', 'Custom', 'custom_item', 2.40, 4.8, 'https://kdv-group.com/uploads/catalog-offer/dd40d24399ad41f9f879f880fb921a3b.jpg', true),
  ('"Babyfox" chewy jelly, with berry and fruit juice, 70 g', 'Large jelly candy with berry and fruit juice.', 'Babyfox', 'Custom', 'custom_item', 4.20, 4.8, 'https://kdv-group.com/uploads/catalog-offer/49919c24dc3310353c415cfcec813c55.jpg', true),
  ('"Babyfox" chewy jelly, with berry and fruit juice, 30 g (2)', 'Berry jelly candy with fruit juice variant.', 'Babyfox', 'Custom', 'custom_item', 2.40, 4.8, 'https://kdv-group.com/uploads/catalog-offer/333712356575ef187b9eeb34d6b40606.jpg', true),
  ('Babyfox Drink with cocoa, 135 g', 'Instant cocoa drink with vitamins.', 'Babyfox', 'Custom', 'custom_item', 5.90, 4.8, 'https://kdv-group.com/uploads/catalog-offer/6a20c32efcc11e4cf8288d179f94e24e.jpg', true),
  ('Babyfox mini with milk filling', 'Mini milk-filled Babyfox candies.', 'Babyfox', 'Custom', 'custom_item', 3.20, 4.8, 'https://kdv-group.com/uploads/catalog-offer/806365624c90d5cf08e24ab9a89801bb.jpg', true),
  ('Babyfox mini with milk filling (new)', 'New mini milk-filled Babyfox candies.', 'Babyfox', 'Custom', 'custom_item', 3.20, 4.8, 'https://kdv-group.com/uploads/catalog-offer/318b8009fc8583fade555bee616c33d2.jpg', true),
  ('«Babyfox» Pralines Style chocolate candies with hazelnut, peanut and milk chocolate, 90g', 'Praline-style chocolate candies with hazelnut and peanut.', 'Babyfox', 'Custom', 'custom_item', 5.50, 4.8, 'https://kdv-group.com/uploads/catalog-offer/200668da654eb333a68c27d72b0bb16b.jpg', true),
  ('Babyfox Kids Chocolate 90g', 'Babyfox chocolate for kids, 90 g.', 'Babyfox', 'Custom', 'custom_item', 5.50, 4.8, 'https://kdv-group.com/uploads/catalog-offer/1fde479c6010686ae50ef47cb8441e9e.jpg', true),
  ('Babyfox Kids Chocolate 24g', 'Babyfox kids chocolate, 24 g.', 'Babyfox', 'Custom', 'custom_item', 2.10, 4.8, 'https://kdv-group.com/uploads/catalog-offer/8d758d52f87ab36ef49829021f5bb49c.jpg', true),
  ('Babyfox Kids Chocolate 12g', 'Babyfox kids chocolate, 12 g.', 'Babyfox', 'Custom', 'custom_item', 1.30, 4.8, 'https://kdv-group.com/uploads/catalog-offer/d85b0542ad5d5ba52fa33aab9ced2abe.jpg', true)
on conflict (name) do nothing;
