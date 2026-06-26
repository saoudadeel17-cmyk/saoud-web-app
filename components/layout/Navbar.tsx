'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { useCartStore } from '@/store/cartStore'
import Icon from '@/components/ui/Icon'

export default function Navbar() {
  const router = useRouter()
  const { user, loading } = useUser()
  const itemCount = useCartStore((s) => s.itemCount())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="nav" role="navigation">
      <Link href="/" className="brand">SAQR Heritage</Link>
      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/reviews">Reviews</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/cart" className="nav-cart-link">
          <Icon name="cart" size={16} />
          Cart
          {mounted && itemCount > 0 && (
            <span className="badge badge-gold" data-testid="cart-count">{itemCount}</span>
          )}
        </Link>
        {loading ? (
          <div className="nav-skeleton" aria-label="Loading account" />
        ) : user ? (
          <div className="nav-user">
            <span className="nav-user-name">{user.full_name?.split(' ')[0] ?? 'Account'}</span>
            <Link href="/dashboard">Dashboard</Link>
            {user.role === 'admin' && <Link href="/admin">Admin</Link>}
            <button type="button" className="btn-outline btn-sm" onClick={handleLogout}>
              <Icon name="logout" size={14} />
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="btn nav-cta">Login</Link>
        )}
      </div>
    </nav>
  )
}
