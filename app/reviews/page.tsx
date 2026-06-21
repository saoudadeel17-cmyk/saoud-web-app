"use client";

import { useState } from "react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<string[]>([]);
  const [text, setText] = useState("");

  function addReview() {
    setReviews([...reviews, text]);
    setText("");
  }

  return (
    <main>
      <section className="section">
        <h1>Customer Reviews</h1>
        <textarea value={text} placeholder="Write your review" onChange={(e) => setText(e.target.value)} />
        <button onClick={addReview}>Submit Review</button>
        {reviews.map((r, i) => <p className="review" key={i}>{r}</p>)}
      </section>
    </main>
  );
}