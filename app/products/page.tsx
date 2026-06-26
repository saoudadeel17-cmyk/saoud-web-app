"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { products, categories, type Product } from "../data/products";
import { useCartStore } from "@/store/cartStore";
import Icon from "@/components/ui/Icon";
import Price from "@/components/Price";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, color: string, qty: number) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [cartMsg, setCartMsg] = useState("");

  function handleAddToCart() {
    onAddToCart(product, color, qty);
    setCartMsg("Added to cart");
    setTimeout(() => setCartMsg(""), 2500);
  }

  return (
    <article className="card product-card" data-testid="product-card">
      <div className="imageWrap">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 100vw, 270px" style={{ objectFit: "cover" }} />
        <div className="popup">{product.detail}</div>
      </div>
      <div className="card-body">
        <span className="badge">{product.category}</span>
        <h3 className="card-title">{product.name}</h3>
        <strong style={{ color: "#d9a441" }}><Price amountPkr={product.price_pkr} /></strong>

        <div className="card-options-row">
          <div className="card-option-field card-option-field--color">
            <label htmlFor={`color-${product.id}`}>Color</label>
            <select
              id={`color-${product.id}`}
              className="input-full"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              {product.colors.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="card-option-field card-option-field--qty">
            <label htmlFor={`qty-${product.id}`}>Quantity</label>
            <input
              id={`qty-${product.id}`}
              className="input-full"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            />
          </div>
        </div>

        <div className="card-actions">
          <div className="card-actions-row">
            <Link href={`/products/${product.slug}`} className="btn-outline card-action-btn">View Details</Link>
            <button className="btn card-action-btn" onClick={handleAddToCart} data-testid="add-to-cart">Add to Cart</button>
          </div>
          {cartMsg && (
            <span className="alert alert-success" style={{ marginTop: "8px", padding: "8px 12px" }}>
              <Icon name="check" size={14} /> {cartMsg}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProductsPage() {
  const [category, setCategory] = useState("All");
  const addItem = useCartStore((s) => s.addItem);

  const filtered =
    category === "All" ? products : products.filter((p) => p.category === category);

  function addToCart(product: Product, color: string, qty: number) {
    addItem({
      id: String(product.id),
      name: product.name,
      slug: product.slug,
      price_pkr: product.price_pkr,
      image: product.image,
      quantity: qty,
      selectedColor: color,
    });
  }

  return (
    <main>
      <Navbar />

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

      <section className="grid products-grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </section>
      <Footer />
    </main>
  );
}
