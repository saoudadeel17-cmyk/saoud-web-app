"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { products as staticProducts } from "@/app/data/products";
import { createClient } from "@/lib/supabase/client";
import { formatPKR } from "@/lib/utils";

interface DbProduct {
  id: string;
  name: string;
  category: string;
  price_pkr: number;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
}

export default function AdminProductsPage() {
  const [dbProducts, setDbProducts] = useState<DbProduct[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("products").select("*").then(({ data }) => {
      if (data?.length) setDbProducts(data as DbProduct[]);
    });
  }, []);

  const displayProducts = dbProducts.length
    ? dbProducts
    : staticProducts.map((p) => ({
        id: String(p.id),
        name: p.name,
        category: p.category,
        price_pkr: p.price_pkr,
        stock: p.stock,
        is_active: true,
        is_featured: false,
      }));

  async function toggleActive(id: string, current: boolean) {
    const supabase = createClient();
    await supabase.from("products").update({ is_active: !current }).eq("id", id);
    setDbProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !current } : p));
  }

  return (
    <main>
      <Navbar />
      <section className="section">
        <h1>Products</h1>
        <p style={{ color: "#b8a080", marginBottom: "20px" }}>
          Showing static catalog data. Sync to Supabase via SQL seed when ready.
        </p>
        {displayProducts.map((p) => (
          <div className="orderBox" key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p><b>{p.name}</b> — {p.category}</p>
              <p style={{ fontSize: "13px", color: "#b8a080" }}>{formatPKR(p.price_pkr)} · Stock: {p.stock}</p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: p.is_active ? "#7ecf8a" : "#e07070" }}>
                {p.is_active ? "Active" : "Inactive"}
              </span>
              {dbProducts.length > 0 && (
                <button className="btn-outline" onClick={() => toggleActive(p.id, p.is_active)}>
                  Toggle
                </button>
              )}
            </div>
          </div>
        ))}
      </section>
      <Footer />
    </main>
  );
}
