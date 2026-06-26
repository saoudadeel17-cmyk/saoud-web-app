import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { fetchUserOrders, type UserOrderRow } from '@/lib/orders/fetchUserOrders'
import Icon from '@/components/ui/Icon'
import Price from '@/components/Price'
import {
  formatMemberSince,
  formatOrderDate,
  shortOrderId,
  statusBadgeClass,
  statusLabel,
} from '@/lib/dashboard/helpers'
import { formatPKR } from '@/lib/currency'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser!.id)
    .single()

  let admin
  try {
    admin = createAdminClient()
  } catch {
    admin = undefined
  }

  const { orders: orderList } = await fetchUserOrders(authUser!.id, supabase, admin)

  const recentOrders: UserOrderRow[] = orderList.slice(0, 5)

  const totalOrders = orderList.length
  const totalSpent = orderList.reduce((sum, o) => sum + Number(o.total_pkr), 0)
  const memberSinceSource = profile?.created_at ?? authUser?.created_at
  const memberSince = memberSinceSource ? formatMemberSince(memberSinceSource) : '—'

  const meta = authUser?.user_metadata as Record<string, unknown> | undefined
  const firstName =
    profile?.full_name?.trim().split(/\s+/)[0] ||
    (typeof meta?.full_name === 'string' ? meta.full_name.split(/\s+/)[0] : null) ||
    authUser?.email?.split('@')[0] ||
    'there'

  return (
    <div className="dashboard-content">
      <header className="dashboard-page-header">
        <h1>Overview</h1>
        <p className="dashboard-page-subtitle">Welcome back, {firstName}</p>
      </header>

      <div className="dashboard-stats-row">
        <div className="stat-card">
          <Icon name="package" size={22} className="stat-card-icon" />
          <span className="stat-card-value">{totalOrders}</span>
          <span className="stat-card-label">Total Orders</span>
        </div>
        <div className="stat-card">
          <Icon name="receipt" size={22} className="stat-card-icon" />
          <span className="stat-card-value">{formatPKR(totalSpent)}</span>
          <span className="stat-card-label">Total Spent</span>
        </div>
        <div className="stat-card">
          <Icon name="calendar" size={22} className="stat-card-icon" />
          <span className="stat-card-value stat-card-value--sm">{memberSince}</span>
          <span className="stat-card-label">Member Since</span>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Recent Orders</h2>
        </div>

        {!recentOrders.length ? (
          <div className="dashboard-empty">
            <Icon name="package" size={40} />
            <h3>No orders yet</h3>
            <p>Start exploring our handcrafted collection.</p>
            <Link href="/products" className="btn">Browse Products</Link>
          </div>
        ) : (
          <>
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const items = order.order_items ?? []
                    const itemCount = items?.reduce((s, i) => s + i.quantity, 0) ?? 0
                    const status = order.status
                    return (
                      <tr key={order.id}>
                        <td className="dashboard-table-mono">{shortOrderId(order.id)}</td>
                        <td>{formatOrderDate(order.created_at)}</td>
                        <td>{itemCount}</td>
                        <td><Price amountPkr={Number(order.total_pkr)} /></td>
                        <td>
                          <span className={statusBadgeClass(status)}>
                            {statusLabel(status)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Link href="/dashboard/order" className="dashboard-view-all">
              View All Orders
              <Icon name="arrow-right" size={16} />
            </Link>
          </>
        )}
      </section>
    </div>
  )
}
