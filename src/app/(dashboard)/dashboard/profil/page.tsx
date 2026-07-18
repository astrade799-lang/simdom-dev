import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ProfilForm } from "./_components/ProfilForm"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Profil — SIMDOM" }

export default async function ProfilPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profil Saya</h1>
        <p className="text-sm text-slate-400 mt-0.5">Kelola informasi akun dan keamanan</p>
      </div>
      <ProfilForm
        userId={session.user.id}
        currentEmail={session.user.email ?? ""}
        currentName={session.user.name ?? ""}
      />
    </div>
  )
}