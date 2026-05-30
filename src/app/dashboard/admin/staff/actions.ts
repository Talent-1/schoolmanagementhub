"use server"

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createStaff(formData: FormData, schoolId: string) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  try {
    // 1. Get the school name for the dynamic password
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { name: true }
    });

    if (!school) return { error: "School not found." };

    // 2. Format the password: staff@SchoolName (removing spaces)
    const cleanSchoolName = school.name.replace(/\s+/g, '');
    const defaultPassword = `staff@${cleanSchoolName}`;

    // 3. Hash the dynamic password
    const hashedPassword = await bcrypt.hash(defaultPassword, 10); 

    // 4. Create the staff record
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
    return { success: true, defaultPassword }; // Return it so the UI can show it
  } catch (error: any) {
    if (error.code === 'P2002') return { error: "This email is already registered." };
    return { error: "Database error: Could not create staff." };
  }
}