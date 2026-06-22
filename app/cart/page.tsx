"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [payment, setPayment] = useState({ name: "", email: "", method: "PayPal" });
  const [ordered, setOrdered] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  function removeItem(index: number) {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function checkout() {
    setError("");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!payment.name || !payment.email) {
      setError("Please fill in your name and email to continue.");
      return;
    }

    if (!user.email || user.email !== payment.email || user.name !== payment.name) {
      setError("Your name and email must match your account. Please check and try again.");
      return;
    }

    const order = {
      id: Date.now(),
      items: cart,
      total,
      paymentMethod: payment.method,
      status: "Order started from Pakistan export warehouse",
      tracking: "Processing customs and international shipment",
      delivery: "Estimated delivery: 10–18 business days",
    };

    localStorage.setItem("order", JSON.stringify(order));
    localStorage.removeItem("cart");
    setCart([]);
    setOrdered(true);
  }

  if (ordered) {
    return (
      <main>
        <nav className="nav">
          <strong className="brand">SAQR Heritage Exports</strong>
          <div><Link href="/">Home</Link></div>
        </nav>
        <section className="section">
          <div className="successBox">
            <h2 style={{ marginBottom: "10px" }}>Order placed successfully!</h2>
            <p>Thank you for your order. Your items are being prepared for international shipment from Pakistan.</p>
            <p style={{ marginTop: "10px" }}>Estimated delivery: <strong>10–18 business days</strong></p>
          </div>
          <div style={{ marginTop: "20px", display: "flex", gap: "14px" }}>
            <Link href="/orders" className="btn">Track My Order</Link>
            <Link href="/products" className="btn-outline">Continue Shopping</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <nav className="nav">
        <strong className="brand">Your Cart</strong>
        <div>
          <Link href="/products">Continue Shopping</Link>
          <Link href="/orders">Orders</Link>
        </div>
      </nav>

      <section className="section">
        <h1>Your Cart</h1>

        {cart.length === 0 ? (
          <div className="emptyState">
            <h2>Your cart is empty</h2>
            <p style={{ marginBottom: "20px" }}>Discover our handmade collection and add something beautiful.</p>
            <Link href="/products" className="btn">Browse Products</Link>
          </div>
        ) : (
          <>
            {cart.map((item, index) => (
              <div className="cartItem" key={index}>
                <img src={item.image} alt={item.name} />
                <div className="cartItem-info">
                  <h3>{item.name}</h3>
                  <p>Color: {item.selectedColor}</p>
                  <p>Quantity: {item.quantity}</p>
                  <strong style={{ color: "#d9a441" }}>${(item.price * item.quantity).toLocaleString()}</strong>
                </div>
                <button className="btn-danger" onClick={() => removeItem(index)}>Remove</button>
              </div>
            ))}

            <div className="orderTotal">
              Total: ${total.toLocaleString()}
            </div>

            <h2 style={{ marginBottom: "16px" }}>Payment Details</h2>
            <label>Full name (same as login)</label>
            <input
              className="input-full"
              placeholder="Your full name"
              onChange={(e) => setPayment({ ...payment, name: e.target.value })}
            />
            <label>Email (same as login)</label>
            <input
              className="input-full"
              type="email"
              placeholder="Your email address"
              onChange={(e) => setPayment({ ...payment, email: e.target.value })}
            />
            <label>Payment method</label>
            <select className="input-full" onChange={(e) => setPayment({ ...payment, method: e.target.value })}>
              <option>PayPal</option>
              <option>Apple Pay</option>
              <option>Jazz Cash</option>
              <option>Bank Transfer</option>
            </select>

            {error && <p className="form-error">{error}</p>}

            <button className="btn" style={{ marginTop: "20px" }} onClick={checkout}>
              Place Order
            </button>

            <p style={{ fontSize: "12px", color: "#b8a080", marginTop: "14px" }}>
              ⚠ This is a demo. Real payments require a secure backend and official payment APIs.
            </p>
          </>
        )}
      </section>
    </main>
  );
}