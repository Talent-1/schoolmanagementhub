"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTermAction(formData: FormData) {
  const name = formData.get("name") as string;
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = new Date(formData.get("endDate") as string);
  const schoolId = formData.get("schoolId") as string;

  await prisma.term.updateMany({
    where: { schoolId },
    data: { isActive: false }
  });

  await prisma.term.create({
    data: { name, startDate, endDate, schoolId, isActive: true }
  });

  revalidatePath("/dashboard/admin/terms");
}

export async function deleteTermAction(id: string) {
  await prisma.term.delete({ where: { id } });
  revalidatePath("/dashboard/admin/terms");
}

export async function toggleTermActiveAction(id: string, schoolId: string) {
  // Deactivate all first
  await prisma.term.updateMany({ where: { schoolId }, data: { isActive: false } });
  // Activate selected
  await prisma.term.update({ where: { id }, data: { isActive: true } });
  revalidatePath("/dashboard/admin/terms");
}