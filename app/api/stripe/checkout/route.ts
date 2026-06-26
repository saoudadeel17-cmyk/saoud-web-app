import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return new Stripe(key)
}

export async function POST(request: Request) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { items, orderId } = await request.json()
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: user.email,
    line_items: items.map((item: { name: string; price_pkr: number; quantity: number }) => ({
      price_data: {
        currency: 'pkr',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price_pkr * 100),
      },
      quantity: item.quantity,
    })),
    metadata: { orderId: orderId ?? '' },
    success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout`,
  })

  return NextResponse.json({ url: session.url })
}
