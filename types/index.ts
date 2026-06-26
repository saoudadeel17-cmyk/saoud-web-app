export type UserRole = 'customer' | 'admin'

export type OrderStatus =
  | 'pending_payment'
  | 'pending_verification'
  | 'cod_pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentMethod = 'jazzcash' | 'bank_transfer' | 'cod' | 'stripe'
export type DeliveryMethod = 'standard' | 'express' | 'same_day'
export type Currency = 'PKR' | 'USD'

export interface Profile {
  id: string
  full_name: string
  email?: string
  avatar_url?: string
  phone?: string
  role: UserRole
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  price_pkr: number
  compare_at_price?: number
  compare_at_price_pkr?: number
  stock: number
  category: string
  tags: string[]
  images: string[]
  is_featured: boolean
  is_active: boolean
  average_rating?: number
  review_count?: number
}

export interface CartItem {
  id: string
  name: string
  price_pkr: number
  image: string
  quantity: number
  slug: string
  selectedColor?: string
}

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  payment_method: PaymentMethod
  payment_reference?: string
  receipt_url?: string
  tracking_number?: string
  total_pkr: number
  delivery_fee_pkr: number
  delivery_method: DeliveryMethod
  shipping_address: ShippingAddress
  items: OrderItem[]
  created_at: string
}

export interface ShippingAddress {
  full_name: string
  phone: string
  city: string
  address: string
  postal_code: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  price_pkr: number
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  user_name: string
  rating: number
  title?: string
  body: string
  is_verified_purchase: boolean
  created_at: string
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: 'Awaiting Payment',
  pending_verification: 'Verifying Payment',
  cod_pending: 'Cash on Delivery',
  paid: 'Payment Confirmed',
  processing: 'Processing',
  shipped: 'On the Way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment: 'yellow',
  pending_verification: 'orange',
  cod_pending: 'blue',
  paid: 'green',
  processing: 'purple',
  shipped: 'blue',
  delivered: 'green',
  cancelled: 'red',
  refunded: 'gray',
}

export const PAKISTAN_CITIES = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi',
  'Faisalabad', 'Multan', 'Peshawar', 'Quetta',
  'Sialkot', 'Gujranwala', 'Other'
]

export const COD_LIMIT_PKR = 15000

export const DELIVERY_FEES: Record<DeliveryMethod, number> = {
  standard: 250,
  express: 500,
  same_day: 800,
}

export const FREE_SHIPPING_THRESHOLD_PKR = 3000
