"use client"

import { useState } from "react"
import { updateFindingStatus } from "../actions"
import { createLaporanFromAction } from "@/actions/laporan-auto"

interface Props {
  findingId: string
  currentStatus: string
  judul: string
  webAppId: string
}

export function UpdateStatusModal({ findingId, currentStatus, judul, webAppId }: Props) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const [catatan, setCatatan] = useState("")
  const [loading, setLoading] = useState(false)

  const [showLaporan, setShowLaporan] = useState(false)
const [deskripsiLaporan, setDeskripsiLaporan] = useState("")
const [savingLaporan, setSavingLaporan] = useState(false)

async function handleSubmit() {
  setLoading(true)
  await updateFindingStatus(findingId, status, catatan)
  setLoading(false)
  setOpen(false)
  setCatatan("")
  // Tampilkan modal laporan
  setDeskripsiLaporan(
    `Menindaklanjuti temuan "${judul}" — status diubah ke ${status}${catatan ? `. Catatan: ${catatan}` : ""}`
  )
  setShowLaporan(true)
}

async function handleSaveLaporan() {
  setSavingLaporan(true)
  await createLaporanFromAction({
    jenisKegiatan: "Tindak Lanjut Temuan",
    deskripsi: deskripsiLaporan,
    webAppId,
  })
  setSavingLaporan(false)
  setShowLaporan(false)
}

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
      >
        Update
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-1">Update Status Temuan</h2>
            <p className="text-xs text-gray-400 mb-4 line-clamp-2">{judul}</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="OPEN">Open</option>
                  <option value="PROGRESS">In Progress</option>
                  <option value="DONE">Selesai</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Catatan Tindak Lanjut <span className="text-gray-400">(opsional)</span>
                </label>
                <textarea
                  value={catatan}
                  onChange={e => setCatatan(e.target.value)}
                  placeholder="Tulis catatan tindak lanjut..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLaporan && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
      <h2 className="text-sm font-bold text-slate-800 mb-1">📋 Catat sebagai Laporan?</h2>
      <p className="text-xs text-slate-400 mb-4">
        Tindakan ini bisa dicatat sebagai laporan kegiatan admin
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
          onClick={() => setShowLaporan(false)}
          className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50"
        >
          Lewati
        </button>
        <button
          onClick={handleSaveLaporan}
          disabled={savingLaporan}
          className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {savingLaporan ? "Menyimpan..." : "Simpan Laporan"}
        </button>
      </div>
    </div>
  </div>
)}
    </>
  )
}