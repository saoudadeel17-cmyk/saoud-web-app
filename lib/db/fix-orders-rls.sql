-- Run in Supabase SQL Editor — fixes checkout "permission denied for table orders"

-- Ensure roles can access tables (often missing on manual schema runs)
grant usage on schema public to anon, authenticated, service_role;
grant all on public.orders to authenticated, service_role;
grant all on public.order_items to authenticated, service_role;
grant all on public.profiles to authenticated, service_role;
grant all on public.reviews to authenticated, service_role;

-- Drop and recreate order policies
drop policy if exists "Users can create orders" on public.orders;
drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Users can insert order items" on public.order_items;
drop policy if exists "Users can view own order items" on public.order_items;
drop policy if exists "Admins can manage all orders" on public.orders;
drop policy if exists "Admins can manage all order items" on public.order_items;

create policy "Users can create orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where id = order_id and user_id = auth.uid()
    )
  );

create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where id = order_id and user_id = auth.uid()
    )
  );

-- Uses is_admin() from fix-rls-recursion.sql (run that first if not applied)
create policy "Admins can manage all orders"
  on public.orders for all
  using (public.is_admin());

create policy "Admins can manage all order items"
  on public.order_items for all
  using (public.is_admin());
