import type { SupabaseClient } from '@supabase/supabase-js'
import type { OrderStatus } from '@/types'

export interface UserOrderRow {
  id: string
  status: OrderStatus
  total_pkr: number
  created_at: string
  order_items?: Array<{ product_name: string; quantity: number; price_pkr?: number }>
}

/** Fetch orders for the authenticated user. Tries RPC, then admin, then direct RLS queries. */
export async function fetchUserOrders(
  userId: string,
  supabase: SupabaseClient,
  admin?: SupabaseClient
): Promise<{ orders: UserOrderRow[]; error: string | null }> {
  const { data: rpcData, error: rpcError } = await supabase.rpc('get_my_orders')

  if (!rpcError && rpcData != null) {
    return { orders: rpcData as UserOrderRow[], error: null }
  }

  if (admin) {
    const { data, error } = await admin
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error) {
      return { orders: (data as UserOrderRow[]) ?? [], error: null }
    }
  }

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (ordersError) {
    return { orders: [], error: ordersError.message }
  }

  const list = orders ?? []
  if (!list.length) {
    return { orders: [], error: null }
  }

  const orderIds = list.map((o) => o.id)
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', orderIds)

  if (itemsError) {
    return { orders: [], error: itemsError.message }
  }

  const itemsByOrder = new Map<string, Array<Record<string, unknown>>>()
  for (const item of items ?? []) {
    const group = itemsByOrder.get(item.order_id) ?? []
    group.push(item)
    itemsByOrder.set(item.order_id, group)
  }

  const withItems = list.map((order) => ({
    ...order,
    order_items: itemsByOrder.get(order.id) ?? [],
  }))

  return { orders: withItems as UserOrderRow[], error: null }
}
