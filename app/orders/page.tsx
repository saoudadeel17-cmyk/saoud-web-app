import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function OrdersPage() {
  return (
    <main>
      <Navbar />
      <section className="section">
        <h1>Order Tracking</h1>
        <p style={{ color: "#b8a080", marginBottom: "20px" }}>
          Order history has moved to your dashboard.
        </p>
        <Link href="/dashboard/order" className="btn">View My Orders</Link>
      </section>
      <Footer />
    </main>
  );
}
