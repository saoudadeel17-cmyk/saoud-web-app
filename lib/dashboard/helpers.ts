import type { OrderStatus, PaymentMethod } from '@/types'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/types'

export function getInitials(name: string, email?: string): string {
  const trimmed = name?.trim()
  if (trimmed) {
    return trimmed
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase()
  }
  if (email) return email[0].toUpperCase()
  return 'U'
}

export function formatMemberSince(date: string): string {
  return new Date(date).toLocaleDateString('en-PK', {
    month: 'long',
    year: 'numeric',
  })
}

export function formatOrderDate(date: string): string {
  return new Date(date).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function shortOrderId(id: string): string {
  return `${id.slice(0, 8).toUpperCase()}…`
}

export function statusBadgeClass(status: OrderStatus): string {
  const color = ORDER_STATUS_COLORS[status] ?? 'gray'
  const map: Record<string, string> = {
    yellow: 'badge-yellow',
    orange: 'badge-yellow',
    blue: 'badge-gold',
    green: 'badge-green',
    purple: 'badge-gold',
    red: 'badge-red',
    gray: 'badge-gold',
  }
  return `badge ${map[color] ?? 'badge-gold'}`
}

export function statusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] ?? status
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  jazzcash: 'JazzCash',
  bank_transfer: 'Bank Transfer',
  cod: 'Cash on Delivery',
  stripe: 'Card (Stripe)',
}

export const DELIVERY_LABELS: Record<string, string> = {
  standard: 'Standard Delivery',
  express: 'Express Delivery',
  same_day: 'Same Day Delivery',
}

export function deliveryLabel(method: string): string {
  return DELIVERY_LABELS[method] ?? method.replace(/_/g, ' ')
}

export type OrderFilter = 'all' | 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export function matchesOrderFilter(status: OrderStatus, filter: OrderFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'pending') {
    return ['pending_payment', 'pending_verification', 'cod_pending'].includes(status)
  }
  if (filter === 'paid') return status === 'paid' || status === 'processing'
  if (filter === 'shipped') return status === 'shipped'
  if (filter === 'delivered') return status === 'delivered'
  if (filter === 'cancelled') return status === 'cancelled' || status === 'refunded'
  return true
}

export const TIMELINE_STEPS = [
  'Order Placed',
  'Payment Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
] as const

export function timelineStepIndex(status: OrderStatus): number {
  switch (status) {
    case 'pending_payment':
    case 'pending_verification':
    case 'cod_pending':
      return 0
    case 'paid':
      return 1
    case 'processing':
      return 2
    case 'shipped':
      return 3
    case 'delivered':
      return 4
    case 'cancelled':
    case 'refunded':
      return 0
    default:
      return 0
  }
}

export function productNamesSummary(
  items: Array<{ product_name: string }>,
  max = 2
): string {
  if (!items?.length) return '—'
  const names = items.map((i) => i.product_name)
  if (names.length <= max) return names.join(', ')
  return `${names.slice(0, max).join(', ')} +${names.length - max} more`
}
