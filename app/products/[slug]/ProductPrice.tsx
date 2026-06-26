'use client'

import type { Product } from '@/app/data/products'
import Price from '@/components/Price'
import { useCurrencyStore } from '@/store/currencyStore'
import { CURRENCY_LABELS } from '@/lib/currency'

export default function ProductPrice({ product }: { product: Product }) {
  const currency = useCurrencyStore((s) => s.currency)

  return (
    <div className="product-price-block">
      <Price
        amountPkr={product.price_pkr}
        className="product-price-main"
        style={{ fontSize: '24px', color: '#d9a441', fontFamily: 'Cinzel, serif' }}
      />
      {currency !== 'PKR' && (
        <p className="product-price-alt">
          ≈ Rs. {product.price_pkr.toLocaleString('en-PK')} · {CURRENCY_LABELS[currency]}
        </p>
      )}
    </div>
  )
}
