import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <nav className="nav">
        <strong className="brand">SAQR Heritage Exports</strong>
        <div><Link href="/">Home</Link></div>
      </nav>
      <div className="emptyState" style={{ paddingTop: "100px" }}>
        <h2>404 — Page Not Found</h2>
        <p style={{ marginBottom: "24px" }}>This page doesn't exist or has been moved.</p>
        <Link href="/" className="btn">Back to Home</Link>
      </div>
    </main>
  );
}