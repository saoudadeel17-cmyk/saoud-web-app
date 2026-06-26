"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Icon from "@/components/ui/Icon";
import { createClient } from "@/lib/supabase/client";
import { getAuthError } from "@/lib/errors";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    country: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signup() {
    setError("");

    if (!form.name || !form.email || !form.password || !form.country) {
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

    setLoading(true);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          phone: form.phone,
          country: form.country,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      const code = signUpError.message.toLowerCase().includes("already") ? "user_already_exists" : signUpError.message;
      setError(getAuthError(code));
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <main>
        <Navbar />
        <div className="page-container page-container--auth page-container--center">
          <div className="formBox">
            <div className="alert alert-success" role="alert">
            <Icon name="check" size={16} />
            <div>
              <h2 style={{ marginBottom: "8px" }}>Check your email to verify</h2>
              <p>We sent a verification link to {form.email}. Please verify before logging in.</p>
            </div>
          </div>
          <Link href="/login" className="btn">
            Login
          </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />

      <div className="page-container page-container--auth page-container--center">
        <div className="formBox">
        <h1>Create Account</h1>

        <label>Full Name *</label>
        <input
          className="input-full"
          type="text"
          placeholder="Your full name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Email *</label>
        <input
          className="input-full"
          type="email"
          placeholder="Your email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Password *</label>
        <div style={{ position: "relative" }}>
          <input
            className="input-full"
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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

        <label>Confirm Password *</label>
        <input
          className="input-full"
          type={showPassword ? "text" : "password"}
          placeholder="Repeat password"
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />

        <label>Country *</label>
        <select
          className="input-full"
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        >
          <option value="">Select Country</option>
          <option value="Pakistan">Pakistan</option>
          <option value="United Arab Emirates">United Arab Emirates</option>
          <option value="Saudi Arabia">Saudi Arabia</option>
          <option value="Qatar">Qatar</option>
          <option value="Kuwait">Kuwait</option>
          <option value="Oman">Oman</option>
          <option value="Bahrain">Bahrain</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="United States">United States</option>
        </select>

        <label>Phone Number</label>
        <input
          className="input-full"
          type="tel"
          placeholder="03XX XXXXXXX"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        {error && (
          <div className="alert alert-error" role="alert">
            <Icon name="alert" size={16} />
            <span>{error}</span>
          </div>
        )}

        <button className="btn" onClick={signup} disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p style={{ marginTop: "15px", fontSize: "13px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#d9a441" }}>Login here</Link>
        </p>
        </div>
      </div>
    </main>
  );
}
