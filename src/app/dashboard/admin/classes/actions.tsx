"use server"

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createClass(formData: FormData, schoolId: string, parentId?: string) {
  const name = formData.get("name") as string;
  const section = (formData.get("section") as string) ?? "SECONDARY";

  try {
    await prisma.class.create({
      data: {
        name,
        section,
        schoolId,
        parentId: parentId || null,
        isActive: true,
      } as Prisma.ClassUncheckedCreateInput,
    });
    revalidatePath("/dashboard/admin/classes", "layout");
    return { success: true };
  } catch {
    return { error: "Could not create class." };
  }
}

export async function toggleClassStatus(classId: string, status: boolean) {
  await prisma.class.update({
    where: { id: classId },
    data: { isActive: status }
  });
  revalidatePath("/dashboard/admin/classes");
}