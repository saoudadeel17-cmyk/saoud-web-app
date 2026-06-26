"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/app/data/products";
import { useCartStore } from "@/store/cartStore";

export default function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");

  function handleAdd() {
    addItem({
      id: String(product.id),
      name: product.name,
      slug: product.slug,
      price_pkr: product.price_pkr,
      image: product.image,
      quantity: qty,
      selectedColor: color,
    });
    setMsg("Added to cart ✓");
    setTimeout(() => setMsg(""), 2500);
  }

  function handleBuyNow() {
    handleAdd();
    router.push("/checkout");
  }

  return (
    <div>
      <label>Color</label>
      <select className="input-full" value={color} onChange={(e) => setColor(e.target.value)}>
        {product.colors.map((c) => <option key={c}>{c}</option>)}
      </select>
      <label>Quantity</label>
      <input
        className="input-small"
        type="number"
        min={1}
        max={product.stock}
        value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
      />
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <button className="btn" onClick={handleAdd} disabled={product.stock <= 0}>Add to Cart</button>
        <button className="btn-outline" onClick={handleBuyNow} disabled={product.stock <= 0}>Buy Now</button>
      </div>
      {msg && <p className="form-success" style={{ marginTop: "10px" }}>{msg}</p>}
    </div>
  );
}
