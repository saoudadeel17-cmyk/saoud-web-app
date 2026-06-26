"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";
import { formatPKR } from "@/lib/utils";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types";

interface AdminOrder {
  id: string;
  status: OrderStatus;
  payment_method: string;
  payment_reference?: string;
  receipt_url?: string;
  total_pkr: number;
  created_at: string;
  tracking_number?: string;
  profiles?: { full_name: string };
}

export default function AdminOrderPage() {
  const [tab, setTab] = useState<"jazzcash" | "bank" | "all">("jazzcash");
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  async function loadOrders() {
    const supabase = createClient();
    let query = supabase.from("orders").select("*, profiles(full_name)").order("created_at", { ascending: false });

    if (tab === "jazzcash") query = query.eq("status", "pending_payment").eq("payment_method", "jazzcash");
    if (tab === "bank") query = query.eq("status", "pending_verification");

    const { data } = await query;
    setOrders((data as AdminOrder[]) ?? []);
  }

  useEffect(() => { loadOrders(); }, [tab]);

  async function updateStatus(id: string, status: OrderStatus, tracking?: string) {
    const supabase = createClient();
    await supabase.from("orders").update({ status, tracking_number: tracking ?? null }).eq("id", id);
    loadOrders();
  }

  return (
    <main>
      <Navbar />
      <section className="section">
        <h1>Payment Queue</h1>
        <div className="chips" style={{ marginBottom: "24px" }}>
          {(["jazzcash", "bank", "all"] as const).map((t) => (
            <button key={t} className={`chip${tab === t ? " chip--active" : ""}`} onClick={() => setTab(t)}>
              {t === "jazzcash" ? "JazzCash Pending" : t === "bank" ? "Bank Transfer" : "All Orders"}
            </button>
          ))}
        </div>

        {orders.map((order) => (
          <div className="orderBox" key={order.id}>
            <p><b>{order.id.slice(0, 8).toUpperCase()}</b> — {order.profiles?.full_name ?? "Customer"}</p>
            <p>{formatPKR(Number(order.total_pkr))} — {ORDER_STATUS_LABELS[order.status]}</p>
            {order.payment_reference && <p>JazzCash: {order.payment_reference}</p>}
            {order.receipt_url && (
              <a href={order.receipt_url} target="_blank" rel="noopener noreferrer" style={{ color: "#d9a441" }}>View Receipt</a>
            )}
            <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
              {(order.status === "pending_payment" || order.status === "pending_verification") && (
                <>
                  <button className="btn" onClick={() => updateStatus(order.id, "paid")}>Confirm Payment</button>
                  <button className="btn-danger" onClick={() => updateStatus(order.id, "cancelled")}>Reject</button>
                </>
              )}
              {order.status === "paid" && (
                <button className="btn-outline" onClick={() => {
                  const tracking = prompt("Enter tracking number:");
                  if (tracking) updateStatus(order.id, "shipped", tracking);
                }}>Mark Shipped</button>
              )}
              {order.status === "shipped" && (
                <button className="btn-outline" onClick={() => updateStatus(order.id, "delivered")}>Mark Delivered</button>
              )}
            </div>
          </div>
        ))}
      </section>
      <Footer />
    </main>
  );
}
