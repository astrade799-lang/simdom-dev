"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"
import { TopLoader } from "@/components/ui/TopLoader"
import type { Role } from "@prisma/client"

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  KABID: "Kabid / Kasubag",
}

interface Props {
  userName: string
  userRole: Role
  children: React.ReactNode
}

export function MobileSidebarWrapper({ userName, userRole, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Tutup sidebar saat navigasi
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="flex h-screen bg-slate-50">
      <TopLoader />

      {/* Sidebar desktop — selalu tampil */}
      <div className="hidden md:block flex-shrink-0">
        <Sidebar userName={userName} userRole={userRole} />
      </div>

      {/* Sidebar mobile — overlay */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">
            <Sidebar userName={userName} userRole={userRole} />
          </div>
        </>
      )}

      {/* Konten utama */}
      <main className="flex-1 overflow-y-auto flex flex-col min-w-0">
        <TopBar
          userName={userName}
          userRole={ROLE_LABEL[userRole] ?? userRole}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
        />
        <div className="p-4 md:p-6 flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}