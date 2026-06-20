"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Changed 'score' from number to 'grade' as a string
export async function updateGrade(assignmentId: string, studentId: string, grade: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "TEACHER") {
    throw new Error("Unauthorized");
  }

  // 1. Verify authorization
  const assignment = await prisma.assignment.findFirst({
    where: { 
      id: assignmentId, 
      staffId: session.user.id 
    },
    include: { class: true } // Include class to get required fields
  });

  if (!assignment) throw new Error("You are not authorized to grade this assignment.");

  // 2. Fetch the active term/session (needed for your @@unique constraint)
  const activeTerm = await prisma.term.findFirst({ where: { isActive: true } });
  if (!activeTerm) throw new Error("No active term found.");

  // Convert letter grade to a numeric value for your totalScore field if needed
  const numericScore = parseFloat(grade) || 0;

  // 3. Upsert the grade
  await prisma.result.upsert({
    where: { 
      assignmentId_studentId: { assignmentId, studentId } 
    },
    update: { 
      grade: grade,
      totalScore: numericScore 
    },
    create: { 
      assignmentId, 
      studentId, 
      grade: grade,
      totalScore: numericScore,
      // These fields are required by your schema's @@unique and relation constraints:
      subjectId: assignment.subjectId!,
      classId: assignment.classId,
      term: activeTerm.name,
      session: activeTerm.name
    }
  });

  revalidatePath(`/dashboard/teacher/grading`);
  return { success: true };
}