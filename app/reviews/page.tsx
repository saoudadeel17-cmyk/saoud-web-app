"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import Icon from "@/components/ui/Icon";
import type { Review } from "@/types";

export default function ReviewsPage() {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ name: "", stars: 5, text: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("reviews")
      .select("*")
      .eq("product_id", "general")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data?.length) setReviews(data as Review[]);
      });
  }, []);

  async function addReview() {
    setError("");
    if (!form.text.trim() || !form.name.trim()) {
      setError("Please enter your name and review.");
      return;
    }

    if (user) {
      const supabase = createClient();
      const { data, error: insertError } = await supabase
        .from("reviews")
        .insert({
          product_id: "general",
          user_id: user.id,
          user_name: form.name,
          rating: form.stars,
          body: form.text,
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        return;
      }
      setReviews([data as Review, ...reviews]);
    } else {
      setReviews([{
        id: `local-${Date.now()}`,
        product_id: "general",
        user_id: "",
        user_name: form.name,
        rating: form.stars,
        body: form.text,
        is_verified_purchase: false,
        created_at: new Date().toISOString(),
      }, ...reviews]);
    }

    setForm({ name: "", stars: 5, text: "" });
  }

  return (
    <main>
      <Navbar />

      <section className="section">
        <h1>Customer Reviews</h1>

        <div style={{ background: "#15100b", border: "1px solid #3b2a18", borderRadius: "10px", padding: "24px", marginBottom: "32px", maxWidth: "580px" }}>
          <h2 style={{ marginBottom: "16px", fontSize: "18px" }}>Write a Review</h2>
          <label>Your Name</label>
          <input className="input-full" value={form.name} placeholder="Your name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label>Rating</label>
          <select className="input-full" value={form.stars} onChange={(e) => setForm({ ...form, stars: Number(e.target.value) })}>
            <option value={5}>★★★★★ — Excellent</option>
            <option value={4}>★★★★☆ — Good</option>
            <option value={3}>★★★☆☆ — Average</option>
            <option value={2}>★★☆☆☆ — Poor</option>
            <option value={1}>★☆☆☆☆ — Very Poor</option>
          </select>
          <label>Review</label>
          <textarea className="input-full" value={form.text} rows={4} placeholder="Share your experience with SAQR Heritage Exports..." onChange={(e) => setForm({ ...form, text: e.target.value })} />
          {error && (
          <div className="alert alert-error" role="alert">
            <Icon name="alert" size={16} />
            <span>{error}</span>
          </div>
        )}
          <button className="btn" style={{ marginTop: "14px" }} onClick={addReview}>Submit Review</button>
        </div>

        {reviews.length === 0 ? (
          <p style={{ color: "#b8a080" }}>No reviews yet. Be the first to share your experience.</p>
        ) : (
          reviews.map((r) => (
            <div className="review" key={r.id}>
              <div className="review-name">{r.user_name}</div>
              <div className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
              <div className="review-text">{r.body}</div>
            </div>
          ))
        )}
      </section>
      <Footer />
    </main>
  );
}
