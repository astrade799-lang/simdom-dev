"use client"

import { useState } from "react"
import { generateTemuanPDF } from "@/lib/pdf-monitoring"

interface Props {
  data: {
    open: number
    progress: number
    done: number
    findings: {
      domain: string
      skpd: string
      judul: string
      deskripsi: string | null
      severity: string
      status: string
      createdAt: string
    }[]
  }
}

export function ExportTemuanPDFButton({ data }: Props) {
  const [loading, setLoading] = useState(false)

  function handleExport() {
    setLoading(true)
    try {
      generateTemuanPDF({
        ...data,
        generatedAt: new Date().toLocaleString("id-ID")
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      </svg>
      {loading ? "Membuat PDF..." : "Export PDF"}
    </button>
  )
}