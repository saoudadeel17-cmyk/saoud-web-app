"use client";

import { useState } from "react";
import Link from "next/link";

interface Review {
  name: string;
  stars: number;
  text: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ name: "", stars: 5, text: "" });
  const [error, setError] = useState("");

  function addReview() {
    setError("");
    if (!form.text.trim() || !form.name.trim()) {
      setError("Please enter your name and review.");
      return;
    }
    setReviews([{ ...form }, ...reviews]);
    setForm({ name: "", stars: 5, text: "" });
  }

  return (
    <main>
      <nav className="nav">
        <strong className="brand">Reviews</strong>
        <div><Link href="/">Home</Link><Link href="/products">Shop</Link></div>
      </nav>

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
          {error && <p className="form-error">{error}</p>}
          <button className="btn" style={{ marginTop: "14px" }} onClick={addReview}>Submit Review</button>
        </div>

        {reviews.length === 0 ? (
          <p style={{ color: "#b8a080" }}>No reviews yet. Be the first to share your experience.</p>
        ) : (
          reviews.map((r, i) => (
            <div className="review" key={i}>
              <div className="review-name">{r.name}</div>
              <div className="review-stars">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
              <div className="review-text">{r.text}</div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}