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
  "/dashboard/panduan": "Panduan",
  "/dashboard/profil": "Profil Saya",
}

interface Props {
  userName: string
  userRole: string
  onMenuToggle: () => void
}

export function TopBar({ userName, userRole, onMenuToggle }: Props) {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? "SIMDOM"

  return (
    <div className="h-[60px] border-b border-slate-100 bg-white px-4 md:px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {/* Hamburger — hanya muncul di mobile */}
        <button
          onClick={onMenuToggle}
          className="md:hidden flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        {/* Judul halaman */}
        <div>
          <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
          <p className="text-[10px] text-slate-400 hidden sm:block">Diskominfo Kabupaten Soppeng</p>
        </div>
      </div>

      {/* Kanan */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="hidden sm:block">Online</span>
        </div>
        <div className="h-4 w-px bg-slate-200" />
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