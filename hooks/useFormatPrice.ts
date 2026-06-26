'use client'

import { useCurrencyStore } from '@/store/currencyStore'
import { formatPrice } from '@/lib/currency'

export function useFormatPrice() {
  const currency = useCurrencyStore((s) => s.currency)
  return (amountPkr: number) => formatPrice(amountPkr, currency)
}
