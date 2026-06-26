-- Run this in Supabase SQL Editor

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Products
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10,2) not null,
  price_pkr numeric(10,2) not null,
  compare_at_price numeric(10,2),
  compare_at_price_pkr numeric(10,2),
  stock integer default 0,
  category text,
  tags text[] default '{}',
  images text[] default '{}',
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  status text not null default 'pending_payment',
  payment_method text not null,
  payment_reference text,
  receipt_url text,
  tracking_number text,
  total_pkr numeric(10,2) not null,
  delivery_fee_pkr numeric(10,2) default 0,
  delivery_method text not null default 'standard',
  shipping_address jsonb not null,
  created_at timestamptz default now()
);

-- Order Items
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  quantity integer not null,
  price_pkr numeric(10,2) not null
);

-- Reviews
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id text not null,
  user_id uuid references public.profiles(id),
  user_name text not null,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text not null,
  is_verified_purchase boolean default false,
  created_at timestamptz default now()
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;

-- Admin check helper (avoids infinite recursion in profiles policies)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.user_owns_order(order_uuid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.orders o
    where o.id = order_uuid and o.user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to authenticated, anon, service_role;
grant execute on function public.user_owns_order(uuid) to authenticated, service_role;

-- Profiles: users can read/update own
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (public.is_admin());

-- Products: public read, admin write
create policy "Anyone can view active products" on public.products for select using (is_active = true);
create policy "Admins can manage products" on public.products for all using (public.is_admin());

-- Orders: users see own, admins see all
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can create orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Admins can manage all orders" on public.orders for all using (public.is_admin());

-- Order items: use security definer helper (no profiles recursion)
create policy "Users can view own order items" on public.order_items for select using (public.user_owns_order(order_id));
create policy "Users can insert order items" on public.order_items for insert with check (public.user_owns_order(order_id));
create policy "Admins can manage all order items" on public.order_items for all using (public.is_admin());

-- Grants
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on public.profiles to authenticated, service_role;
grant select, insert, update, delete on public.orders to authenticated, service_role;
grant select, insert, update, delete on public.order_items to authenticated, service_role;
grant select on public.products to anon, authenticated, service_role;
grant select, insert, update, delete on public.reviews to authenticated, service_role;
grant all on all sequences in schema public to authenticated, service_role;

-- Reviews: public read, authenticated write
create policy "Anyone can view reviews" on public.reviews for select using (true);
create policy "Authenticated users can create reviews" on public.reviews for insert with check (auth.uid() = user_id);
create policy "Users can delete own reviews" on public.reviews for delete using (auth.uid() = user_id);

-- Storage buckets (create manually in Supabase Dashboard):
-- 1. "product-images" → public bucket
-- 2. "payment-receipts" → private bucket (admin access only)
-- 3. "avatars" → public bucket
