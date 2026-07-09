"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateFindingStatus(findingId: string, status: string, catatan?: string) {
  await prisma.finding.update({
    where: { id: findingId },
    data: { status, updatedAt: new Date() }
  })

  if (catatan) {
    await prisma.findingFollowup.create({
      data: {
        findingId,
        status,
        catatan,
      }
    })
  }

  revalidatePath("/dashboard/monitoring/temuan")
}