"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { formatPKR } from "@/lib/utils";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types";

interface OrderRow {
  id: string;
  status: OrderStatus;
  total_pkr: number;
  tracking_number?: string;
  created_at: string;
  shipping_address: { full_name: string; city: string; address: string };
  order_items: Array<{ product_name: string; quantity: number; price_pkr: number }>;
}

export default function DashboardOrderPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as OrderRow[]) ?? []));
  }, [user]);

  return (
    <main>
      <Navbar />
      <section className="section">
        <h1>My Orders</h1>
        {!orders.length ? (
          <p style={{ color: "#b8a080" }}>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div className="orderBox" key={order.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p><b>{order.id.slice(0, 8).toUpperCase()}</b> — {ORDER_STATUS_LABELS[order.status]}</p>
                  <p style={{ fontSize: "13px", color: "#b8a080" }}>{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong style={{ color: "#d9a441" }}>{formatPKR(Number(order.total_pkr))}</strong>
                  <br />
                  <button className="btn-outline" style={{ marginTop: "8px" }} onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                    {expanded === order.id ? "Hide" : "View"}
                  </button>
                </div>
              </div>
              {expanded === order.id && (
                <div style={{ marginTop: "16px", borderTop: "1px solid #3b2a18", paddingTop: "16px" }}>
                  <p><b>Ship to:</b> {order.shipping_address?.full_name}, {order.shipping_address?.city}</p>
                  <p>{order.shipping_address?.address}</p>
                  {order.tracking_number && <p><b>Tracking:</b> {order.tracking_number}</p>}
                  {order.order_items?.map((item, i) => (
                    <p key={i} style={{ fontSize: "13px" }}>{item.product_name} × {item.quantity} — {formatPKR(item.price_pkr * item.quantity)}</p>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </section>
      <Footer />
    </main>
  );
}
