'use client'

import { useFormatPrice } from '@/hooks/useFormatPrice'

interface PriceProps {
  amountPkr: number
  className?: string
  style?: React.CSSProperties
}

export default function Price({ amountPkr, className, style }: PriceProps) {
  const format = useFormatPrice()
  return (
    <span className={className} style={style}>
      {format(amountPkr)}
    </span>
  )
}
