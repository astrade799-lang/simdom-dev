import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopLoader } from "@/components/ui/TopLoader"
import { TopBar } from "@/components/layout/TopBar"
import { MobileSidebarWrapper } from "@/components/layout/MobileSidebarWrapper"

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
    <MobileSidebarWrapper
      userName={session.user.name ?? "User"}
      userRole={session.user.role}
    >
      {children}
    </MobileSidebarWrapper>
  )
}