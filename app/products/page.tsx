"use client";

import { useState } from "react";
import Link from "next/link";
import { products, categories } from "../data/products";

export default function ProductsPage() {
  const [category, setCategory] = useState("All");

  const filtered =
    category === "All" ? products : products.filter((p) => p.category === category);

  function addToCart(product: any, color: string, qty: number) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ ...product, selectedColor: color, quantity: qty });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  }

  function addFavorite(product: any) {
    const fav = JSON.parse(localStorage.getItem("favorites") || "[]");
    fav.push(product);
    localStorage.setItem("favorites", JSON.stringify(fav));
    alert("Added to favourites");
  }

  return (
    <main>
      <nav className="nav">
        <strong>Products</strong>
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
            <button key={cat} onClick={() => setCategory(cat)}>{cat}</button>
          ))}
        </div>
      </section>

      <section className="grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} addFavorite={addFavorite} />
        ))}
      </section>
    </main>
  );
}

function ProductCard({ product, addToCart, addFavorite }: any) {
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);

  return (
    <article className="card">
      <div className="imageWrap">
        <img src={product.image} alt={product.name} />
        <div className="popup">{product.detail}</div>
      </div>
      <h3>{product.name}</h3>
      <p>{product.detail}</p>
      <strong>${product.price}</strong>

      <label>Color</label>
      <select value={color} onChange={(e) => setColor(e.target.value)}>
        {product.colors.map((c: string) => <option key={c}>{c}</option>)}
      </select>

      <label>Quantity</label>
      <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} />

      <button onClick={() => addFavorite(product)}>Add Favourite</button>
      <button onClick={() => addToCart(product, color, qty)}>Add To Cart</button>
    </article>
  );
}