import { prisma } from "@/lib/prisma";
import { UpdateStatusModal } from "./_components/UpdateStatusModal"
import { ExportTemuanPDFButton } from "./_components/ExportTemuanPDFButton"

interface Props {
  searchParams: Promise<{ status?: string; skpd?: string }>
}

export default async function TemuanPage({ searchParams }: Props) {
  const params = await searchParams;
  const { status, skpd } = params;

  const skpdList = await prisma.skpd.findMany({
    orderBy: { singkatan: "asc" },
    select: { id: true, singkatan: true }
  });

  const findings = await prisma.finding.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(skpd ? { webApp: { skpdId: skpd } } : {})
    },
    include: {
      webApp: {
        select: { nama: true, url: true, skpd: { select: { singkatan: true } } }
      },
      followups: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    },
    orderBy: [
      { status: "asc" },
      { createdAt: "desc" }
    ]
  });

  const open = findings.filter(f => f.status === "OPEN").length;
  const inProgress = findings.filter(f => f.status === "PROGRESS").length;
  const done = findings.filter(f => f.status === "DONE").length;

  const severityColor = (s: string) => {
    if (s === "HIGH") return "bg-red-100 text-red-700";
    if (s === "MEDIUM") return "bg-yellow-100 text-yellow-700";
    return "bg-blue-100 text-blue-700";
  };

  const statusColor = (s: string) => {
    if (s === "OPEN") return "bg-red-100 text-red-700";
    if (s === "PROGRESS") return "bg-yellow-100 text-yellow-700";
    if (s === "DONE") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-500";
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
  <h1 className="text-2xl font-bold">Manajemen Temuan</h1>
  <ExportTemuanPDFButton data={{
    open,
    progress: inProgress,
    done,
    findings: findings.map(f => ({
      domain: f.webApp.url,
      skpd: f.webApp.skpd.singkatan,
      judul: f.judul,
      deskripsi: f.deskripsi,
      severity: f.severity,
      status: f.status,
      createdAt: new Date(f.createdAt).toLocaleDateString("id-ID")
    }))
  }} />
</div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-500 text-white rounded-lg p-4">
          <p className="text-sm opacity-80">Open</p>
          <p className="text-3xl font-bold">{open}</p>
        </div>
        <div className="bg-yellow-500 text-white rounded-lg p-4">
          <p className="text-sm opacity-80">In Progress</p>
          <p className="text-3xl font-bold">{inProgress}</p>
        </div>
        <div className="bg-green-500 text-white rounded-lg p-4">
          <p className="text-sm opacity-80">Selesai</p>
          <p className="text-3xl font-bold">{done}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <form method="GET" className="flex gap-3 items-center flex-wrap">
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

          <select
            name="status"
            defaultValue={status || ""}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="OPEN">Open</option>
            <option value="PROGRESS">In Progress</option>
            <option value="DONE">Selesai</option>
          </select>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            Filter
          </button>

          {(status || skpd) && (
            <a href="/dashboard/monitoring/temuan" className="text-sm text-gray-400 hover:text-gray-600">
              Reset
            </a>
          )}

          <span className="ml-auto text-sm text-gray-400">
            {findings.length} temuan
          </span>
        </form>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Domain</th>
              <th className="px-4 py-3 text-left">SKPD</th>
              <th className="px-4 py-3 text-left">Temuan</th>
              <th className="px-4 py-3 text-center">Severity</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Dibuat</th>
			  <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {findings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Tidak ada temuan
                </td>
              </tr>
            ) : findings.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <a href={f.webApp.url} target="_blank" className="text-blue-600 hover:underline text-xs">
                    {f.webApp.url.replace('https://', '')}
                  </a>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {f.webApp.skpd.singkatan}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800 text-xs">{f.judul}</p>
                  {f.deskripsi && (
                    <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{f.deskripsi}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColor(f.severity)}`}>
                    {f.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(f.status)}`}>
                    {f.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-xs text-gray-400">
                  {new Date(f.createdAt).toLocaleDateString('id-ID', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                  })}
                </td>
				<td className="px-4 py-3 text-center">
  <UpdateStatusModal
    findingId={f.id}
    currentStatus={f.status}
    judul={f.judul}
  />
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}