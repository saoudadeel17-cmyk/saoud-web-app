"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Icon from "@/components/ui/Icon";
import { createClient } from "@/lib/supabase/client";
import { getAuthError } from "@/lib/errors";
import { getSafeRedirectPath } from "@/lib/auth/redirect";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirectPath(searchParams.get("redirect"));
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function login() {
    if (!form.email || !form.password) {
      setMessage("Please fill in all fields.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setMessage(getAuthError(error.message.includes("Invalid") ? "invalid_credentials" : error.message));
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    setMessage("Login successful.");
    setIsSuccess(true);
    router.push(redirectTo);
    router.refresh();
  }

  async function loginWithGoogle() {
    const supabase = createClient();
    const next = encodeURIComponent(redirectTo);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
      },
    });
  }

  return (
    <main>
      <Navbar />

      <div className="page-container page-container--auth page-container--center">
        <div className="formBox">
        <h1>Customer Login</h1>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          className="input-full"
          type="email"
          placeholder="Your email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label htmlFor="password">Password</label>
        <div style={{ position: "relative" }}>
          <input
            id="password"
            className="input-full"
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
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
              color: "#b8a080",
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Icon name={showPassword ? "eye-off" : "eye"} size={18} />
          </button>
        </div>

        {message && (
          <div className={`alert ${isSuccess ? "alert-success" : "alert-error"}`} role="alert">
            <Icon name={isSuccess ? "check" : "alert"} size={16} />
            <span>{message}</span>
          </div>
        )}

        <button className="btn" style={{ marginTop: "20px" }} onClick={login} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" /> Signing in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <button
          className="btn-outline"
          style={{ marginTop: "12px", width: "100%" }}
          onClick={loginWithGoogle}
          type="button"
        >
          Continue with Google
        </button>

        <p style={{ marginTop: "20px", fontSize: "13px", color: "#b8a080" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "#d9a441" }}>Sign up here</Link>
        </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main>
        <Navbar />
        <div className="page-container page-container--auth page-container--center">
          <div className="formBox">
            <h1>Customer Login</h1>
            <p style={{ color: "#b8a080" }}>Loading...</p>
          </div>
        </div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
