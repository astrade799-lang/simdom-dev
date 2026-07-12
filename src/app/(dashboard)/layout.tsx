import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopLoader } from "@/components/ui/TopLoader"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="flex h-screen bg-slate-50">
      <TopLoader />
      <Sidebar userName={session.user.name} userRole={session.user.role} />
      <main className="flex-1 overflow-y-auto">
        <div className="h-[60px] border-b border-slate-100 bg-white px-6 flex items-center justify-between flex-shrink-0">
          <div />
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Online
          </div>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}