"use server";

import { prisma } from "@/lib/prisma";
import { generateRegNumber } from "@/lib/student-utils"; // Importing your central logic
import bcrypt from "bcryptjs";

export async function registerStudent(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const schoolId = formData.get("schoolId") as string;
  const classId = formData.get("classId") as string;
  const rawPassword = formData.get("password") as string;
  
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // 1. Fetch school info for the reg number logic
  const school = await prisma.school.findUnique({ 
    where: { id: schoolId },
    select: { name: true, schoolCode: true }
  });

  if (!school) throw new Error("School not found");

  // 2. Count students to get the sequence number for your utility
  const studentCount = await prisma.student.count({ where: { schoolId } });
  
  // 3. Use your central utility
  const regNumber = generateRegNumber(school.name, school.schoolCode, studentCount);

  // 4. Create the record
  await prisma.student.create({
    data: { 
      firstName, 
      lastName, 
      regNumber, 
      password: hashedPassword, 
      schoolId, 
      classId 
    }
  });

  // 5. Return everything needed for the UI modal
  return { 
    success: true, 
    firstName, 
    temporaryPassword: rawPassword, 
    regNumber 
  };
}