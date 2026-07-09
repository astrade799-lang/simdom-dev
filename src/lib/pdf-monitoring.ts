import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface MonitoringData {
  generatedAt: string
  totalDomain: number
  online: number
  offline: number
  sslExpired: number
  temuanAktif: number
  domains: {
    nama: string
    url: string
    skpd: string
    status: string
    statusCode: number | null
    responseTime: number | null
    sslValid: boolean | null
    sslDays: number | null
    headersScore: number | null
    checkedAt: string | null
  }[]
  findings: {
    domain: string
    skpd: string
    judul: string
    severity: string
    status: string
    createdAt: string
  }[]
}

export function generateMonitoringPDF(data: MonitoringData) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
  const pageWidth = doc.internal.pageSize.getWidth()

  // Header
  doc.setFillColor(29, 78, 216)
  doc.rect(0, 0, pageWidth, 25, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("LAPORAN MONITORING LAYANAN DIGITAL", pageWidth / 2, 10, { align: "center" })
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text("Diskominfo Kabupaten Soppeng", pageWidth / 2, 17, { align: "center" })
  doc.text(`Digenerate: ${data.generatedAt}`, pageWidth / 2, 22, { align: "center" })

  // KPI Summary
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("RINGKASAN EKSEKUTIF", 14, 34)

  const kpiY = 38
  const kpiData = [
    { label: "Total Domain", value: data.totalDomain, color: [59, 130, 246] as [number, number, number] },
    { label: "Online", value: data.online, color: [34, 197, 94] as [number, number, number] },
    { label: "Offline", value: data.offline, color: [239, 68, 68] as [number, number, number] },
    { label: "SSL Bermasalah", value: data.sslExpired, color: [234, 179, 8] as [number, number, number] },
    { label: "Temuan Aktif", value: data.temuanAktif, color: [249, 115, 22] as [number, number, number] },
  ]

  kpiData.forEach((kpi, i) => {
    const x = 14 + i * 54
    doc.setFillColor(...kpi.color)
    doc.roundedRect(x, kpiY, 50, 18, 2, 2, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(7)
    doc.setFont("helvetica", "normal")
    doc.text(kpi.label, x + 25, kpiY + 6, { align: "center" })
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text(String(kpi.value), x + 25, kpiY + 14, { align: "center" })
  })

  // Tabel Domain
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("DETAIL STATUS DOMAIN", 14, kpiY + 26)

  autoTable(doc, {
    startY: kpiY + 29,
    head: [["Domain", "SKPD", "Status", "HTTP", "Response", "SSL", "Headers Score", "Terakhir Dicek"]],
    body: data.domains.map(d => [
      d.url.replace("https://", ""),
      d.skpd,
      d.status,
      d.statusCode?.toString() ?? "-",
      d.responseTime ? `${d.responseTime}ms` : "-",
      d.sslValid === null ? "-" : d.sslValid ? `Valid (${d.sslDays}h)` : "Expired",
      d.headersScore !== null ? `${d.headersScore}/100` : "-",
      d.checkedAt ?? "-"
    ]),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [29, 78, 216], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    didParseCell: (hookData) => {
      if (hookData.section === "body" && hookData.column.index === 2) {
        const val = hookData.cell.raw as string
        if (val === "Online") hookData.cell.styles.textColor = [21, 128, 61]
        if (val === "Offline") hookData.cell.styles.textColor = [185, 28, 28]
      }
    }
  })

  // Halaman Temuan
  if (data.findings.length > 0) {
    doc.addPage()

    doc.setFillColor(29, 78, 216)
    doc.rect(0, 0, pageWidth, 20, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("DAFTAR TEMUAN AKTIF", pageWidth / 2, 13, { align: "center" })

    doc.setTextColor(0, 0, 0)
    autoTable(doc, {
      startY: 25,
      head: [["Domain", "SKPD", "Temuan", "Severity", "Status", "Tanggal"]],
      body: data.findings.map(f => [
        f.domain.replace("https://", ""),
        f.skpd,
        f.judul,
        f.severity,
        f.status,
        f.createdAt
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [29, 78, 216], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      didParseCell: (hookData) => {
        if (hookData.section === "body" && hookData.column.index === 3) {
          const val = hookData.cell.raw as string
          if (val === "HIGH") hookData.cell.styles.textColor = [185, 28, 28]
          if (val === "MEDIUM") hookData.cell.styles.textColor = [161, 98, 7]
        }
      }
    })
  }

  const date = new Date().toISOString().split("T")[0]
  doc.save(`laporan-monitoring-soppeng-${date}.pdf`)
}