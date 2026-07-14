import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
}

export default async function AuditDetailPage({ params }: Props) {
  const { id } = await params

  const webApp = await prisma.webApp.findUnique({
    where: { id },
    include: {
      skpd: { select: { nama: true, singkatan: true } },
      auditTeknis: true,
      checks: { orderBy: { checkedAt: "desc" }, take: 1 },
      sslChecks: { orderBy: { checkedAt: "desc" }, take: 1 },
      securityHeaderChecks: { orderBy: { checkedAt: "desc" }, take: 1 },
      findings: { where: { status: { in: ["OPEN", "PROGRESS"] } } }
    }
  })

  if (!webApp) notFound()

  const audit = webApp.auditTeknis
  const check = webApp.checks[0]
  const ssl = webApp.sslChecks[0]
  const headers = webApp.securityHeaderChecks[0]

  const scoreColor = (score: number | null | undefined) => {
    if (!score) return "text-gray-400"
    if (score >= 90) return "text-emerald-600"
    if (score >= 50) return "text-amber-600"
    return "text-red-600"
  }

  const scoreBg = (score: number | null | undefined) => {
    if (score === null || score === undefined) return "bg-gray-100 text-gray-500"
    if (score >= 90) return "bg-emerald-100 text-emerald-700"
    if (score >= 50) return "bg-amber-100 text-amber-700"
    return "bg-red-100 text-red-700"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/audit" className="text-sm text-gray-400 hover:text-gray-600">
          ← Audit Teknis
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-600">{webApp.url.replace('https://', '')}</span>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{webApp.nama}</h1>
          <a href={webApp.url} target="_blank" className="text-sm text-blue-600 hover:underline">
            {webApp.url}
          </a>
          <p className="text-xs text-gray-400 mt-1">{webApp.skpd.nama}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          check?.isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {check?.isOnline ? '● Online' : '● Offline'}
        </span>
      </div>

      {/* Status Teknis */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">HTTP Status</p>
          <p className="text-2xl font-bold text-gray-700">{check?.statusCode ?? '-'}</p>
          <p className="text-xs text-gray-400 mt-1">
            {check?.responseTime ? `${check.responseTime}ms` : '-'}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">SSL Certificate</p>
          <p className={`text-2xl font-bold ${ssl?.isValid ? 'text-emerald-600' : 'text-red-600'}`}>
            {ssl ? (ssl.isValid ? 'Valid' : 'Invalid') : '-'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {ssl?.daysRemaining ? `${ssl.daysRemaining} hari tersisa` : ssl?.issuer ?? '-'}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Security Headers</p>
          <p className={`text-2xl font-bold ${scoreColor(headers?.score)}`}>
            {headers?.score !== null && headers?.score !== undefined ? `${headers.score}/100` : '-'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {headers ? `HSTS:${headers.hasHsts ? '✓' : '✗'} XFrame:${headers.hasXFrame ? '✓' : '✗'} CSP:${headers.hasCsp ? '✓' : '✗'}` : '-'}
          </p>
        </div>
      </div>

      {/* PageSpeed */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900">PageSpeed Score</h2>
          <p className="text-xs text-gray-400">
            {audit?.pageSpeedCheckedAt
              ? `Dicek: ${new Date(audit.pageSpeedCheckedAt).toLocaleDateString('id-ID')}`
              : 'Belum dicek'}
          </p>
        </div>

        {audit?.pageSpeedScore ? (
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: "Overall", value: audit.pageSpeedScore },
              { label: "Performance", value: audit.pageSpeedPerformance },
              { label: "Accessibility", value: audit.pageSpeedAccessibility },
              { label: "Best Practices", value: audit.pageSpeedBestPractices },
              { label: "SEO", value: audit.pageSpeedSeo },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-xl font-bold ${scoreBg(item.value)}`}>
                  {item.value ?? '-'}
                </div>
                <p className="text-xs text-gray-500 mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400 text-sm">
            PageSpeed belum dicek — worker akan cek otomatis jam 07.00
          </div>
        )}
      </div>

      {/* Audit Manual */}
      <AuditManualForm webAppId={webApp.id} audit={audit} />

      {/* Temuan Aktif */}
      {webApp.findings.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Temuan Aktif ({webApp.findings.length})</h2>
          <div className="space-y-2">
            {webApp.findings.map(f => (
              <div key={f.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-red-50">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  f.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>{f.severity}</span>
                <p className="text-xs text-gray-700 flex-1">{f.judul}</p>
                <span className="text-xs text-gray-400">{f.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Komponen form audit manual — client component
import { AuditManualForm } from "./_components/AuditManualForm"