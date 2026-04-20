import { AdminSidebar } from "@/src/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}
