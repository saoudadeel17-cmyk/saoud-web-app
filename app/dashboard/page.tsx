import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { formatPKR } from "@/lib/utils";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(count)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <main>
      <Navbar />
      <section className="section">
        <h1>Welcome, {profile?.full_name ?? "Customer"}</h1>
        <p style={{ color: "#b8a080", marginBottom: "24px" }}>{user?.email}</p>

        <div style={{ display: "flex", gap: "14px", marginBottom: "32px", flexWrap: "wrap" }}>
          <Link href="/dashboard/profile" className="btn-outline">Edit Profile</Link>
          <Link href="/dashboard/order" className="btn-outline">My Orders</Link>
          <Link href="/dashboard/settings" className="btn-outline">Settings</Link>
        </div>

        <h2 style={{ marginBottom: "16px" }}>Order History</h2>
        {!orders?.length ? (
          <div className="emptyState">
            <h2>No orders yet</h2>
            <Link href="/products" className="btn" style={{ marginTop: "16px", display: "inline-block" }}>Browse Products</Link>
          </div>
        ) : (
          orders.map((order) => (
            <div className="orderBox" key={order.id}>
              <p><b>Order:</b> {order.id.slice(0, 8).toUpperCase()}</p>
              <p><b>Date:</b> {new Date(order.created_at).toLocaleDateString()}</p>
              <p><b>Status:</b> {ORDER_STATUS_LABELS[order.status as OrderStatus] ?? order.status}</p>
              <p><b>Total:</b> {formatPKR(Number(order.total_pkr))}</p>
              <Link href="/dashboard/order" style={{ color: "#d9a441", fontSize: "13px" }}>View details →</Link>
            </div>
          ))
        )}
      </section>
      <Footer />
    </main>
  );
}
