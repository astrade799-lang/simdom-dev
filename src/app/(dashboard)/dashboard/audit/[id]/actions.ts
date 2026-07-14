"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function saveAuditManual(webAppId: string, data: {
  securityGrade: string
  securityStatus: string
  securityUrl: string
  dnsStatus: string
  dnsUrl: string
  teknologi: string
  catatan: string
}) {
  await prisma.auditTeknis.upsert({
    where: { webAppId },
    update: {
      securityGrade: data.securityGrade || null,
      securityStatus: data.securityStatus,
      securityUrl: data.securityUrl || null,
      dnsStatus: data.dnsStatus,
      dnsUrl: data.dnsUrl || null,
      teknologi: data.teknologi || null,
      catatan: data.catatan || null,
    },
    create: {
      webAppId,
      securityGrade: data.securityGrade || null,
      securityStatus: data.securityStatus,
      securityUrl: data.securityUrl || null,
      dnsStatus: data.dnsStatus,
      dnsUrl: data.dnsUrl || null,
      teknologi: data.teknologi || null,
      catatan: data.catatan || null,
    }
  })

  revalidatePath(`/dashboard/audit/${webAppId}`)
}