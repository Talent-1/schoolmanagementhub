"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleSubjectStatus(id: string, activeStatus: boolean) {
  try {
    await prisma.subject.update({
      where: { id },
      data: { isActive: activeStatus }
    });
    
    // This clears the cache so the Result Upload page sees the change immediately
    revalidatePath("/dashboard/upload-results");
    return { success: true };
  } catch {
    return { error: "Failed to update subject status." };
  }
}

export async function addNewSubject(data: { name: string, section: string, department?: string, schoolId: string }) {
  try {
    const newSubject = await prisma.subject.create({
      data: {
        ...data,
        schoolId: data.schoolId,
        isActive: true
      }
    });
    revalidatePath("/dashboard/admin/subjects");
    return { success: true, subject: newSubject };
  } catch {
    return { error: "Subject already exists or database error." };
  }
}