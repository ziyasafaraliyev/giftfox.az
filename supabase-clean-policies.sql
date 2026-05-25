-- Run this first if Supabase says a policy already exists.

drop policy if exists "Anyone can read products" on public.products;
drop policy if exists "Admin can manage products" on public.products;

drop policy if exists "Anyone can create orders" on public.orders;
drop policy if exists "Admin can read and update orders" on public.orders;

drop policy if exists "Anyone can create order items" on public.order_items;
drop policy if exists "Admin can read and update order items" on public.order_items;

drop policy if exists "Anyone can read product images" on storage.objects;
drop policy if exists "Admin can upload product images" on storage.objects;
drop policy if exists "Admin can update product images" on storage.objects;
drop policy if exists "Admin can delete product images" on storage.objects;
