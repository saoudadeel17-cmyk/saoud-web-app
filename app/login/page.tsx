"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  function login() {
    if (!form.name || !form.email || !form.password) {
      setMessage("Please fill in all fields.");
      return;
    }
    // NOTE: In production, send credentials to a secure backend — never store plain passwords in localStorage.
    localStorage.setItem("user", JSON.stringify({ name: form.name, email: form.email }));
    setMessage("Login successful. You can now place orders.");
  }

  function logout() {
    localStorage.removeItem("user");
    setMessage("You have been logged out.");
  }

  const currentUser = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null;

  return (
    <main>
      <nav className="nav">
        <strong className="brand">Login</strong>
        <div>
          <Link href="/">Home</Link>
          <Link href="/signup">Sign Up</Link>
        </div>
      </nav>

      <div className="formBox">
        <h1>Customer Login</h1>

        {currentUser && (
          <p style={{ marginBottom: "16px", color: "#b8a080", fontSize: "14px" }}>
            Logged in as <strong style={{ color: "#d9a441" }}>{currentUser.name}</strong>
          </p>
        )}

        <label>Full Name</label>
        <input className="input-full" placeholder="Your full name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label>Email</label>
        <input className="input-full" type="email" placeholder="Your email address" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label>Password</label>
        <input className="input-full" type="password" placeholder="Your password" onChange={(e) => setForm({ ...form, password: e.target.value })} />

        {message && <p className={message.includes("successful") ? "form-success" : "form-error"}>{message}</p>}

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button className="btn" onClick={login}>Login</button>
          <button className="btn-outline" onClick={logout}>Logout</button>
        </div>

        <p style={{ marginTop: "20px", fontSize: "13px", color: "#b8a080" }}>
          Don't have an account? <Link href="/signup" style={{ color: "#d9a441" }}>Sign up here</Link>
        </p>
      </div>
    </main>
  );
}