import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function toPricePKR(usd: number, rate = 278): number {
  return Math.round((usd * rate) / 50) * 50
}

export const PAKISTAN_PHONE_REGEX = /^03[0-9]{9}$/

/** @deprecated Use formatPrice from @/lib/currency */
export { formatPKR } from '@/lib/currency'
