import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DashboardShell from '@/components/dashboard/DashboardShell'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar />
      <DashboardShell>{children}</DashboardShell>
      <Footer />
    </main>
  )
}
