"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";


/** * STAFF REGISTRATION * **/
export async function registerStaff(prevState: any, formData: FormData) {

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const schoolId = formData.get("schoolId") as string;
  const role = formData.get("role") as string || "TEACHER";

  try {
    // 1. Hash the password (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Create the record
    await prisma.staff.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword, // Save the hash, not the plain text
        schoolId,
        role,
      },
    });
    
    revalidatePath("/dashboard/admin/staff");
    // Return a success object instead of redirecting immediately
    return { success: true, message: "Staff registered successfully!" };
    
  } catch (error: any) {
    if (error.code === 'P2002') return { success: false, error: "Email already in use." };
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/** * STUDENT REGISTRATION 
 * Kept exactly as it was to protect your Reg Number logic
 */
export async function registerStudent(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const schoolId = formData.get("schoolId") as string;
  const classId = formData.get("classId") as string;

  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    select: { name: true, schoolCode: true } 
  });

  if (!school) throw new Error("School not found");

  const year = new Date().getFullYear().toString().slice(-2); 
  const schoolInitials = school.name.split(" ").map(word => word[0]).join("").toUpperCase();
  const campus = school.schoolCode.toUpperCase(); 

  const studentCount = await prisma.student.count({
    where: { 
      schoolId,
      regNumber: { contains: `/${year}/` } 
    }
  });

  const nextIndex = (studentCount + 1).toString().padStart(3, '0');
  const generatedRegNumber = `${schoolInitials}/${campus}/${year}/${nextIndex}`;

  try {
    await prisma.student.create({
      data: {
        firstName,
        lastName,
        regNumber: generatedRegNumber,
        schoolId,
        classId: classId !== "" ? classId : null,
      },
    });
  } catch (error) {
    console.error("Student Registration Error:", error);
    throw new Error("Failed to onboard student");
  }

  revalidatePath("/students");
  redirect("/students");
}