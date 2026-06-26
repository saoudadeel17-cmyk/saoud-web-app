-- Run ONCE in Supabase → SQL Editor (Dashboard → SQL → New query → Run)
-- Fixes: infinite recursion on profiles + permission denied for orders

-- ── 1. Helpers (SECURITY DEFINER bypasses RLS) ──

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

create or replace function public.get_my_orders()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select coalesce(
    (
      select jsonb_agg(row_data)
      from (
        select
          to_jsonb(o) || jsonb_build_object(
            'order_items',
            coalesce((
              select jsonb_agg(to_jsonb(i))
              from public.order_items i
              where i.order_id = o.id
            ), '[]'::jsonb)
          ) as row_data
        from public.orders o
        where o.user_id = auth.uid()
        order by o.created_at desc
      ) ordered
    ),
    '[]'::jsonb
  )
  into result;

  return result;
end;
$$;

grant execute on function public.is_admin() to authenticated, anon, service_role;
grant execute on function public.user_owns_order(uuid) to authenticated, service_role;
grant execute on function public.get_my_orders() to authenticated;

-- ── 2. Table grants (fixes permission denied for service_role) ──

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on public.profiles to authenticated, service_role;
grant select, insert, update, delete on public.orders to authenticated, service_role;
grant select, insert, update, delete on public.order_items to authenticated, service_role;
grant select on public.products to anon, authenticated, service_role;
grant select, insert, update, delete on public.reviews to authenticated, service_role;

grant all on all sequences in schema public to authenticated, service_role;

-- ── 3. Drop broken / duplicate policies ──

drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can manage products" on public.products;
drop policy if exists "Admins can manage all orders" on public.orders;
drop policy if exists "Admins can manage all order items" on public.order_items;
drop policy if exists "Users can create orders" on public.orders;
drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Users can insert order items" on public.order_items;
drop policy if exists "Users can view own order items" on public.order_items;

-- ── 4. Profiles ──

drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

-- ── 5. Products ──

drop policy if exists "Anyone can view active products" on public.products;
drop policy if exists "Admins can manage products" on public.products;

create policy "Anyone can view active products"
  on public.products for select
  using (is_active = true);

create policy "Admins can manage products"
  on public.products for all
  using (public.is_admin());

-- ── 6. Orders (no subquery on profiles) ──

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can create orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Admins can manage all orders"
  on public.orders for all
  using (public.is_admin());

-- ── 7. Order items (security definer — avoids profiles recursion) ──

create policy "Users can view own order items"
  on public.order_items for select
  using (public.user_owns_order(order_id));

create policy "Users can insert order items"
  on public.order_items for insert
  with check (public.user_owns_order(order_id));

create policy "Admins can manage all order items"
  on public.order_items for all
  using (public.is_admin());
