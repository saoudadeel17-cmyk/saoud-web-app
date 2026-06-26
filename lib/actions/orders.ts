'use server'

import { createClient } from '@/lib/supabase/server'
import { sendOrderConfirmationEmail } from '@/lib/emails/orderConfirmation'
import { getOrderError } from '@/lib/errors'
import {
  COD_LIMIT_PKR,
  DELIVERY_FEES,
  FREE_SHIPPING_THRESHOLD_PKR,
  type DeliveryMethod,
  type PaymentMethod,
  type ShippingAddress,
} from '@/types'
import { PAKISTAN_PHONE_REGEX } from '@/lib/utils'

export interface CreateOrderInput {
  items: Array<{
    id: string
    name: string
    slug: string
    price_pkr: number
    quantity: number
    image: string
  }>
  shipping: ShippingAddress
  delivery_method: DeliveryMethod
  payment_method: PaymentMethod
  payment_reference?: string
  receipt_url?: string
}

function deliveryFee(method: DeliveryMethod, subtotal: number): number {
  const fee = DELIVERY_FEES[method]
  if (method === 'standard' && subtotal >= FREE_SHIPPING_THRESHOLD_PKR) return 0
  return fee
}

export async function createOrder(input: CreateOrderInput) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (!user || authError) {
    return { error: 'You must be logged in to place an order.', redirect: '/login?redirect=/checkout' }
  }

  if (!PAKISTAN_PHONE_REGEX.test(input.shipping.phone.replace(/\D/g, '').slice(-11))) {
    return { error: 'Invalid Pakistan phone number. Use format 03XXXXXXXXX.' }
  }

  const subtotal = input.items.reduce((s, i) => s + i.price_pkr * i.quantity, 0)
  const delivery_fee_pkr = deliveryFee(input.delivery_method, subtotal)
  const total_pkr = subtotal + delivery_fee_pkr

  if (input.payment_method === 'cod' && total_pkr > COD_LIMIT_PKR) {
    return { error: `Cash on Delivery is not available for orders over Rs. ${COD_LIMIT_PKR.toLocaleString()}.` }
  }

  let status = 'pending_payment'
  if (input.payment_method === 'bank_transfer') status = 'pending_verification'
  if (input.payment_method === 'cod') status = 'cod_pending'

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      status,
      payment_method: input.payment_method,
      payment_reference: input.payment_reference ?? null,
      receipt_url: input.receipt_url ?? null,
      total_pkr,
      delivery_fee_pkr,
      delivery_method: input.delivery_method,
      shipping_address: input.shipping,
    })
    .select()
    .single()

  if (orderError || !order) {
    const msg = orderError?.message ?? 'Failed to create order.'
    if (msg.includes('permission denied') || msg.includes('JWT')) {
      return { error: getOrderError(msg), redirect: '/login?redirect=/checkout' }
    }
    return { error: getOrderError(msg) }
  }

  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    quantity: item.quantity,
    price_pkr: item.price_pkr,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) {
    return { error: getOrderError(itemsError.message) }
  }

  // TODO: Replace with JazzCash API call for jazzcash payments

  const fullOrder = {
    ...order,
    items: orderItems.map((i, idx) => ({
      id: `item-${idx}`,
      order_id: order.id,
      product_id: i.product_id,
      product_name: i.product_name,
      quantity: i.quantity,
      price_pkr: i.price_pkr,
    })),
    shipping_address: input.shipping,
  }

  if (user.email) {
    await sendOrderConfirmationEmail(user.email, fullOrder)
  }

  return { orderId: order.id as string }
}
