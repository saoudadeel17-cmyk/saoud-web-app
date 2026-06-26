import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { fetchUserOrders } from '@/lib/orders/fetchUserOrders'
import { COD_LIMIT_PKR } from '@/types'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let admin
  try {
    admin = createAdminClient()
  } catch {
    admin = undefined
  }

  const { orders, error } = await fetchUserOrders(user.id, supabase, admin)

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ orders })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { items, shipping, delivery_method, payment_method, payment_reference, receipt_url } = body

  const subtotal = items.reduce(
    (s: number, i: { price_pkr: number; quantity: number }) => s + i.price_pkr * i.quantity,
    0
  )
  const delivery_fee_pkr = body.delivery_fee_pkr ?? 0
  const total_pkr = subtotal + delivery_fee_pkr

  if (payment_method === 'cod' && total_pkr > COD_LIMIT_PKR) {
    return NextResponse.json(
      { error: `COD not available over Rs. ${COD_LIMIT_PKR}` },
      { status: 400 }
    )
  }

  const admin = createAdminClient()
  let status = 'pending_payment'
  if (payment_method === 'bank_transfer') status = 'pending_verification'
  if (payment_method === 'cod') status = 'cod_pending'

  const { data: order, error } = await admin
    .from('orders')
    .insert({
      user_id: user.id,
      status,
      payment_method,
      payment_reference: payment_reference ?? null,
      receipt_url: receipt_url ?? null,
      total_pkr,
      delivery_fee_pkr,
      delivery_method,
      shipping_address: shipping,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await admin.from('order_items').insert(
    items.map((item: { id: string; name: string; quantity: number; price_pkr: number }) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price_pkr: item.price_pkr,
    }))
  )

  return NextResponse.json({ orderId: order.id })
}
