'use client'

import { useEffect, useRef, useState } from 'react'
import { CURRENCIES, CURRENCY_LABELS } from '@/lib/currency'
import { useCurrencyStore } from '@/store/currencyStore'
import Icon from '@/components/ui/Icon'
import type { Currency } from '@/types'

export default function CurrencySwitcher({ className = '' }: { className?: string }) {
  const currency = useCurrencyStore((s) => s.currency)
  const setCurrency = useCurrencyStore((s) => s.setCurrency)
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  if (!mounted) {
    return <div className={`currency-dropdown ${className}`.trim()} aria-hidden="true" />
  }

  return (
    <div className={`currency-dropdown ${className}`.trim()} ref={rootRef}>
      <button
        type="button"
        className="currency-dropdown-trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Currency: ${CURRENCY_LABELS[currency]}`}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="currency" size={16} />
        <span>{currency}</span>
        <Icon
          name="chevron-down"
          size={14}
          className={`currency-dropdown-chevron${open ? ' currency-dropdown-chevron--open' : ''}`}
        />
      </button>

      {open && (
        <ul className="currency-dropdown-menu" role="listbox" aria-label="Select currency">
          {CURRENCIES.map((code) => (
            <li key={code} role="option" aria-selected={currency === code}>
              <button
                type="button"
                className={`currency-dropdown-option${currency === code ? ' currency-dropdown-option--active' : ''}`}
                onClick={() => {
                  setCurrency(code as Currency)
                  setOpen(false)
                }}
              >
                <span className="currency-dropdown-code">{code}</span>
                <span className="currency-dropdown-label">{CURRENCY_LABELS[code]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
