"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    country: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function signup() {
    setError("");

    if (
      !form.email ||
      !form.password ||
      !form.country
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        email: form.email,
        password: form.password,
        country: form.country,
        phone: form.phone,
      })
    );

    setSuccess(true);
  }

  if (success) {
    return (
      <main>
        <nav className="nav">
          <strong className="brand">Sign Up</strong>
          <div>
            <Link href="/">Home</Link>
          </div>
        </nav>

        <div className="formBox">
          <div className="successBox">
            <h2>Account Created Successfully!</h2>
            <p>
              Your account has been created.
            </p>
          </div>

          <Link
            href="/login"
            className="btn"
            style={{
              marginTop: "20px",
              display: "inline-block",
            }}
          >
            Go To Login
          </Link>
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

        <label>Email *</label>
        <input
          className="input-full"
          type="email"
          placeholder="Your email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <label>Password *</label>

        <div style={{ position: "relative" }}>
          <input
            className="input-full"
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
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

        <label>Confirm Password *</label>
        <input
          className="input-full"
          type={showPassword ? "text" : "password"}
          placeholder="Repeat password"
          onChange={(e) =>
            setForm({ ...form, confirm: e.target.value })
          }
        />

        <label>Country *</label>
        <select
          className="input-full"
          onChange={(e) =>
            setForm({ ...form, country: e.target.value })
          }
        >
          <option value="">Select Country</option>
          <option value="Pakistan">Pakistan</option>
          <option value="United Arab Emirates">
            United Arab Emirates
          </option>
          <option value="Saudi Arabia">
            Saudi Arabia
          </option>
          <option value="Qatar">Qatar</option>
          <option value="Kuwait">Kuwait</option>
          <option value="Oman">Oman</option>
          <option value="Bahrain">Bahrain</option>
          <option value="United Kingdom">
            United Kingdom
          </option>
          <option value="United States">
            United States
          </option>
        </select>

        <label>Phone / WhatsApp</label>
        <input
          className="input-full"
          placeholder="Optional"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        {error && (
          <p className="form-error">{error}</p>
        )}

        <button
          className="btn"
          style={{ marginTop: "20px" }}
          onClick={signup}
        >
          Create Account
        </button>

        <p
          style={{
            marginTop: "15px",
            fontSize: "13px",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{ color: "#d9a441" }}
          >
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}