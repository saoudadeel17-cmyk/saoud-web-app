import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <div className="emptyState" style={{ paddingTop: "100px" }}>
        <h2>404 — Page Not Found</h2>
        <p style={{ marginBottom: "24px" }}>This page doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="btn">Back to Home</Link>
      </div>
    </main>
  );
}
