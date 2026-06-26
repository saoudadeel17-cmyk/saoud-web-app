'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import Icon from '@/components/ui/Icon'
import type { IconName } from '@/components/ui/Icon'
import { formatMemberSince, getInitials } from '@/lib/dashboard/helpers'

const navLinks: { href: string; label: string; icon: IconName; exact?: boolean }[] = [
  { href: '/dashboard', label: 'Overview', icon: 'dashboard', exact: true },
  { href: '/dashboard/order', label: 'My Orders', icon: 'package' },
  { href: '/dashboard/profile', label: 'My Profile', icon: 'user' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'settings' },
]

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href
  return pathname.startsWith(href)
}

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user, loading } = useUser()

  if (loading) {
    return (
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-user">
          <div className="skeleton dashboard-avatar-skeleton" />
          <div className="skeleton" style={{ height: 16, width: '80%', marginTop: 12 }} />
          <div className="skeleton" style={{ height: 12, width: '60%', marginTop: 8 }} />
        </div>
        <nav className="dashboard-nav">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 40, marginBottom: 4, borderRadius: 8 }} />
          ))}
        </nav>
      </aside>
    )
  }

  const displayName = user?.full_name?.trim() || user?.email?.split('@')[0] || 'Customer'
  const email = user?.email ?? ''
  const roleLabel = user?.role === 'admin' ? 'Admin' : 'Customer'
  const memberSince = user?.created_at ? formatMemberSince(user.created_at) : null

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar-user">
        <div className="dashboard-avatar" aria-hidden="true">
          {getInitials(user?.full_name ?? '', email)}
        </div>
        <p className="dashboard-sidebar-name">{displayName}</p>
        {email && <p className="dashboard-sidebar-email">{email}</p>}
        {memberSince && (
          <p className="dashboard-sidebar-meta">Member since {memberSince}</p>
        )}
        <span className="badge badge-gold dashboard-role-badge">{roleLabel}</span>
      </div>

      <nav className="dashboard-nav" aria-label="Dashboard">
        {navLinks.map(({ href, label, icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`dashboard-nav-link${isActive(pathname, href, exact) ? ' active' : ''}`}
          >
            <Icon name={icon} size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
