"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";

interface ProfileRow {
  id: string;
  full_name: string;
  phone?: string;
  role: string;
  created_at: string;
}

export default function AdminUserPage() {
  const [users, setUsers] = useState<ProfileRow[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setUsers((data as ProfileRow[]) ?? []);
    });
  }, []);

  return (
    <main>
      <Navbar />
      <section className="section">
        <h1>Users</h1>
        {!users.length ? (
          <p style={{ color: "#b8a080" }}>No users found. Users appear after signup.</p>
        ) : (
          users.map((u) => (
            <div className="orderBox" key={u.id}>
              <p><b>{u.full_name ?? "—"}</b> — <span style={{ color: "#d9a441" }}>{u.role}</span></p>
              <p style={{ fontSize: "13px", color: "#b8a080" }}>{u.phone ?? "No phone"} · Joined {new Date(u.created_at).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </section>
      <Footer />
    </main>
  );
}
