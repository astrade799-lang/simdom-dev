import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function ExecutivePage() {
  const [
    totalDomain,
    online,
    offline,
    sslExpired,
    temuanOpen,
    temuanProgress,
    temuanDone,
    skpdStats,
    temuanTerbaru,
  ] = await Promise.all([
    prisma.webApp.count({ where: { status: "AKTIF" } }),
    prisma.webApp.count({
      where: {
        status: "AKTIF",
        checks: { some: { isOnline: true, checkedAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 48) } } }
      }
    }),
    prisma.webApp.count({
      where: {
        status: "AKTIF",
        checks: { some: { isOnline: false, checkedAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 48) } } }
      }
    }),
    prisma.webApp.count({
      where: {
        status: "AKTIF",
        sslChecks: { some: { isValid: false, checkedAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 48) } } }
      }
    }),
    prisma.finding.count({ where: { status: "OPEN" } }),
    prisma.finding.count({ where: { status: "PROGRESS" } }),
    prisma.finding.count({ where: { status: "DONE" } }),
    prisma.skpd.findMany({
      select: {
        id: true,
        nama: true,
        singkatan: true,
        webApps: {
          where: { status: "AKTIF" },
          select: {
            checks: { orderBy: { checkedAt: "desc" }, take: 1, select: { isOnline: true } },
            sslChecks: { orderBy: { checkedAt: "desc" }, take: 1, select: { isValid: true } },
            findings: { where: { status: "OPEN" }, select: { id: true } }
          }
        }
      },
      orderBy: { nama: "asc" }
    }),
    prisma.finding.findMany({
      where: { status: { in: ["OPEN", "PROGRESS"] } },
      include: {
        webApp: { select: { url: true, skpd: { select: { singkatan: true } } } }
      },
      orderBy: { createdAt: "desc" },
      take: 10
    })
  ])

  const onlinePct = totalDomain > 0 ? Math.round((online / totalDomain) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Executive Summary</h1>
          <p className="text-sm text-slate-400 mt-0.5">Ringkasan kondisi layanan digital Kabupaten Soppeng</p>
        </div>
        <p className="text-xs text-slate-400">
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* KPI Utama */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Layanan Digital", value: totalDomain, sub: "Domain aktif", color: "from-blue-600 to-blue-700", shadow: "shadow-blue-200" },
          { label: "Layanan Online", value: online, sub: `${onlinePct}% dari total`, color: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-200" },
          { label: "Layanan Offline", value: offline, sub: "Tidak dapat diakses", color: "from-red-500 to-red-600", shadow: "shadow-red-200" },
          { label: "SSL Bermasalah", value: sslExpired, sub: "Perlu diperbaiki", color: "from-amber-500 to-orange-500", shadow: "shadow-amber-200" },
        ].map((kpi) => (
          <div key={kpi.label} className={`rounded-2xl bg-gradient-to-br ${kpi.color} p-5 text-white shadow-lg ${kpi.shadow}`}>
            <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">{kpi.label}</p>
            <p className="text-4xl font-bold mt-2">{kpi.value}</p>
            <p className="text-xs text-white/70 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Status Temuan */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Temuan Open", value: temuanOpen, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
          { label: "Dalam Proses", value: temuanProgress, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
          { label: "Selesai Ditangani", value: temuanDone, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
        ].map((item) => (
          <div key={item.label} className={`rounded-2xl border ${item.border} ${item.bg} p-5`}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</p>
            <p className={`text-4xl font-bold mt-2 ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Kondisi per SKPD */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-4">Kondisi Layanan per SKPD</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-2 text-left">SKPD</th>
                <th className="px-4 py-2 text-center">Total</th>
                <th className="px-4 py-2 text-center">Online</th>
                <th className="px-4 py-2 text-center">Offline</th>
                <th className="px-4 py-2 text-center">SSL Masalah</th>
                <th className="px-4 py-2 text-center">Temuan Aktif</th>
                <th className="px-4 py-2 text-left">Kondisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {skpdStats.map((skpd) => {
                const total = skpd.webApps.length
                const skpdOnline = skpd.webApps.filter(w => w.checks[0]?.isOnline).length
                const skpdOffline = skpd.webApps.filter(w => w.checks[0] && !w.checks[0].isOnline).length
                const skpdSslMasalah = skpd.webApps.filter(w => w.sslChecks[0] && !w.sslChecks[0].isValid).length
                const skpdTemuan = skpd.webApps.reduce((acc, w) => acc + w.findings.length, 0)
                const pct = total > 0 ? Math.round((skpdOnline / total) * 100) : 0

                return (
                  <tr key={skpd.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium text-slate-700 text-xs">{skpd.singkatan}</td>
                    <td className="px-4 py-2 text-center text-xs text-slate-500">{total}</td>
                    <td className="px-4 py-2 text-center text-xs text-emerald-600 font-medium">{skpdOnline}</td>
                    <td className="px-4 py-2 text-center text-xs text-red-600 font-medium">{skpdOffline}</td>
                    <td className="px-4 py-2 text-center text-xs text-amber-600 font-medium">{skpdSslMasalah}</td>
                    <td className="px-4 py-2 text-center">
                      {skpdTemuan > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 font-medium">{skpdTemuan}</span>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
                          <div
                            className={`h-1.5 rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 w-8">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Temuan Terbaru */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900">Temuan Terbaru yang Perlu Ditangani</h2>
          <Link href="/dashboard/monitoring/temuan" className="text-xs text-blue-600 hover:text-blue-700">
            Lihat semua →
          </Link>
        </div>
        <div className="space-y-2">
          {temuanTerbaru.map((f) => (
            <div key={f.id} className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-50">
              <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                f.severity === "HIGH" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
              }`}>
                {f.severity}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{f.judul}</p>
                <p className="text-xs text-slate-400">{f.webApp.skpd.singkatan} · {f.webApp.url.replace("https://", "")}</p>
              </div>
              <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                f.status === "OPEN" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
              }`}>
                {f.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}