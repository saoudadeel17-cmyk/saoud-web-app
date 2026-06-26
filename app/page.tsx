"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { products, categories } from "./data/products";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className={`${className ?? ""} fade-section ${inView ? "fade-in" : ""}`}>
      {children}
    </section>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const visible = filtered.slice(0, visibleCount);

  return (
    <main>
      {/* ── Nav ── */}
      <nav className="nav">
        <strong className="brand">SAQR Heritage Exports</strong>
        <div className="nav-links">
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/login" className="btn nav-cta">Login</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow animate-fadein" style={{ animationDelay: "0.1s" }}>Persian · Arabian · Iranian · UAE · Qatar</p>
          <h1 className="animate-fadein" style={{ animationDelay: "0.25s" }}>
            Luxury Handmade Rugs,<br />Mats & Traditional Crafts
          </h1>
          <p className="animate-fadein" style={{ animationDelay: "0.4s" }}>
            Authentic Persian rugs, Arabian mats, and handmade cultural decor — exported worldwide from Pakistan.
          </p>
          <div className="hero-actions animate-fadein" style={{ animationDelay: "0.55s" }}>
            <Link className="btn" href="/products">Explore Collection</Link>
            <Link className="btn-outline" href="/contact">Request Wholesale</Link>
          </div>
          <div className="hero-stats animate-fadein" style={{ animationDelay: "0.7s" }}>
            <div className="stat"><span className="stat-num">120+</span><span className="stat-label">Products</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">4</span><span className="stat-label">Collections</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">30+</span><span className="stat-label">Countries Exported</span></div>
          </div>
        </div>
        <div className="hero-overlay" />
      </section>

      {/* ── Categories ── */}
      <AnimatedSection className="section">
        <p className="eyebrow" style={{ marginBottom: "8px" }}>Browse by</p>
        <h2>Collections</h2>
        <div className="chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip ${activeCategory === cat ? "chip--active" : ""}`}
              onClick={() => { setActiveCategory(cat); setVisibleCount(12); }}
            >
              {cat}
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* ── Search ── */}
      <div className="search-bar-wrap">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search rugs, mats, crafts..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(12); }}
          />
          {searchQuery && <button className="search-clear" onClick={() => setSearchQuery("")}>✕</button>}
        </div>
        <p className="results-count">{filtered.length} items</p>
      </div>

      {/* ── Product Grid ── */}
      <section className="grid">
        {visible.map((item, i) => (
          <article
            className="card"
            key={item.id}
            style={{ animationDelay: `${(i % 12) * 0.05}s` }}
          >
            <div className="imageWrap">
              <img src={item.image} alt={item.name} loading="lazy" />
              <div className="popup">{item.detail}</div>
              <div className="img-overlay" />
            </div>
            <div className="card-body">
              <span className="badge">{item.category}</span>
              <h3>{item.name}</h3>
              <div className="card-colors">
                {item.colors.map((c) => (
                  <span key={c} className="color-dot" title={c} style={{ background: colorMap(c) }} />
                ))}
                <span className="color-names">{item.colors.join(", ")}</span>
              </div>
              <div className="card-footer">
                <strong>${item.price.toLocaleString()}</strong>
                <Link href="/products" className="btn-outline">View Details</Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* ── Load More ── */}
      {visibleCount < filtered.length && (
        <div style={{ textAlign: "center", padding: "0 0 60px" }}>
          <button className="btn" onClick={() => setVisibleCount((v) => v + 12)}>
            Load More ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="emptyState">
          <h2>No products found</h2>
          <p>Try a different search or category.</p>
        </div>
      )}

      {/* ── Why Us ── */}
      <AnimatedSection className="why-section">
        <p className="eyebrow">Why choose</p>
        <h2>SAQR Heritage Exports</h2>
        <div className="why-grid">
          {[
            { icon: "🧵", title: "Handcrafted Quality", desc: "Every piece is hand-woven or hand-made by master artisans using traditional techniques passed down for generations." },
            { icon: "🌍", title: "Worldwide Export", desc: "We ship to 30+ countries. Trusted by luxury hotels, interior designers, and collectors globally." },
            { icon: "🎨", title: "Authentic Designs", desc: "Original Persian, Arabian, and Iranian patterns — not factory reproductions. Real cultural heritage in every thread." },
            { icon: "📦", title: "Wholesale Available", desc: "Bulk pricing for retailers, interior firms, and hospitality projects. Contact us for trade pricing." },
          ].map((w) => (
            <div className="why-card" key={w.title}>
              <span className="why-icon">{w.icon}</span>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* ── Footer ── */}
      <footer>
        <span className="brand">SAQR Heritage Exports</span>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <a href="https://instagram.com/SAQR-47" target="_blank" rel="noopener noreferrer">📸 Instagram: SAQR-47</a>
          <a href="https://wa.me/923704842423" target="_blank" rel="noopener noreferrer">💬 WhatsApp: 0370 4842423</a>
        </div>
        <span>© {new Date().getFullYear()} SAQR Heritage Exports</span>
      </footer>
    </main>
  );
}

function colorMap(name: string): string {
  const map: Record<string, string> = {
    Crimson: "#dc143c", Gold: "#d9a441", Navy: "#1a237e", Ivory: "#fffff0",
    Rose: "#e8a0a0", Cobalt: "#0047ab", "Deep Red": "#8b0000", Cream: "#fffdd0",
    Sapphire: "#0f52ba", Silver: "#c0c0c0", Rust: "#b7410e", Black: "#1a1a1a",
    Saffron: "#f4a300", Teal: "#008080", Burgundy: "#800020", Beige: "#f5f0dc",
    Forest: "#228b22", Red: "#cc2222", Blue: "#2244cc", Brown: "#8b4513",
    Maroon: "#800000", Sand: "#c2b280", Emerald: "#50c878", Camel: "#c19a6b",
    Turquoise: "#40e0d0", Bronze: "#cd7f32", Copper: "#b87333", Tan: "#d2b48c",
    Walnut: "#773b17", Pearl: "#f0ece8", Natural: "#d4c9a8", Ochre: "#cc7722",
    Coral: "#ff7f50", Terracotta: "#e2725b",
  };
  return map[name] ?? "#888";
}