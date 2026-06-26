'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency } from '@/types'

interface CurrencyStore {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: 'PKR',
      setCurrency: (currency) => set({ currency }),
    }),
    { name: 'saqr-currency' }
  )
)
