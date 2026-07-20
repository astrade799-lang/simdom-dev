"use client"

import { useState } from "react"
import { updateProfil, updatePassword } from "../actions"
import { useRouter } from "next/navigation"

interface Props {
  userId: string
  currentEmail: string
  currentName: string
  currentJabatan?: string | null
}
export function ProfilForm({ userId, currentEmail, currentName, currentJabatan }: Props) {
  const [name, setName] = useState(currentName)
  const [email, setEmail] = useState(currentEmail)
  const [savingProfil, setSavingProfil] = useState(false)
  const router = useRouter()
  
  const [profilMsg, setProfilMsg] = useState<{ text: string; ok: boolean } | null>(null)
const [jabatan, setJabatan] = useState(currentJabatan ?? "")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; ok: boolean } | null>(null)

  async function handleSaveProfil() {
    setSavingProfil(true)
    setProfilMsg(null)
	const result = await updateProfil(userId, { name, email, jabatan })
    setSavingProfil(false)
    setProfilMsg({ text: result.message, ok: result.success })
	if (result.success) {
    router.refresh()  // ← tambah ini
  }
  }

  async function handleSavePassword() {
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: "Password baru tidak cocok", ok: false })
      return
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ text: "Password minimal 8 karakter", ok: false })
      return
    }
    setSavingPassword(true)
    setPasswordMsg(null)
    const result = await updatePassword(userId, { oldPassword, newPassword })
    setSavingPassword(false)
    setPasswordMsg({ text: result.message, ok: result.success })
    if (result.success) {
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="space-y-4">
      {/* Info Profil */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-800">Informasi Akun</h2>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Nama</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className={inputClass}
          />
        </div>
		
		<div>
  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Jabatan</label>
  <input
    type="text"
    value={jabatan}
    onChange={e => setJabatan(e.target.value)}
    placeholder="mis: Kepala Dinas, Kabid , Kasubag"
    className={inputClass}
  />
</div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        {profilMsg && (
          <p className={`text-sm ${profilMsg.ok ? 'text-emerald-600' : 'text-red-600'}`}>
            {profilMsg.text}
          </p>
        )}

        <button
          onClick={handleSaveProfil}
          disabled={savingProfil}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {savingProfil ? "Menyimpan..." : "Simpan Profil"}
        </button>
      </div>

      {/* Ganti Password */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-800">Ganti Password</h2>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Password Lama</label>
          <input
            type="password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            className={inputClass}
            placeholder="Masukkan password lama"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Password Baru</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className={inputClass}
            placeholder="Minimal 8 karakter"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Konfirmasi Password Baru</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className={inputClass}
            placeholder="Ulangi password baru"
          />
        </div>

        {passwordMsg && (
          <p className={`text-sm ${passwordMsg.ok ? 'text-emerald-600' : 'text-red-600'}`}>
            {passwordMsg.text}
          </p>
        )}

        <button
          onClick={handleSavePassword}
          disabled={savingPassword}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {savingPassword ? "Menyimpan..." : "Ganti Password"}
        </button>
      </div>
    </div>
  )
}