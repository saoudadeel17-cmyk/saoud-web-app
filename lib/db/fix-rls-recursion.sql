-- Run this in Supabase SQL Editor if you already ran schema.sql
-- Fixes: infinite recursion detected in policy for relation "profiles"

-- Drop broken admin policies that query profiles inside profiles policies
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can manage products" on public.products;
drop policy if exists "Admins can manage all orders" on public.orders;

-- Helper: check admin without RLS recursion (security definer bypasses RLS)
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

-- Recreate admin policies using the helper
create policy "Admins can view all profiles" on public.profiles
  for select using (public.is_admin());

create policy "Admins can manage products" on public.products
  for all using (public.is_admin());

create policy "Admins can manage all orders" on public.orders
  for all using (public.is_admin());
