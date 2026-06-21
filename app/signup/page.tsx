"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [user, setUser] = useState({ name: "", email: "", country: "" });

  function signup() {
    localStorage.setItem("user", JSON.stringify(user));
    alert("Account created");
  }

  return (
    <main>
      <nav className="nav">
        <strong>Sign Up</strong>
        <Link href="/login">Login</Link>
      </nav>

      <section className="formBox">
        <h1>Create Account</h1>
        <input placeholder="Full Name" onChange={(e) => setUser({ ...user, name: e.target.value })} />
        <input placeholder="Email" onChange={(e) => setUser({ ...user, email: e.target.value })} />
        <input placeholder="Country" onChange={(e) => setUser({ ...user, country: e.target.value })} />
        <button onClick={signup}>Sign Up</button>
      </section>
    </main>
  );
}