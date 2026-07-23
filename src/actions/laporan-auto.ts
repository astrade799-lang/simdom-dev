"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function createLaporanFromAction({
  jenisKegiatan,
  deskripsi,
  webAppId,
}: {
  jenisKegiatan: string
  deskripsi: string
  webAppId?: string
}) {
  const session = await auth()
  console.log('[LAPORAN-AUTO] session:', session?.user?.id)
  console.log('[LAPORAN-AUTO] webAppId:', webAppId)

  if (!session?.user) {
    console.log('[LAPORAN-AUTO] No session, returning')
    return { success: false }
  }

  try {
    const result = await prisma.activityReport.create({
  data: {
    jenisKegiatan,
    deskripsi,
    tanggal: new Date(),
    status: "PENDING",
    createdById: session.user.id,
    webAppId: webAppId ?? undefined,
  }
})
    console.log('[LAPORAN-AUTO] Created:', result.id)
    revalidatePath("/dashboard/laporan")
    return { success: true }
  } catch (err) {
    console.error('[LAPORAN-AUTO] Error:', err)
    return { success: false }
  }
}