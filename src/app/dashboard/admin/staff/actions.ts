"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// --- FEATURE 1: STAFF CREATION (Kept exactly as it was) ---
export async function createStaff(formData: FormData, schoolId: string) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  try {
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { name: true }
    });

    if (!school) return { error: "School not found." };

    const cleanSchoolName = school.name.replace(/\s+/g, '');
    const defaultPassword = `staff@${cleanSchoolName}`;
    const hashedPassword = await bcrypt.hash(defaultPassword, 10); 

    await prisma.staff.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        role: role, 
        password: hashedPassword,
        schoolId: schoolId,
      },
    });

    revalidatePath("/dashboard/admin/staff");
    return { success: true, defaultPassword }; 
  } catch (error: any) {
    if (error.code === 'P2002') return { error: "This email is already registered." };
    return { error: "Database error: Could not create staff." };
  }
}

// --- FEATURE 2: APPOINT FORM TEACHER (New) ---
// This handles assignment, replacement (swapping), and removal (null)
export async function appointFormTeacher(classId: string, staffId: string | null) {
  try {
    // 1. If assigning a new teacher, clear their previous class (prevents unique constraint errors)
    if (staffId) {
      await prisma.class.updateMany({
        where: { formTeacherId: staffId },
        data: { formTeacherId: null }
      });
    }

    // 2. Perform the assignment (or set to null if clearing the position)
    await prisma.class.update({
      where: { id: classId },
      data: { formTeacherId: staffId }
    });

    revalidatePath("/dashboard/admin/classes");
    revalidatePath("/dashboard/admin/staff");
    return { success: true };
  } catch (error) {
    console.error("Appoint Form Teacher Error:", error);
    return { error: "Failed to update form teacher assignment." };
  }
}