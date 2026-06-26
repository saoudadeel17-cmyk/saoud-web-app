import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPKR } from "@/lib/utils";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let todayCount = 0;
  let monthRevenue = 0;
  let pendingCount = 0;
  let productsCount = 120;
  let recentOrders: Array<{
    id: string;
    status: string;
    total_pkr: number;
    created_at: string;
  }> = [];

  try {
    const admin = createAdminClient();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const { count: productsCountResult } = await admin.from("products").select("*", { count: "exact", head: true });
  const { data: monthOrders } = await admin.from("orders").select("total_pkr").gte("created_at", monthStart);
  const { count: todayCountResult } = await admin.from("orders").select("*", { count: "exact", head: true }).gte("created_at", todayStart);
  const { count: pendingCountResult } = await admin.from("orders").select("*", { count: "exact", head: true }).in("status", ["pending_payment", "pending_verification"]);
  const { data: recentOrdersResult } = await admin.from("orders").select("*, profiles(full_name)").order("created_at", { ascending: false }).limit(10);

  productsCount = productsCountResult ?? 120;
  todayCount = todayCountResult ?? 0;
  pendingCount = pendingCountResult ?? 0;
  monthRevenue = monthOrders?.reduce((s, o) => s + Number(o.total_pkr), 0) ?? 0;
  recentOrders = recentOrdersResult ?? [];
  } catch {
    // Supabase not configured yet
  }

  return (
    <main>
      <Navbar />
      <section className="section">
        <h1>Admin Dashboard</h1>
        <div className="why-grid" style={{ margin: "24px 0" }}>
          <div className="why-card"><span className="stat-num">{todayCount}</span><span className="stat-label">Orders Today</span></div>
          <div className="why-card"><span className="stat-num">{formatPKR(monthRevenue)}</span><span className="stat-label">Revenue This Month</span></div>
          <div className="why-card"><span className="stat-num">{pendingCount}</span><span className="stat-label">Pending Payments</span></div>
          <div className="why-card"><span className="stat-num">{productsCount}</span><span className="stat-label">Products</span></div>
        </div>

        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <Link href="/admin/order" className="btn">Payment Queue</Link>
          <Link href="/admin/products" className="btn-outline">Products</Link>
          <Link href="/admin/user" className="btn-outline">Users</Link>
        </div>

        <h2>Recent Orders</h2>
        {recentOrders?.map((order) => (
          <div className="orderBox" key={order.id}>
            <p><b>{order.id.slice(0, 8).toUpperCase()}</b> — {ORDER_STATUS_LABELS[order.status as OrderStatus] ?? order.status}</p>
            <p>{formatPKR(Number(order.total_pkr))} — {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </section>
      <Footer />
    </main>
  );
}
