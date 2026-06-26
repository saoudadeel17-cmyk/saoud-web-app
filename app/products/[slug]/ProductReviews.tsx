"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import type { Review } from "@/types";

export default function ProductReviews({ productId }: { productId: string }) {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ rating: 5, body: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .then(({ data }) => setReviews((data as Review[]) ?? []));
  }, [productId]);

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  async function submit() {
    setError("");
    if (!user) {
      setError("Please log in to leave a review.");
      return;
    }
    if (!form.body.trim()) {
      setError("Please write your review.");
      return;
    }

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("reviews")
      .insert({
        product_id: productId,
        user_id: user.id,
        user_name: user.full_name ?? "Customer",
        rating: form.rating,
        body: form.body,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setReviews([data as Review, ...reviews]);
    setForm({ rating: 5, body: "" });
  }

  return (
    <div>
      {reviews.length > 0 && (
        <p style={{ color: "#d9a441", marginBottom: "16px" }}>
          {"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))} ({reviews.length} reviews)
        </p>
      )}

      <div style={{ background: "#15100b", border: "1px solid #3b2a18", borderRadius: "10px", padding: "24px", marginBottom: "24px", maxWidth: "580px" }}>
        <h3 style={{ marginBottom: "12px" }}>Write a Review</h3>
        <label>Rating</label>
        <select className="input-full" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
        </select>
        <label>Review</label>
        <textarea className="input-full" rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        {error && <p className="form-error">{error}</p>}
        <button className="btn" style={{ marginTop: "12px" }} onClick={submit}>Submit Review</button>
      </div>

      {reviews.length === 0 ? (
        <p style={{ color: "#b8a080" }}>No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div className="review" key={r.id}>
            <div className="review-name">{r.user_name}</div>
            <div className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
            <div className="review-text">{r.body}</div>
          </div>
        ))
      )}
    </div>
  );
}
