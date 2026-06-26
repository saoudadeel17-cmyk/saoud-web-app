import Link from 'next/link'
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand">SAQR Heritage Exports</span>
          <p className="footer-tagline">
            Handcrafted luxury rugs, mats, and traditional crafts — exported worldwide from Pakistan.
          </p>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <h4>Shop</h4>
            <Link href="/products">All Products</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/reviews">Reviews</Link>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <Link href="/">Home</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/contact">Wholesale</Link>
          </div>

          <div className="footer-col">
            <h4>Account</h4>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>

          <div className="footer-col footer-col--contact">
            <h4>Get in Touch</h4>
            <a href="https://wa.me/923704842423" target="_blank" rel="noopener noreferrer" className="footer-contact-link">
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} SAQR Heritage Exports. All rights reserved.</span>
        <span className="footer-bottom-note">Authentic handmade heritage, shipped globally.</span>
      </div>
    </footer>
  )
}
