import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function DashboardSettingsPage() {
  return (
    <main>
      <Navbar />
      <section className="section">
        <h1>Settings</h1>
        <p style={{ color: "#b8a080" }}>Account settings and preferences will be available here.</p>
      </section>
      <Footer />
    </main>
  );
}
