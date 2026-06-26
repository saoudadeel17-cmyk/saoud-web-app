import type { Currency } from '@/types'

export const CURRENCIES: Currency[] = ['PKR', 'USD', 'QAR']

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  PKR: 'Rs.',
  USD: '$',
  QAR: 'QR',
}

export const CURRENCY_LABELS: Record<Currency, string> = {
  PKR: 'Pakistani Rupee',
  USD: 'US Dollar',
  QAR: 'Qatari Riyal',
}

/** PKR per 1 USD — matches product catalog conversion */
export const USD_TO_PKR_RATE = Number(process.env.NEXT_PUBLIC_USD_TO_PKR_RATE ?? process.env.USD_TO_PKR_RATE ?? 278)

/** QAR per 1 USD — Qatar riyal is pegged ~3.64 */
export const USD_TO_QAR_RATE = Number(process.env.NEXT_PUBLIC_USD_TO_QAR_RATE ?? process.env.USD_TO_QAR_RATE ?? 3.64)

export function convertFromPKR(amountPkr: number, currency: Currency): number {
  if (currency === 'PKR') return amountPkr
  const usd = amountPkr / USD_TO_PKR_RATE
  if (currency === 'USD') return usd
  return usd * USD_TO_QAR_RATE
}

export function formatPrice(amountPkr: number, currency: Currency): string {
  const value = convertFromPKR(amountPkr, currency)

  switch (currency) {
    case 'PKR':
      return `Rs. ${Math.round(value).toLocaleString('en-PK')}`
    case 'USD':
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    case 'QAR':
      return `QR ${value.toLocaleString('en-QA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }
}

/** @deprecated Use formatPrice(amount, currency) */
export function formatPKR(amount: number): string {
  return formatPrice(amount, 'PKR')
}
