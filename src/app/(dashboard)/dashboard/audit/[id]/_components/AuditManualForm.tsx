"use client"

import { useState } from "react"
import { saveAuditManual } from "../actions"
import { useRouter } from "next/navigation"
import { createLaporanFromAction } from "@/actions/laporan-auto"

interface AuditData {
  securityGrade?: string | null
  securityStatus?: string | null
  securityUrl?: string | null
  dnsStatus?: string | null
  dnsUrl?: string | null
  teknologi?: string | null
  catatan?: string | null
}

interface Props {
  webAppId: string
  audit: AuditData | null
}

export function AuditManualForm({ webAppId, audit }: Props) {
const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showLaporan, setShowLaporan] = useState(false)
const [deskripsiLaporan, setDeskripsiLaporan] = useState("")
const [savingLaporan, setSavingLaporan] = useState(false)
  const [form, setForm] = useState({
    securityGrade: audit?.securityGrade ?? "",
    securityStatus: audit?.securityStatus ?? "BELUM_CEK",
    securityUrl: audit?.securityUrl ?? "",
    dnsStatus: audit?.dnsStatus ?? "BELUM_CEK",
    dnsUrl: audit?.dnsUrl ?? "",
    teknologi: audit?.teknologi ?? "",
    catatan: audit?.catatan ?? "",
  })
  

  async function handleSave() {
  setSaving(true)
  await saveAuditManual(webAppId, form)
  setSaving(false)
  setSaved(true)
  setDeskripsiLaporan(`Melakukan audit teknis manual — security headers, DNS, teknologi, dan catatan diperbarui`)
  setShowLaporan(true)
  // Hapus setTimeout router.push dari sini
}

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-sm font-bold text-slate-900 mb-4">Audit Manual</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Security Headers */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase">Security Headers</label>
          <div className="flex gap-2">
            <select
              value={form.securityStatus}
              onChange={e => setForm(f => ({ ...f, securityStatus: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BELUM_CEK">Belum Cek</option>
              <option value="BAIK">Baik</option>
              <option value="SEDANG">Sedang</option>
              <option value="BURUK">Buruk</option>
            </select>
            <input
              type="text"
              placeholder="Grade (A+/A/B/C)"
              value={form.securityGrade}
              onChange={e => setForm(f => ({ ...f, securityGrade: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="text"
            placeholder="Link hasil (https://securityheaders.com/...)"
            value={form.securityUrl}
            onChange={e => setForm(f => ({ ...f, securityUrl: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* DNS/Email */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase">DNS / Email (MXToolbox)</label>
          <select
            value={form.dnsStatus}
            onChange={e => setForm(f => ({ ...f, dnsStatus: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="BELUM_CEK">Belum Cek</option>
            <option value="BAIK">Baik</option>
            <option value="SEDANG">Sedang</option>
            <option value="BURUK">Buruk</option>
          </select>
          <input
            type="text"
            placeholder="Link hasil (https://mxtoolbox.com/...)"
            value={form.dnsUrl}
            onChange={e => setForm(f => ({ ...f, dnsUrl: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Teknologi */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase">Teknologi (Wappalyzer)</label>
          <input
            type="text"
            placeholder="mis: WordPress 6.4, PHP 8.1, MySQL"
            value={form.teknologi}
            onChange={e => setForm(f => ({ ...f, teknologi: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Catatan */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase">Catatan Umum</label>
          <textarea
            placeholder="Temuan, rekomendasi, atau catatan penting..."
            value={form.catatan}
            onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Menyimpan..." : saved ? "✓ Tersimpan" : "Simpan Audit"}
        </button>
      </div>
	  {showLaporan && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
      <h2 className="text-sm font-bold text-slate-800 mb-1">📋 Catat sebagai Laporan?</h2>
      <p className="text-xs text-slate-400 mb-4">
        Audit teknis ini bisa dicatat sebagai laporan kegiatan admin
      </p>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
          Deskripsi Kegiatan
        </label>
        <textarea
          value={deskripsiLaporan}
          onChange={e => setDeskripsiLaporan(e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => {
            setShowLaporan(false)
            router.push("/dashboard/audit")
          }}
          className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50"
        >
          Lewati
        </button>
        <button
          onClick={async () => {
            setSavingLaporan(true)
            await createLaporanFromAction({
              jenisKegiatan: "Audit Teknis Domain",
              deskripsi: deskripsiLaporan,
              webAppId,
            })
            setSavingLaporan(false)
            setShowLaporan(false)
            router.push("/dashboard/audit")
          }}
          disabled={savingLaporan}
          className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {savingLaporan ? "Menyimpan..." : "Simpan Laporan"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}