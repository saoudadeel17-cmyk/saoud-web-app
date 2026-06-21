"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState({ name: "", email: "" });

  function login() {
    localStorage.setItem("user", JSON.stringify(user));
    alert("Login successful");
  }

  function logout() {
    localStorage.removeItem("user");
    alert("Logged out");
  }

  return (
    <main>
      <nav className="nav">
        <strong>Login</strong>
        <Link href="/signup">Sign Up</Link>
      </nav>

      <section className="formBox">
        <h1>Customer Login</h1>
        <input placeholder="Full Name" onChange={(e) => setUser({ ...user, name: e.target.value })} />
        <input placeholder="Email" onChange={(e) => setUser({ ...user, email: e.target.value })} />
        <button onClick={login}>Login</button>
        <button onClick={logout}>Logout</button>
      </section>
    </main>
  );
}