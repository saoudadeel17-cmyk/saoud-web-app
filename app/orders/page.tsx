"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    setOrder(JSON.parse(localStorage.getItem("order") || "null"));
  }, []);

  return (
    <main>
      <section className="section">
        <h1>Order Information</h1>
        {!order ? <p>No order found.</p> : (
          <div className="orderBox">
            <p><b>Order ID:</b> {order.id}</p>
            <p><b>Status:</b> {order.status}</p>
            <p><b>Tracking:</b> {order.tracking}</p>
            <p><b>Delivery:</b> {order.delivery}</p>
          </div>
        )}
      </section>
    </main>
  );
}