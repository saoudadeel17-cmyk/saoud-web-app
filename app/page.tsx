import Link from "next/link";
import { products, categories } from "./data/products";

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <strong className="brand">SAQR Heritage Exports</strong>
        <div>
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/login">Login</Link>
        </div>
      </nav>

      <section className="hero">
        <div>
          <p className="eyebrow">Persian · Arabian · Iranian · UAE · Qatar</p>
          <h1>Luxury Handmade Rugs, Mats & Traditional Crafts</h1>
          <p>
            Authentic Persian rugs, Arabian mats, and handmade cultural decor — exported worldwide from Pakistan.
          </p>
          <Link className="btn" href="/products">Explore Collection</Link>
        </div>
      </section>

      <section className="section">
        <h2>Browse by Category</h2>
        <div className="chips">
          {categories.map((cat) => (
            <span className="chip" key={cat}>{cat}</span>
          ))}
        </div>
      </section>

      <section className="grid">
        {products.map((item) => (
          <article className="card" key={item.id}>
            <div className="imageWrap">
              <img src={item.image} alt={item.name} />
              <div className="popup">{item.detail}</div>
            </div>
            <span className="badge">{item.category}</span>
            <h3>{item.name}</h3>
            <strong>${item.price.toLocaleString()}</strong>
            <Link href="/products" className="btn-outline">View Details</Link>
          </article>
        ))}
      </section>

      <footer>
        <span className="brand">SAQR Heritage Exports</span>
        <div style={{ display: "flex", gap: "24px" }}>
          <a href="https://instagram.com/SAQR-47" target="_blank" rel="noopener noreferrer">Instagram: SAQR-47</a>
          <a href="https://wa.me/923704842423" target="_blank" rel="noopener noreferrer">WhatsApp: 0370 4842423</a>
        </div>
        <span>© {new Date().getFullYear()} SAQR Heritage Exports</span>
      </footer>
    </main>
  );
}