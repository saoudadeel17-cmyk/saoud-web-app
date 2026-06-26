"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function login() {
    if (!form.email || !form.password) {
      setMessage("Please fill in all fields.");
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (
      savedUser &&
      savedUser.email === form.email &&
      savedUser.password === form.password
    ) {
      setMessage("Login successful.");
    } else {
      setMessage("Invalid email or password.");
    }
  }

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

        <label>Email</label>
        <input
          className="input-full"
          type="email"
          placeholder="Your email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <label>Password</label>

        <div style={{ position: "relative" }}>
          <input
            className="input-full"
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {message && (
          <p
            className={
              message.includes("successful")
                ? "form-success"
                : "form-error"
            }
          >
            {message}
          </p>
        )}

        <button
          className="btn"
          style={{ marginTop: "20px" }}
          onClick={login}
        >
          Login
        </button>

        <p
          style={{
            marginTop: "20px",
            fontSize: "13px",
            color: "#b8a080",
          }}
        >
          Don't have an account?{" "}
          <Link
            href="/signup"
            style={{ color: "#d9a441" }}
          >
            Sign up here
          </Link>
        </p>
      </div>
    </main>
  );
}