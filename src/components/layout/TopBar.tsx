"use client"

import { usePathname } from "next/navigation"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/domain": "Domain & Subdomain",
  "/dashboard/monitoring": "Monitoring Layanan",
  "/dashboard/monitoring/temuan": "Manajemen Temuan",
  "/dashboard/audit": "Audit Teknis",
  "/dashboard/executive": "Executive Summary",
  "/dashboard/laporan": "Laporan Aktivitas",
  "/dashboard/skpd": "Data SKPD",
  "/dashboard/users": "Manajemen User",
}

interface Props {
  userName: string
  userRole: string
}

export function TopBar({ userName, userRole }: Props) {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? "SIMDOM"

  return (
    <div className="h-[60px] border-b border-slate-100 bg-white px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
      {/* Kiri — judul halaman */}
      <div>
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        <p className="text-[10px] text-slate-400">Diskominfo Kabupaten Soppeng</p>
      </div>

      {/* Kanan — status + user */}
      <div className="flex items-center gap-4">
        {/* Status online */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>Online</span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-slate-200" />

        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-700 leading-none">{userName}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{userRole}</p>
          </div>
        </div>
      </div>
    </div>
  )
}