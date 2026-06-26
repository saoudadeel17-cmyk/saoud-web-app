"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { createOrder } from "@/lib/actions/orders";
import { PAKISTAN_PHONE_REGEX } from "@/lib/utils";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { getOrderError } from "@/lib/errors";
import Icon from "@/components/ui/Icon";
import {
  COD_LIMIT_PKR,
  DELIVERY_FEES,
  FREE_SHIPPING_THRESHOLD_PKR,
  PAKISTAN_CITIES,
  type DeliveryMethod,
  type PaymentMethod,
} from "@/types";

const STEPS = ["Shipping", "Delivery", "Payment", "Review"];

export default function CheckoutPage() {
  const router = useRouter();
  const formatPrice = useFormatPrice();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [international, setInternational] = useState(false);

  const [shipping, setShipping] = useState({
    full_name: "",
    phone: "",
    city: "",
    address: "",
    postal_code: "",
  });

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("jazzcash");
  const [jazzcashNumber, setJazzcashNumber] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [bankDetails, setBankDetails] = useState({
    bank_name: "",
    bank_account_title: "",
    bank_account_number: "",
    bank_iban: "",
  });

  useEffect(() => {
    fetch("/api/config/bank")
      .then((r) => r.json())
      .then(setBankDetails)
      .catch(() => {});
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price_pkr * i.quantity, 0);
  const deliveryFee =
    deliveryMethod === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD_PKR
      ? 0
      : DELIVERY_FEES[deliveryMethod];
  const total = subtotal + deliveryFee;
  const codAvailable = total < COD_LIMIT_PKR;

  function validateStep(): boolean {
    setError("");
    if (step === 0) {
      if (!shipping.full_name || !shipping.phone || !shipping.city || !shipping.address) {
        setError("Please fill in all required shipping fields.");
        return false;
      }
      const phone = shipping.phone.replace(/\D/g, "").slice(-11);
      if (!PAKISTAN_PHONE_REGEX.test(phone)) {
        setError("Invalid phone. Use Pakistan format: 03XXXXXXXXX");
        return false;
      }
    }
    if (step === 2) {
      if (paymentMethod === "jazzcash" && !PAKISTAN_PHONE_REGEX.test(jazzcashNumber.replace(/\D/g, "").slice(-11))) {
        setError("Enter a valid JazzCash number (03XXXXXXXXX).");
        return false;
      }
      if (paymentMethod === "bank_transfer" && !receiptUrl) {
        setError("Please upload your payment receipt.");
        return false;
      }
    }
    return true;
  }

  async function uploadReceipt(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload/receipt", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Upload failed");
    setReceiptUrl(data.url);
  }

  async function placeOrder() {
    setLoading(true);
    setError("");

    const result = await createOrder({
      items,
      shipping: { ...shipping, phone: shipping.phone.replace(/\D/g, "").slice(-11) },
      delivery_method: deliveryMethod,
      payment_method: paymentMethod,
      payment_reference: paymentMethod === "jazzcash" ? jazzcashNumber : undefined,
      receipt_url: paymentMethod === "bank_transfer" ? receiptUrl : undefined,
    });

    setLoading(false);

    if (result.error) {
      setError(getOrderError(result.error));
      if ('redirect' in result && result.redirect) {
        router.push(result.redirect);
      }
      return;
    }

    if (paymentMethod === "stripe") {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, orderId: result.orderId }),
      });
      const data = await res.json();
      if (data.url) {
        clearCart();
        window.location.href = data.url;
        return;
      }
    }

    clearCart();
    router.push(`/order-success?orderId=${result.orderId}`);
  }

  if (items.length === 0) {
    return (
      <main>
        <Navbar />
        <section className="section emptyState">
          <h2>Your cart is empty</h2>
          <p>Add items before checkout.</p>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="section">
        <h1>Checkout</h1>
        <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
          {STEPS.map((label, i) => (
            <span
              key={label}
              style={{
                color: i <= step ? "#d9a441" : "#b8a080",
                fontSize: "13px",
              }}
            >
              {i + 1}. {label}{i < STEPS.length - 1 ? " →" : ""}
            </span>
          ))}
        </div>

        {step === 0 && (
          <div className="formBox" style={{ margin: "0", maxWidth: "560px" }}>
            <h2 style={{ marginBottom: "16px" }}>Shipping Info</h2>
            <label>Full Name *</label>
            <input className="input-full" value={shipping.full_name} onChange={(e) => setShipping({ ...shipping, full_name: e.target.value })} />
            <label>Phone (03XXXXXXXXX) *</label>
            <input className="input-full" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} />
            <label>City *</label>
            <select className="input-full" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })}>
              <option value="">Select city</option>
              {PAKISTAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <label>Full Address *</label>
            <textarea className="input-full" rows={3} value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} />
            <label>Postal Code</label>
            <input className="input-full" value={shipping.postal_code} onChange={(e) => setShipping({ ...shipping, postal_code: e.target.value })} />
          </div>
        )}

        {step === 1 && (
          <div style={{ maxWidth: "560px" }}>
            <h2 style={{ marginBottom: "16px" }}>Delivery Method</h2>
            {([
              ["standard", "Standard Delivery (5-7 days)", DELIVERY_FEES.standard, "FREE over Rs. 3,000"],
              ["express", "Express Delivery (2-3 days)", DELIVERY_FEES.express, ""],
              ["same_day", "Same Day (Lahore only)", DELIVERY_FEES.same_day, ""],
            ] as const).map(([key, label, fee, note]) => (
              <label key={key} className="orderBox" style={{ display: "block", cursor: "pointer", marginBottom: "12px" }}>
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryMethod === key}
                  onChange={() => setDeliveryMethod(key)}
                  style={{ marginRight: "10px" }}
                />
                {label} — {key === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD_PKR ? "FREE" : formatPrice(fee)}
                {note && <span style={{ color: "#b8a080", fontSize: "12px" }}> ({note})</span>}
              </label>
            ))}
          </div>
        )}

        {step === 2 && (
          <div style={{ maxWidth: "560px" }}>
            <h2 style={{ marginBottom: "16px" }}>Payment Method</h2>

            <label className="orderBox" style={{ display: "block", cursor: "pointer", marginBottom: "12px" }}>
              <input type="radio" name="payment" checked={paymentMethod === "jazzcash"} onChange={() => setPaymentMethod("jazzcash")} style={{ marginRight: "10px" }} />
              JazzCash Mobile Account
            </label>
            {paymentMethod === "jazzcash" && (
              <div style={{ marginLeft: "24px", marginBottom: "16px" }}>
                <input className="input-full" placeholder="03XXXXXXXXX" value={jazzcashNumber} onChange={(e) => setJazzcashNumber(e.target.value)} />
                <p style={{ fontSize: "12px", color: "#b8a080", marginTop: "6px" }}>You will receive a payment request on your phone</p>
              </div>
            )}

            <label className="orderBox" style={{ display: "block", cursor: "pointer", marginBottom: "12px" }}>
              <input type="radio" name="payment" checked={paymentMethod === "bank_transfer"} onChange={() => setPaymentMethod("bank_transfer")} style={{ marginRight: "10px" }} />
              Bank Transfer
            </label>
            {paymentMethod === "bank_transfer" && (
              <div style={{ marginLeft: "24px", marginBottom: "16px" }}>
                <p style={{ fontSize: "13px", marginBottom: "8px" }}>
                  Bank: {bankDetails.bank_name || "[Set BANK_NAME in .env]"}<br />
                  Account: {bankDetails.bank_account_title || "[Set BANK_ACCOUNT_TITLE]"}<br />
                  Number: {bankDetails.bank_account_number || "[Set BANK_ACCOUNT_NUMBER]"}<br />
                  IBAN: {bankDetails.bank_iban || "[Set BANK_IBAN]"}
                </p>
                <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setReceiptFile(file);
                    try {
                      await uploadReceipt(file);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Upload failed");
                    }
                  }
                }} />
                {receiptFile && <p className="form-success" style={{ marginTop: "8px" }}>Receipt uploaded ✓</p>}
              </div>
            )}

            <label className={`orderBox ${!codAvailable ? "opacity-50" : ""}`} style={{ display: "block", cursor: codAvailable ? "pointer" : "not-allowed", marginBottom: "12px" }}>
              <input type="radio" name="payment" checked={paymentMethod === "cod"} disabled={!codAvailable} onChange={() => setPaymentMethod("cod")} style={{ marginRight: "10px" }} />
              Cash on Delivery {!codAvailable && "(not available over Rs. 15,000)"}
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px", fontSize: "13px" }}>
              <input type="checkbox" checked={international} onChange={(e) => setInternational(e.target.checked)} />
              Paying from outside Pakistan?
            </label>
            {international && (
              <label className="orderBox" style={{ display: "block", cursor: "pointer", marginTop: "12px" }}>
                <input type="radio" name="payment" checked={paymentMethod === "stripe"} onChange={() => setPaymentMethod("stripe")} style={{ marginRight: "10px" }} />
                International Card (Stripe)
              </label>
            )}
          </div>
        )}

        {step === 3 && (
          <div style={{ maxWidth: "560px" }}>
            <h2 style={{ marginBottom: "16px" }}>Review Order</h2>
            {items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #3b2a18" }}>
                <span>{item.name} × {item.quantity}</span>
                <strong style={{ color: "#d9a441" }}>{formatPrice(item.price_pkr * item.quantity)}</strong>
              </div>
            ))}
            <p style={{ marginTop: "12px" }}>Subtotal: {formatPrice(subtotal)}</p>
            <p>Delivery: {formatPrice(deliveryFee)}</p>
            <p style={{ fontSize: "18px", color: "#d9a441", marginTop: "8px" }}>Total: {formatPrice(total)}</p>
            <div className="orderBox" style={{ marginTop: "16px" }}>
              <p><b>Ship to:</b> {shipping.full_name}, {shipping.phone}</p>
              <p>{shipping.address}, {shipping.city}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error" role="alert" style={{ marginTop: "16px" }}>
            <Icon name="alert" size={16} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          {step > 0 && (
            <button className="btn-outline" onClick={() => setStep(step - 1)}>Back</button>
          )}
          {step < 3 ? (
            <button className="btn" onClick={() => { if (validateStep()) setStep(step + 1); }}>Continue</button>
          ) : (
            <button className="btn" onClick={placeOrder} disabled={loading}>
              {loading ? "Placing order..." : "Place Order"}
            </button>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
