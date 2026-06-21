"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [payment, setPayment] = useState({ name: "", email: "", method: "PayPal" });

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  function checkout() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.email || user.email !== payment.email || user.name !== payment.name) {
      alert("Sorry your payment informatiom was not correct please enter correct information to proceed your order .Thank you");
      return;
    }

    const order = {
      id: Date.now(),
      items: cart,
      status: "Order started from Pakistan export warehouse",
      tracking: "Processing customs and international shipment",
      delivery: "Estimated delivery: 10 to 18 business days",
    };

    localStorage.setItem("order", JSON.stringify(order));
    localStorage.removeItem("cart");
    alert("Thank you for your order");
    setCart([]);
  }

  return (
    <main>
      <nav className="nav">
        <strong>Cart</strong>
        <Link href="/orders">Order Info</Link>
      </nav>

      <section className="section">
        <h1>Your Cart</h1>
        {cart.map((item, index) => (
          <div className="cartItem" key={index}>
            <img src={item.image} alt={item.name} />
            <div>
              <h3>{item.name}</h3>
              <p>Color: {item.selectedColor}</p>
              <p>Quantity: {item.quantity}</p>
              <strong>${item.price * item.quantity}</strong>
            </div>
          </div>
        ))}

        <h2>Payment</h2>
        <input placeholder="Full name same as login" onChange={(e) => setPayment({ ...payment, name: e.target.value })} />
        <input placeholder="Email same as login" onChange={(e) => setPayment({ ...payment, email: e.target.value })} />
        <select onChange={(e) => setPayment({ ...payment, method: e.target.value })}>
          <option>PayPal</option>
          <option>Apple Pay</option>
          <option>Jazz Cash</option>
          <option>Bank Transfer</option>
        </select>
        <button onClick={checkout}>Place Order</button>
      </section>
    </main>
  );
}