"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateGrade(assignmentId: string, studentId: string, score: number) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "TEACHER") {
    throw new Error("Unauthorized");
  }

  // Security: Ensure this teacher is actually assigned to this subject/assignment
  const assignment = await prisma.assignment.findFirst({
    where: { 
      id: assignmentId, 
      staffId: session.user.id 
    }
  });

  if (!assignment) throw new Error("You are not authorized to grade this assignment.");

  // Upsert the grade (Update if exists, Create if not)
  await prisma.result.upsert({
    where: { 
      assignmentId_studentId: { assignmentId, studentId } 
    },
    update: { score },
    create: { assignmentId, studentId, score }
  });

  revalidatePath(`/dashboard/teacher/grading`);
  return { success: true };
}