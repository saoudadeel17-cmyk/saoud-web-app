"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", country: "", phone: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function signup() {
    setError("");
    if (!form.name || !form.email || !form.password || !form.country) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match. Please check and try again.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    // NOTE: In production, send to a secure backend API — never store passwords in localStorage.
    localStorage.setItem("user", JSON.stringify({ name: form.name, email: form.email, country: form.country }));
    setSuccess(true);
  }

  if (success) {
    return (
      <main>
        <nav className="nav">
          <strong className="brand">Sign Up</strong>
          <div><Link href="/">Home</Link></div>
        </nav>
        <div className="formBox">
          <div className="successBox">
            <h2>Account created!</h2>
            <p style={{ marginTop: "8px" }}>Welcome, {form.name}. You can now log in and place orders.</p>
          </div>
          <Link href="/login" className="btn" style={{ marginTop: "20px", display: "inline-block" }}>Go to Login</Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <nav className="nav">
        <strong className="brand">Sign Up</strong>
        <div>
          <Link href="/">Home</Link>
          <Link href="/login">Login</Link>
        </div>
      </nav>

      <div className="formBox">
        <h1>Create Account</h1>
        <label>Full Name *</label>
        <input className="input-full" placeholder="Your full name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label>Email *</label>
        <input className="input-full" type="email" placeholder="Your email address" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label>Password *</label>
        <input className="input-full" type="password" placeholder="At least 6 characters" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label>Confirm Password *</label>
        <input className="input-full" type="password" placeholder="Repeat your password" onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        <label>Country *</label>
        <input className="input-full" placeholder="e.g. United Arab Emirates" onChange={(e) => setForm({ ...form, country: e.target.value })} />
        <label>Phone / WhatsApp</label>
        <input className="input-full" placeholder="Optional" onChange={(e) => setForm({ ...form, phone: e.target.value })} />

        {error && <p className="form-error">{error}</p>}
        <button className="btn" style={{ marginTop: "20px" }} onClick={signup}>Create Account</button>

        <p style={{ marginTop: "16px", fontSize: "13px", color: "#b8a080" }}>
          Already have an account? <Link href="/login" style={{ color: "#d9a441" }}>Login here</Link>
        </p>
      </div>
    </main>
  );
}