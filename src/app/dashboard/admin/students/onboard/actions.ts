"use server";

import { prisma } from "@/lib/prisma";
import { generateRegNumber } from "@/lib/student-utils";
import bcrypt from "bcryptjs";

export async function registerStudent(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const schoolId = formData.get("schoolId") as string;
  const classId = formData.get("classId") as string;
  const rawPassword = formData.get("password") as string;
  const parentPhoneNumber = formData.get("parentPhoneNumber") as string;
  
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const school = await prisma.school.findUnique({ 
    where: { id: schoolId },
    select: { name: true, schoolCode: true }
  });

  if (!school) throw new Error("School not found");

  const studentCount = await prisma.student.count({ where: { schoolId } });
  const regNumber = generateRegNumber(school.name, school.schoolCode, studentCount);

  await prisma.student.create({
    data: { firstName, lastName, regNumber, password: hashedPassword, schoolId, classId, parentPhoneNumber }
  });

  return { success: true, firstName, temporaryPassword: rawPassword, regNumber };
}