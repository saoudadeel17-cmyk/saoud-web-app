import Link from "next/link";

export default function ContactPage() {
  return (
    <main>
      <nav className="nav">
        <strong className="brand">Contact</strong>
        <div><Link href="/">Home</Link><Link href="/products">Shop</Link></div>
      </nav>

      <section className="section">
        <h1>Contact SAQR Heritage Exports</h1>
        <p style={{ color: "#b8a080", maxWidth: "560px", marginBottom: "8px" }}>
          We export Persian rugs, Arabian mats, and handmade traditional crafts worldwide. Reach out for bulk orders, wholesale pricing, or shipping inquiries.
        </p>

        <div className="contactGrid">
          <div className="contactCard">
            <h3>Instagram</h3>
            <a href="https://instagram.com/SAQR-47" target="_blank" rel="noopener noreferrer">@SAQR-47</a>
          </div>
          <div className="contactCard">
            <h3>WhatsApp</h3>
            <a href="https://wa.me/923704842423" target="_blank" rel="noopener noreferrer">0370 4842423</a>
          </div>
          <div className="contactCard">
            <h3>Business Hours</h3>
            <span style={{ color: "#fff7e8", fontSize: "15px" }}>Mon – Sat, 9am – 8pm PKT</span>
          </div>
          <div className="contactCard">
            <h3>Based In</h3>
            <span style={{ color: "#fff7e8", fontSize: "15px" }}>Pakistan · Exporting Worldwide</span>
          </div>
        </div>
      </section>
    </main>
  );
}