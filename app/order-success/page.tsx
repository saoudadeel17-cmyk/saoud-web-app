import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import Price from "@/components/Price";
import type { OrderStatus, PaymentMethod } from "@/types";

export const dynamic = "force-dynamic";

function paymentMessage(method: PaymentMethod): string {
  switch (method) {
    case "jazzcash":
      return "Please complete payment on your JazzCash app. We'll confirm your order once payment is received.";
    case "bank_transfer":
      return "We've received your receipt. Our team will verify payment within 2-4 hours.";
    case "cod":
      return "Your order is confirmed! Pay when delivered.";
    case "stripe":
      return "Payment successful! Your order is confirmed.";
    default:
      return "Thank you for your order.";
  }
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let order: {
    id: string;
    status: OrderStatus;
    payment_method: PaymentMethod;
    total_pkr: number;
    delivery_method: string;
    shipping_address: { full_name: string; city: string; address: string };
    order_items: Array<{ product_name: string; quantity: number; price_pkr: number }>;
  } | null = null;

  if (params.orderId) {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", params.orderId)
      .single();
    order = data;
  }

  return (
    <main>
      <Navbar />
      <section className="section">
        <div className="successBox">
          <h1 style={{ marginBottom: "12px" }}>Order Confirmed!</h1>
          {order ? (
            <>
              <p>Order ID: <strong>{order.id}</strong></p>
              <p style={{ marginTop: "10px" }}>{paymentMessage(order.payment_method)}</p>
              <p style={{ marginTop: "10px" }}>Total: <strong><Price amountPkr={Number(order.total_pkr)} /></strong></p>
              {order.order_items?.map((item, i) => (
                <p key={i} style={{ fontSize: "13px", color: "#b8a080" }}>
                  {item.product_name} × {item.quantity}
                </p>
              ))}
            </>
          ) : (
            <p>Your payment was processed. Check your dashboard for order details.</p>
          )}
        </div>
        <div style={{ marginTop: "24px", display: "flex", gap: "14px" }}>
          <Link href="/dashboard" className="btn">View Dashboard</Link>
          <Link href="/products" className="btn-outline">Continue Shopping</Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
