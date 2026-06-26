"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { formatPKR } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const total = useCartStore((s) => s.total());

  return (
    <main>
      <Navbar />

      <section className="section">
        <h1>Your Cart</h1>

        {items.length === 0 ? (
          <div className="emptyState">
            <h2>Your cart is empty</h2>
            <p style={{ marginBottom: "20px" }}>Discover our handmade collection and add something beautiful.</p>
            <Link href="/products" className="btn">Browse Products</Link>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <div className="cartItem" key={item.id} data-testid="cart-item">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={120}
                  height={90}
                  style={{ objectFit: "cover", borderRadius: "6px" }}
                />
                <div className="cartItem-info">
                  <h3>{item.name}</h3>
                  {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                  <p>
                    Quantity:{" "}
                    <input
                      className="input-small"
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Math.max(1, Number(e.target.value)))}
                    />
                  </p>
                  <strong style={{ color: "#d9a441" }}>{formatPKR(item.price_pkr * item.quantity)}</strong>
                </div>
                <button className="btn-danger" onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            ))}

            <div className="orderTotal">Total: {formatPKR(total)}</div>

            <button className="btn" style={{ marginTop: "20px" }} onClick={() => router.push("/checkout")}>
              Proceed to Checkout
            </button>
          </>
        )}
      </section>
      <Footer />
    </main>
  );
}
