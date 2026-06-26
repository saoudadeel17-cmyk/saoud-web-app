import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <span className="brand">SAQR Heritage Exports</span>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <Link href="/products">Products</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/reviews">Reviews</Link>
        <a href="https://instagram.com/SAQR-47" target="_blank" rel="noopener noreferrer">Instagram: SAQR-47</a>
        <a href="https://wa.me/923704842423" target="_blank" rel="noopener noreferrer">WhatsApp: 0370 4842423</a>
      </div>
      <span>© {new Date().getFullYear()} SAQR Heritage Exports</span>
    </footer>
  )
}
