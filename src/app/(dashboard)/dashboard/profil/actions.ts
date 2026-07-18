"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function updateProfil(userId: string, data: { name: string; email: string }) {
  try {
    const existing = await prisma.user.findFirst({
      where: { email: data.email, NOT: { id: userId } }
    })
    if (existing) return { success: false, message: "Email sudah digunakan akun lain" }

    await prisma.user.update({
      where: { id: userId },
      data: { name: data.name, email: data.email }
    })

    revalidatePath("/dashboard/profil")
    return { success: true, message: "Profil berhasil diperbarui" }
  } catch {
    return { success: false, message: "Gagal memperbarui profil" }
  }
}

export async function updatePassword(userId: string, data: { oldPassword: string; newPassword: string }) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return { success: false, message: "User tidak ditemukan" }

    const valid = await bcrypt.compare(data.oldPassword, user.password)
    if (!valid) return { success: false, message: "Password lama tidak sesuai" }

    const hashed = await bcrypt.hash(data.newPassword, 12)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed }
    })

    return { success: true, message: "Password berhasil diubah" }
  } catch {
    return { success: false, message: "Gagal mengubah password" }
  }
}