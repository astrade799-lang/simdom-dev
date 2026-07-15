import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopLoader } from "@/components/ui/TopLoader"
import { TopBar } from "@/components/layout/TopBar"

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  KABID: "Kabid / Kasubag",
}

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
      <main className="flex-1 overflow-y-auto flex flex-col">
        <TopBar
          userName={session.user.name ?? "User"}
          userRole={ROLE_LABEL[session.user.role] ?? session.user.role}
        />
        <div className="p-6 flex-1">{children}</div>
      </main>
    </div>
  )
}