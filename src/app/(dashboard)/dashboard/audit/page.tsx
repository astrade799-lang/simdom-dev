import { prisma } from "@/lib/prisma"
import Link from "next/link"

interface Props {
  searchParams: Promise<{ skpd?: string }>
}

export default async function AuditPage({ searchParams }: Props) {
  const params = await searchParams
  const { skpd, diaudit } = params  // ← destructure di sini

  const skpdList = await prisma.skpd.findMany({
    orderBy: { singkatan: "asc" },
    select: { id: true, singkatan: true }
  })

  const diauditFilter = diaudit === "true"  // ← rename biar tidak konflik

  const webApps = await prisma.webApp.findMany({
    where: {
      status: "AKTIF",
      ...(skpd ? { skpdId: skpd } : {}),
      ...(diauditFilter ? { auditTeknis: { pageSpeedScore: { not: null } } } : {})
    },
    include: {
      skpd: { select: { singkatan: true } },
      auditTeknis: true,
    },
    orderBy: { nama: "asc" }
  })

  const sudahDicek = webApps.filter(w => w.auditTeknis?.pageSpeedScore !== null && w.auditTeknis?.pageSpeedScore !== undefined).length
  const belumDicek = webApps.length - sudahDicek
  const avgScore = sudahDicek > 0
    ? Math.round(webApps.reduce((acc, w) => acc + (w.auditTeknis?.pageSpeedScore ?? 0), 0) / sudahDicek)
    : 0

  const scoreColor = (score: number | null | undefined) => {
    if (!score) return "text-gray-400"
    if (score >= 90) return "text-emerald-600"
    if (score >= 50) return "text-amber-600"
    return "text-red-600"
  }

  const scoreBg = (score: number | null | undefined) => {
    if (!score) return "bg-gray-100 text-gray-400"
    if (score >= 90) return "bg-emerald-100 text-emerald-700"
    if (score >= 50) return "bg-amber-100 text-amber-700"
    return "bg-red-100 text-red-700"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Teknis Domain</h1>
          <p className="text-sm text-slate-400 mt-0.5">Hasil audit performa dan keamanan per domain</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
  <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-lg shadow-blue-200">
    <p className="text-xs font-semibold text-blue-100 uppercase tracking-wider">Total Domain</p>
    <p className="text-4xl font-bold mt-2">{webApps.length}</p>
  </div>
  <Link href="/dashboard/audit?diaudit=true" className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-lg shadow-emerald-200 hover:opacity-90 transition-opacity">
    <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Sudah Diaudit</p>
    <p className="text-4xl font-bold mt-2">{sudahDicek}</p>
    <p className="text-xs text-emerald-100 mt-1">Klik untuk filter</p>
  </Link>
  <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-violet-700 p-5 text-white shadow-lg shadow-violet-200">
    <p className="text-xs font-semibold text-violet-100 uppercase tracking-wider">Rata-rata Score</p>
    <p className="text-4xl font-bold mt-2">{avgScore > 0 ? `${avgScore}/100` : '-'}</p>
    <p className="text-xs text-violet-100 mt-1">PageSpeed overall</p>
  </div>
</div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <form method="GET" className="flex gap-3 items-center">
          <select
            name="skpd"
            defaultValue={skpd || ""}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua SKPD</option>
            {skpdList.map(s => (
              <option key={s.id} value={s.id}>{s.singkatan}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            Filter
          </button>
          {skpd && (
            <a href="/dashboard/audit" className="text-sm text-gray-400 hover:text-gray-600">Reset</a>
          )}
          <span className="ml-auto text-sm text-gray-400">{webApps.length} domain</span>
        </form>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Domain</th>
              <th className="px-4 py-3 text-left">SKPD</th>
              <th className="px-4 py-3 text-center">Overall</th>
              <th className="px-4 py-3 text-center">Performance</th>
              <th className="px-4 py-3 text-center">Accessibility</th>
              <th className="px-4 py-3 text-center">Best Practice</th>
              <th className="px-4 py-3 text-center">SEO</th>
              <th className="px-4 py-3 text-center">Terakhir Dicek</th>
			  <th className="px-4 py-3 text-center">Audit Manual</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {webApps.map((app) => {
              const audit = app.auditTeknis
              return (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <a href={app.url} target="_blank" className="text-blue-600 hover:underline text-xs">
                      {app.url.replace('https://', '')}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{app.skpd.singkatan}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${scoreBg(audit?.pageSpeedScore)}`}>
                      {audit?.pageSpeedScore ?? '-'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-center text-xs font-medium ${scoreColor(audit?.pageSpeedPerformance)}`}>
                    {audit?.pageSpeedPerformance ?? '-'}
                  </td>
                  <td className={`px-4 py-3 text-center text-xs font-medium ${scoreColor(audit?.pageSpeedAccessibility)}`}>
                    {audit?.pageSpeedAccessibility ?? '-'}
                  </td>
                  <td className={`px-4 py-3 text-center text-xs font-medium ${scoreColor(audit?.pageSpeedBestPractices)}`}>
                    {audit?.pageSpeedBestPractices ?? '-'}
                  </td>
                  <td className={`px-4 py-3 text-center text-xs font-medium ${scoreColor(audit?.pageSpeedSeo)}`}>
                    {audit?.pageSpeedSeo ?? '-'}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400">
                    {audit?.pageSpeedCheckedAt
                      ? new Date(audit.pageSpeedCheckedAt).toLocaleDateString('id-ID')
                      : 'Belum dicek'}
                  </td>
				  <td className="px-4 py-3 text-center text-xs text-gray-400">
  {audit?.updatedAt && audit?.securityStatus !== "BELUM_CEK" || audit?.teknologi || audit?.catatan
    ? new Date(audit.updatedAt).toLocaleDateString('id-ID', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      })
    : <span className="text-gray-300">Belum diaudit</span>
  }
</td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/dashboard/audit/${app.id}`}
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}