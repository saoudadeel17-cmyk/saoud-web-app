"use client";

import { useState } from "react";
import Link from "next/link";
import { products, categories, type Product } from "../data/products";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, color: string, qty: number) => void;
  onAddFavorite: (product: Product) => void;
}

function ProductCard({ product, onAddToCart, onAddFavorite }: ProductCardProps) {
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [cartMsg, setCartMsg] = useState("");

  function handleAddToCart() {
    onAddToCart(product, color, qty);
    setCartMsg("Added to cart ✓");
    setTimeout(() => setCartMsg(""), 2500);
  }

  return (
    <article className="card">
      <div className="imageWrap">
        <img src={product.image} alt={product.name} />
        <div className="popup">{product.detail}</div>
      </div>
      <span className="badge">{product.category}</span>
      <h3>{product.name}</h3>
      <p>{product.detail}</p>
      <strong>${product.price.toLocaleString()}</strong>

      <label>Color</label>
      <select className="input-full" value={color} onChange={(e) => setColor(e.target.value)}>
        {product.colors.map((c) => <option key={c}>{c}</option>)}
      </select>

      <label>Quantity</label>
      <input
        className="input-small"
        type="number"
        min="1"
        value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
      />

      <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
        <button className="btn-outline" onClick={() => onAddFavorite(product)}>♡ Favourite</button>
        <button className="btn" onClick={handleAddToCart}>Add to Cart</button>
      </div>
      {cartMsg && <span className="form-success">{cartMsg}</span>}
    </article>
  );
}

export default function ProductsPage() {
  const [category, setCategory] = useState("All");

  const filtered =
    category === "All" ? products : products.filter((p) => p.category === category);

  function addToCart(product: Product, color: string, qty: number) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ ...product, selectedColor: color, quantity: qty });
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function addFavorite(product: Product) {
    const fav = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (!fav.find((f: Product) => f.id === product.id)) {
      fav.push(product);
      localStorage.setItem("favorites", JSON.stringify(fav));
    }
  }

  return (
    <main>
      <nav className="nav">
        <strong className="brand">Products</strong>
        <div>
          <Link href="/">Home</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>

      <section className="section">
        <h1>Export Collection</h1>
        <div className="chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip${category === cat ? " chip--active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="grid">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
            onAddFavorite={addFavorite}
          />
        ))}
      </section>
    </main>
  );
}