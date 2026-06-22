"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    setOrder(JSON.parse(localStorage.getItem("order") || "null"));
  }, []);

  return (
    <main>
      <nav className="nav">
        <strong className="brand">My Order</strong>
        <div><Link href="/">Home</Link><Link href="/products">Shop</Link></div>
      </nav>

      <section className="section">
        <h1>Order Tracking</h1>

        {!order ? (
          <div className="emptyState">
            <h2>No order found</h2>
            <p style={{ marginBottom: "20px" }}>You haven't placed an order yet.</p>
            <Link href="/products" className="btn">Browse Products</Link>
          </div>
        ) : (
          <>
            <div className="statusBar">
              <div className="statusStep done">Order Placed</div>
              <div className="statusStep done">Processing</div>
              <div className="statusStep">Shipped</div>
              <div className="statusStep">Delivered</div>
            </div>

            <div className="orderBox">
              <p><b>Order ID:</b> {order.id}</p>
              <p><b>Status:</b> {order.status}</p>
              <p><b>Tracking:</b> {order.tracking}</p>
              <p><b>Delivery:</b> {order.delivery}</p>
              {order.paymentMethod && <p><b>Payment:</b> {order.paymentMethod}</p>}
            </div>

            {order.items && order.items.length > 0 && (
              <>
                <h2 style={{ margin: "24px 0 16px" }}>Items Ordered</h2>
                {order.items.map((item: any, i: number) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 0", borderBottom: "1px solid #3b2a18", fontSize: "14px"
                  }}>
                    <span>{item.name} <span style={{ color: "#b8a080" }}>× {item.quantity}</span></span>
                    <strong style={{ color: "#d9a441" }}>${(item.price * item.quantity).toLocaleString()}</strong>
                  </div>
                ))}
                {order.total && (
                  <div style={{ textAlign: "right", padding: "16px 0", fontSize: "18px", fontWeight: 600, color: "#d9a441" }}>
                    Total: ${order.total.toLocaleString()}
                  </div>
                )}
              </>
            )}

            <p style={{ fontSize: "13px", color: "#b8a080", marginTop: "16px" }}>
              For inquiries: <a href="https://wa.me/923704842423" style={{ color: "#d9a441" }}>WhatsApp 0370 4842423</a>
            </p>
          </>
        )}
      </section>
    </main>
  );
}