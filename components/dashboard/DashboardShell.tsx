import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <div className="dashboard-main">{children}</div>
    </div>
  )
}
