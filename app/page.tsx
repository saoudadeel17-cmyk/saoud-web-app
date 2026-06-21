import Link from "next/link";
import { products, categories } from "./data/products";

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <strong>SAQR Heritage Exports</strong>
        <div>
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/login">Login</Link>
        </div>
      </nav>

      <section className="hero">
        <div>
          <p className="eyebrow">Persian | Arabian | Iranian | Qatar | UAE</p>
          <h1>Luxury Handmade Rugs, Mats & Traditional Crafts For Global Export</h1>
          <p>
            Exporting authentic Persian rugs, Arabian mats, handmade decor, and
            traditional cultural products to international markets.
          </p>
          <Link className="button" href="/products">Explore Collection</Link>
        </div>
      </section>

      <section className="section">
        <h2>Categories</h2>
        <div className="chips">
          {categories.map((cat) => <span key={cat}>{cat}</span>)}
        </div>
      </section>

      <section className="grid">
        {products.map((item) => (
          <article className="card" key={item.id}>
            <div className="imageWrap">
              <img src={item.image} alt={item.name} />
              <div className="popup">{item.detail}</div>
            </div>
            <h3>{item.name}</h3>
            <p>{item.category}</p>
            <strong>${item.price}</strong>
            <Link href="/products" className="smallBtn">View Details</Link>
          </article>
        ))}
      </section>

      <footer>
        Instagram: SAQR-47 | WhatsApp: 03704842423
      </footer>
    </main>
  );
}