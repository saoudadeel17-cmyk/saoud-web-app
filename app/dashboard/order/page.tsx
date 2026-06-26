'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/hooks/useUser'
import Icon from '@/components/ui/Icon'
import Price from '@/components/Price'
import OrderTimeline from '@/components/dashboard/OrderTimeline'
import {
  formatOrderDate,
  deliveryLabel,
  matchesOrderFilter,
  PAYMENT_LABELS,
  productNamesSummary,
  shortOrderId,
  statusBadgeClass,
  statusLabel,
  type OrderFilter,
} from '@/lib/dashboard/helpers'
import type { DeliveryMethod, OrderStatus, PaymentMethod } from '@/types'

interface OrderRow {
  id: string
  status: OrderStatus
  total_pkr: number
  delivery_fee_pkr: number
  delivery_method: DeliveryMethod
  payment_method: PaymentMethod
  tracking_number?: string
  created_at: string
  shipping_address: {
    full_name: string
    phone: string
    city: string
    address: string
    postal_code?: string
  }
  order_items: Array<{ product_name: string; quantity: number; price_pkr: number }>
}

const FILTERS: { key: OrderFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'paid', label: 'Paid' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
]

const PAYMENT_ICONS: Record<PaymentMethod, 'jazzcash' | 'bank' | 'cod' | 'card'> = {
  jazzcash: 'jazzcash',
  bank_transfer: 'bank',
  cod: 'cod',
  stripe: 'card',
}

export default function DashboardOrderPage() {
  const { user, loading: userLoading } = useUser()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<OrderFilter>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      if (!userLoading) setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    fetch('/api/orders')
      .then(async (res) => {
        const body = await res.json()
        if (!res.ok) {
          setError(body.error ?? 'Failed to load orders')
          setOrders([])
          return
        }
        setOrders((body.orders as OrderRow[]) ?? [])
      })
      .catch(() => {
        setError('Failed to load orders')
        setOrders([])
      })
      .finally(() => setLoading(false))
  }, [user, userLoading])

  const filtered = orders.filter((o) => matchesOrderFilter(o.status, filter))

  if (userLoading || loading) {
    return (
      <div className="dashboard-content">
        <div className="skeleton" style={{ height: 36, width: 200, marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 40, width: '100%', marginBottom: 24 }} />
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 120, marginBottom: 16, borderRadius: 12 }} />
        ))}
      </div>
    )
  }

  return (
    <div className="dashboard-content">
      <header className="dashboard-page-header dashboard-page-header--row">
        <div>
          <h1>My Orders</h1>
          <p className="dashboard-page-subtitle">Track and manage your purchases</p>
        </div>
        <span className="badge badge-gold dashboard-order-count">
          {filter === 'all'
            ? `${orders.length} order${orders.length === 1 ? '' : 's'}`
            : `${filtered.length} of ${orders.length}`}
        </span>
      </header>

      {error && (
        <div className="alert alert-error" role="alert">
          <Icon name="alert" size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="dashboard-filter-tabs" role="tablist">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            className={`dashboard-filter-tab${filter === key ? ' active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {!filtered.length ? (
        <div className="dashboard-empty">
          <Icon name="package" size={40} />
          <h3>{orders.length ? 'No orders in this filter' : 'No orders yet'}</h3>
          <p>
            {orders.length
              ? 'Try another filter to see your orders.'
              : 'Your order history will appear here.'}
          </p>
          <Link href="/products" className="btn">Browse Products</Link>
        </div>
      ) : (
        <div className="dashboard-orders-list">
          {filtered.map((order) => {
            const isOpen = expanded === order.id
            const items = order.order_items ?? []
            return (
              <article key={order.id} className="order-card">
                <div className="order-card-top">
                  <div className="order-card-main">
                    <div className="order-card-head">
                      <span className="dashboard-table-mono">#{shortOrderId(order.id)}</span>
                      <span className="order-card-date">{formatOrderDate(order.created_at)}</span>
                      <span className={statusBadgeClass(order.status)}>
                        {statusLabel(order.status)}
                      </span>
                    </div>
                    <p className="order-card-products">{productNamesSummary(items)}</p>
                    <div className="order-card-meta">
                      <span>
                        <Icon name={PAYMENT_ICONS[order.payment_method]} size={14} />
                        {PAYMENT_LABELS[order.payment_method]}
                      </span>
                      <span>
                        <Icon name="truck" size={14} />
                        {deliveryLabel(order.delivery_method)}
                      </span>
                      <span className="order-card-total">
                        <Price amountPkr={Number(order.total_pkr)} />
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-outline order-card-toggle"
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    aria-expanded={isOpen}
                  >
                    View Details
                    <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={14} />
                  </button>
                </div>

                {isOpen && (
                  <div className="order-card-detail">
                    <h4 className="order-detail-title">Items</h4>
                    <ul className="order-detail-items">
                      {items.map((item, i) => (
                        <li key={i}>
                          <span>{item.product_name} × {item.quantity}</span>
                          <Price amountPkr={item.price_pkr * item.quantity} />
                        </li>
                      ))}
                    </ul>

                    <h4 className="order-detail-title">Shipping Address</h4>
                    <p className="order-detail-text">
                      {order.shipping_address?.full_name}<br />
                      {order.shipping_address?.address}<br />
                      {order.shipping_address?.city}
                      {order.shipping_address?.postal_code
                        ? `, ${order.shipping_address.postal_code}`
                        : ''}
                      <br />
                      {order.shipping_address?.phone}
                    </p>

                    <h4 className="order-detail-title">Payment</h4>
                    <p className="order-detail-text">{PAYMENT_LABELS[order.payment_method]}</p>

                    {order.status === 'shipped' && order.tracking_number && (
                      <p className="order-detail-tracking">
                        <Icon name="truck" size={16} />
                        Tracking: <strong>{order.tracking_number}</strong>
                      </p>
                    )}

                    <OrderTimeline status={order.status} />
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
