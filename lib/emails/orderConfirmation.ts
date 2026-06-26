import { getResend } from '@/lib/resend'
import type { Order, PaymentMethod } from '@/types'
import { formatPKR } from '@/lib/utils'

function paymentMessage(method: PaymentMethod): string {
  switch (method) {
    case 'jazzcash':
      return 'Please complete payment on your JazzCash app. We will confirm your order once payment is received.'
    case 'bank_transfer':
      return 'We have received your receipt. Our team will verify payment within 2-4 hours.'
    case 'cod':
      return 'Your order is confirmed! Pay when delivered.'
    case 'stripe':
      return 'Payment successful! Your order is confirmed.'
    default:
      return 'Thank you for your order.'
  }
}

export async function sendOrderConfirmationEmail(
  to: string,
  order: Order
) {
  if (!process.env.RESEND_API_KEY) return

  const resend = getResend()
  if (!resend) return

  const itemsList = order.items
    .map((i) => `${i.product_name} × ${i.quantity} — ${formatPKR(i.price_pkr * i.quantity)}`)
    .join('\n')

  await resend.emails.send({
    from: 'SAQR Heritage <orders@saqrheritage.com>',
    to,
    subject: `Order Confirmation — ${order.id.slice(0, 8).toUpperCase()}`,
    text: [
      `Order ID: ${order.id}`,
      '',
      'Items:',
      itemsList,
      '',
      `Total: ${formatPKR(order.total_pkr)}`,
      `Delivery: ${order.delivery_method}`,
      '',
      `Shipping to: ${order.shipping_address.full_name}`,
      `${order.shipping_address.address}, ${order.shipping_address.city}`,
      '',
      paymentMessage(order.payment_method),
    ].join('\n'),
  })
}

export async function sendPaymentConfirmedEmail(to: string, orderId: string) {
  if (!process.env.RESEND_API_KEY) return

  const resend = getResend()
  if (!resend) return

  await resend.emails.send({
    from: 'SAQR Heritage <orders@saqrheritage.com>',
    to,
    subject: 'Payment Confirmed',
    text: `Your payment for order ${orderId} has been confirmed. We are now processing your order.`,
  })
}

export async function sendShippedEmail(to: string, orderId: string, tracking: string) {
  if (!process.env.RESEND_API_KEY) return

  const resend = getResend()
  if (!resend) return

  await resend.emails.send({
    from: 'SAQR Heritage <orders@saqrheritage.com>',
    to,
    subject: 'Your Order is On the Way',
    text: `Order ${orderId} has been shipped. Tracking: ${tracking}`,
  })
}
