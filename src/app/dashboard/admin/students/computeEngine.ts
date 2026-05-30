"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function computeClassArmBroadsheet(classId: string, term: string, session: string) {
  try {
    // 1. Fetch active subjects allocated to this class arm via assignments
    const assignedSubjects = await prisma.assignment.findMany({
      where: { classId },
      distinct: ['subjectId']
    });
    
    const subjectCount = assignedSubjects.length;
    if (subjectCount === 0) {
      return { success: false, error: "No subjects have been assigned to this class arm yet." };
    }
    
    const totalObtainable = subjectCount * 100;

    // 2. Load all students belonging to this class arm with their scores
    const students = await prisma.student.findMany({
      where: { classId },
      include: {
        results: {
          where: { term, session }
        }
      }
    });

    if (students.length === 0) {
      return { success: false, error: "No students found in this class arm." };
    }

    // 3. Aggregate totals and calculate average scores
    const studentPerformance = students.map(student => {
      const totalObtained = student.results.reduce((sum, res) => sum + res.totalScore, 0);
      const studentAverage = totalObtained / subjectCount;
      
      return {
        studentId: student.id,
        totalObtained,
        studentAverage
      };
    });

    // 4. Sort descending to establish class ranking positions
    const sortedPerformance = [...studentPerformance].sort((a, b) => b.totalObtained - a.totalObtained);

    // 5. Commit calculations to the database
    for (let i = 0; i < sortedPerformance.length; i++) {
      const record = sortedPerformance[i];
      const position = i + 1;

      await prisma.termSummary.upsert({
        where: {
          studentId_term_session: {
            studentId: record.studentId,
            term,
            session
          }
        },
        update: {
          totalObtained: record.totalObtained,
          totalObtainable,
          studentAverage: record.studentAverage,
          position,
          classId
        },
        create: {
          studentId: record.studentId,
          classId,
          term,
          session,
          totalObtained: record.totalObtained,
          totalObtainable,
          studentAverage: record.studentAverage,
          position
        }
      });
    }

    // 6. Update global release flag on all results within this segment
    await prisma.result.updateMany({
      where: { classId, term, session },
      data: { isPublished: true }
    });

    revalidatePath(`/admin/students/report-card`);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Compilation Error:", message);
    return { success: false, error: message };
  }
}

export async function saveFormTeacherRemark(
  studentId: string,
  term: string,
  session: string,
  remark: string,
  assessment?: {
    punctuality?: number;
    neatness?: number;
    honesty?: number;
    attentiveness?: number;
    sportsParticipation?: number;
  }
) {
  try {
    const updateData: Record<string, unknown> = { formTeacherRemark: remark };
    if (assessment) {
      updateData.punctuality = assessment.punctuality;
      updateData.neatness = assessment.neatness;
      updateData.honesty = assessment.honesty;
      updateData.attentiveness = assessment.attentiveness;
      updateData.sportsParticipation = assessment.sportsParticipation;
    }
    await prisma.termSummary.update({
      where: {
        studentId_term_session: { studentId, term, session }
      },
      data: updateData
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}