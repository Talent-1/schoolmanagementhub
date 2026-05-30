"use server"

import { prisma } from "@/lib/prisma";

export async function searchStaff(query: string, schoolId: string) {
  if (query.length < 1) return [];

  return await prisma.staff.findMany({
    where: {
      schoolId: schoolId,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { id: { contains: query, mode: 'insensitive' } }
      ]
    },
    select: { id: true, name: true },
    take: 10
  });
}

export async function getAllStaff(schoolId: string) {
  return await prisma.staff.findMany({
    where: { schoolId },
    select: { id: true, name: true },
    take: 100
  });
}

export async function updateAssignment(subjectId: string, classId: string, staffId: string) {
  // Upsert ensures we update if it exists, or create if it doesn't
  await prisma.assignment.upsert({
    where: {
      staffId_classId_subjectId: { staffId, classId, subjectId }
    },
    update: { staffId },
    create: { subjectId, classId, staffId }
  });
  return { success: true };
}
