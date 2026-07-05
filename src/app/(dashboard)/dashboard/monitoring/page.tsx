import { prisma } from "@/lib/prisma";

interface Props {
  searchParams: Promise<{ skpd?: string; status?: string }>
}

export default async function MonitoringPage({ searchParams }: Props) {
  const params = await searchParams;
  const { skpd, status } = params;

  const skpdList = await prisma.skpd.findMany({
    orderBy: { singkatan: "asc" },
    select: { id: true, singkatan: true }
  });

  const webApps = await prisma.webApp.findMany({
    where: {
      status: "AKTIF",
      ...(skpd ? { skpdId: skpd } : {})
    },
    include: {
      skpd: { select: { singkatan: true } },
      checks: { orderBy: { checkedAt: "desc" }, take: 1 },
      sslChecks: { orderBy: { checkedAt: "desc" }, take: 1 },
      securityHeaderChecks: { orderBy: { checkedAt: "desc" }, take: 1 },
    },
    orderBy: { nama: "asc" }
  });

  // Filter status di aplikasi (bukan DB) karena data dari relasi
  const filtered = webApps.filter(app => {
    if (!status) return true;
    const isOnline = app.checks[0]?.isOnline;
    if (status === "online") return isOnline === true;
    if (status === "offline") return isOnline === false;
    if (status === "unchecked") return !app.checks[0];
    return true;
  });

  const online = webApps.filter(w => w.checks[0]?.isOnline).length;
  const offline = webApps.filter(w => w.checks[0] && !w.checks[0].isOnline).length;
  const sslExpired = webApps.filter(w => w.sslChecks[0] && !w.sslChecks[0].isValid).length;
  const belumDicek = webApps.filter(w => !w.checks[0]).length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Monitoring Layanan Digital</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 text-white rounded-lg p-4">
          <p className="text-sm opacity-80">Total Domain</p>
          <p className="text-3xl font-bold">{webApps.length}</p>
        </div>
        <div className="bg-green-500 text-white rounded-lg p-4">
          <p className="text-sm opacity-80">Online</p>
          <p className="text-3xl font-bold">{online}</p>
        </div>
        <div className="bg-red-500 text-white rounded-lg p-4">
          <p className="text-sm opacity-80">Offline</p>
          <p className="text-3xl font-bold">{offline}</p>
        </div>
        <div className="bg-yellow-500 text-white rounded-lg p-4">
          <p className="text-sm opacity-80">SSL Bermasalah</p>
          <p className="text-3xl font-bold">{sslExpired}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 flex gap-4 items-center flex-wrap">
        <form method="GET" className="flex gap-3 items-center flex-wrap w-full">
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
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="unchecked">Belum Dicek</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            Filter
          </button>

          {(skpd || status) && (
            <a href="/dashboard/monitoring" className="text-sm text-gray-400 hover:text-gray-600">
              Reset
            </a>
          )}

          <span className="ml-auto text-sm text-gray-400">
            Menampilkan {filtered.length} dari {webApps.length} domain
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
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">HTTP</th>
              <th className="px-4 py-3 text-center">Response</th>
              <th className="px-4 py-3 text-center">SSL</th>
              <th className="px-4 py-3 text-center">Headers</th>
              <th className="px-4 py-3 text-center">Terakhir Dicek</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  Tidak ada data yang sesuai filter
                </td>
              </tr>
            ) : filtered.map((app) => {
              const check = app.checks[0];
              const ssl = app.sslChecks[0];
              const headers = app.securityHeaderChecks[0];
              const isOnline = check?.isOnline;

              return (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <a href={app.url} target="_blank" className="text-blue-600 hover:underline text-xs">
                      {app.url.replace('https://', '')}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{app.skpd.singkatan}</td>
                  <td className="px-4 py-3 text-center">
                    {check ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {isOnline ? 'Online' : 'Offline'}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500">
                        Belum Dicek
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-500">
                    {check?.statusCode ?? '-'}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-500">
                    {check?.responseTime ? `${check.responseTime}ms` : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {ssl ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ssl.isValid
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {ssl.isValid ? `Valid (${ssl.daysRemaining}h)` : 'Expired'}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {headers ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        headers.score >= 75 ? 'bg-green-100 text-green-700' :
                        headers.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {headers.score}/100
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400">
                    {check
                      ? new Date(check.checkedAt).toLocaleString('id-ID', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })
                      : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}