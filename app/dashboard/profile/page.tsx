"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";

export default function DashboardProfilePage() {
  const { user } = useUser();
  const [form, setForm] = useState({ full_name: "", phone: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ full_name: user.full_name ?? "", phone: user.phone ?? "" });
    }
  }, [user]);

  async function save() {
    if (!user) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: form.full_name, phone: form.phone })
      .eq("id", user.id);

    setLoading(false);
    setMessage(error ? error.message : "Profile updated successfully.");
  }

  return (
    <main>
      <Navbar />
      <section className="section">
        <div className="formBox" style={{ margin: "0", maxWidth: "480px" }}>
          <h1>Profile</h1>
          <label>Full Name</label>
          <input className="input-full" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <label>Phone</label>
          <input className="input-full" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <label>Email (read-only)</label>
          <input className="input-full" value={user?.email ?? ""} disabled />
          {message && <p className={message.includes("success") ? "form-success" : "form-error"}>{message}</p>}
          <button className="btn" style={{ marginTop: "20px" }} onClick={save} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </section>
      <Footer />
    </main>
  );
}
