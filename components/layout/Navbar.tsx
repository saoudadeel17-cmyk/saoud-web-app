'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { useCartStore } from '@/store/cartStore'
import CurrencySwitcher from '@/components/layout/CurrencySwitcher'
import Icon from '@/components/ui/Icon'
import type { Profile } from '@/types'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
] as const

function getFirstName(user: Profile) {
  const name = user.full_name?.trim()
  if (name) return name.split(/\s+/)[0]
  if (user.email) return user.email.split('@')[0]
  return 'Account'
}

function getFullName(user: Profile) {
  const name = user.full_name?.trim()
  if (name) return name
  if (user.email) return user.email.split('@')[0]
  return 'Account'
}

function getInitials(user: Profile) {
  const name = user.full_name?.trim()
  if (name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }
  if (user.email) return user.email[0].toUpperCase()
  return 'U'
}

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useUser()
  const itemCount = useCartStore((s) => s.itemCount())
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!userMenuOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setUserMenuOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [userMenuOpen])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setMenuOpen(false)
    setUserMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  function closeMenus() {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }

  return (
    <header className="site-header">
      <nav className="nav" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <Link href="/" className="brand" onClick={closeMenus}>
            SAQR Heritage
          </Link>

          <div
            id="nav-menu"
            className={`nav-menu ${menuOpen ? 'nav-menu--open' : ''}`}
          >
            <div className="nav-end">
              {navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={isActive(href) ? 'nav-link nav-link--active' : 'nav-link'}
                  onClick={closeMenus}
                >
                  {label}
                </Link>
              ))}

              <CurrencySwitcher className="nav-currency" />

              <Link
                href="/cart"
                className="nav-link nav-cart-link"
                onClick={closeMenus}
                aria-label={mounted && itemCount > 0 ? `Cart, ${itemCount} items` : 'Cart'}
              >
                <span className="nav-cart-icon-wrap">
                  <Icon name="cart" size={16} />
                  {mounted && itemCount > 0 && (
                    <span className="nav-cart-badge" data-testid="cart-count">
                      {itemCount}
                    </span>
                  )}
                </span>
                <span>Cart</span>
              </Link>

              <div className="nav-account">
                {loading ? (
                  <div className="nav-skeleton" aria-hidden="true" />
                ) : user ? (
                  <div className="nav-user-menu" ref={userMenuRef}>
                    <button
                      type="button"
                      className="nav-user-trigger"
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                      aria-label={`Account menu for ${getFirstName(user)}`}
                      onClick={() => setUserMenuOpen((open) => !open)}
                    >
                      <span className="nav-user-avatar" aria-hidden="true">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="nav-user-avatar-img" />
                        ) : (
                          getInitials(user)
                        )}
                      </span>
                      <span className="nav-user-label">{getFirstName(user)}</span>
                      <Icon
                        name="chevron-down"
                        size={16}
                        className={`nav-user-chevron ${userMenuOpen ? 'nav-user-chevron--open' : ''}`}
                      />
                    </button>

                    <div className={`nav-user-dropdown ${userMenuOpen ? 'nav-user-dropdown--open' : ''}`}>
                      <div className="nav-user-dropdown-header">
                        <span className="nav-user-avatar nav-user-avatar--lg" aria-hidden="true">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt="" className="nav-user-avatar-img" />
                          ) : (
                            getInitials(user)
                          )}
                        </span>
                        <div>
                          <p className="nav-user-dropdown-name">{getFullName(user)}</p>
                          {user.email && (
                            <p className="nav-user-dropdown-email">{user.email}</p>
                          )}
                          {user.role === 'admin' && (
                            <span className="badge badge-gold nav-user-role">Admin</span>
                          )}
                        </div>
                      </div>

                      <div className="nav-user-dropdown-links">
                        <Link href="/dashboard/profile" className="nav-user-dropdown-link" onClick={closeMenus}>
                          <Icon name="user" size={16} />
                          My Profile
                        </Link>
                        <Link href="/dashboard/order" className="nav-user-dropdown-link" onClick={closeMenus}>
                          <Icon name="package" size={16} />
                          My Orders
                        </Link>
                        <Link href="/dashboard/settings" className="nav-user-dropdown-link" onClick={closeMenus}>
                          <Icon name="settings" size={16} />
                          Settings
                        </Link>
                      </div>

                      <div className="nav-user-dropdown-divider" role="separator" />

                      <button type="button" className="nav-user-dropdown-logout" onClick={handleLogout}>
                        <Icon name="logout" size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link href="/login" className="btn nav-login-btn" onClick={closeMenus}>
                    <Icon name="user" size={16} />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="nav-mobile-actions">
            <Link
              href="/cart"
              className="nav-icon-btn"
              aria-label={mounted && itemCount > 0 ? `Cart, ${itemCount} items` : 'Cart'}
            >
              <Icon name="cart" size={20} />
              {mounted && itemCount > 0 && (
                <span className="nav-cart-badge">{itemCount}</span>
              )}
            </Link>

            <button
              type="button"
              className="nav-toggle"
              aria-expanded={menuOpen}
              aria-controls="nav-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <button
            type="button"
            className="nav-backdrop"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </nav>
    </header>
  )
}
