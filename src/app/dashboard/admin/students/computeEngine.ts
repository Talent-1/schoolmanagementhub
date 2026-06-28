"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ResultStatus } from "@prisma/client";

/**
 * 1. THE AUTOMATION BRAIN: Rankings & Totals
 */
export async function updateTermSummary(studentId: string, classId: string, term: string, session: string) {
  const assignedSubjects = await prisma.assignment.findMany({ where: { classId }, distinct: ['subjectId'] });
  const subjectCount = assignedSubjects.length;
  if (subjectCount === 0) return;

  const results = await prisma.result.findMany({ where: { studentId, term, session } });
  const totalObtained = results.reduce((sum, res) => sum + res.totalScore, 0);
  const studentAverage = totalObtained / subjectCount;

  await prisma.termSummary.upsert({
    where: { studentId_term_session: { studentId, term, session } },
    update: { totalObtained, studentAverage },
    create: { 
      studentId, classId, term, session, totalObtained, 
      totalObtainable: subjectCount * 100, studentAverage,
      formTeacherRemark: "", punctuality: 0, neatness: 0, honesty: 0, 
      attentiveness: 0, sportsParticipation: 0, status: ResultStatus.PENDING
    }
  });

  const classSummaries = await prisma.termSummary.findMany({ where: { classId, term, session }, orderBy: { totalObtained: 'desc' } });
  await prisma.$transaction(classSummaries.map((s, i) => prisma.termSummary.update({ where: { id: s.id }, data: { position: i + 1 } })));
}

/**
 * 2. ADMINISTRATIVE: Class-Wide Status (Publish/Withhold/Cancel)
 */
export async function computeClassArmBroadsheet(classId: string, term: string, session: string, status: ResultStatus) {
  try {
    await prisma.termSummary.updateMany({ where: { classId, term, session }, data: { status } });
    if (status === ResultStatus.PUBLISHED) {
      await prisma.result.updateMany({ where: { classId, term, session }, data: { isPublished: true } });
    }
    revalidatePath(`/admin/students/report-card`);
    return { success: true };
  } catch (error) { return { success: false, error: String(error) }; }
}

/**
 * 3. ADMINISTRATIVE: Individual Student Status Control
 */
export async function updateStudentResultStatus(summaryId: string, status: ResultStatus) {
  try {
    await prisma.termSummary.update({ where: { id: summaryId }, data: { status } });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update status" };
  }
}

/**
 * 4. ADMINISTRATIVE: Teacher Remarks & Conduct
 */
export async function saveFormTeacherRemark(
  studentId: string, term: string, session: string, remark: string,
  assessment?: { punctuality?: number, neatness?: number, honesty?: number, attentiveness?: number, sportsParticipation?: number }
) {
  try {
    await prisma.termSummary.update({
      where: { studentId_term_session: { studentId, term, session } },
      data: { formTeacherRemark: remark, ...assessment }
    });
    return { success: true };
  } catch { return { success: false }; }
}

/**
 * 5. SCRATCH CARD: Access Control Logic
 */
export async function verifyScratchCard(studentId: string, pin: string, serial: string, term: string, session: string) {
  try {
    const card = await prisma.scratchCard.findUnique({ where: { pin } });

    if (!card || card.serialNumber !== serial || card.isUsed) {
      return { success: false, error: "Invalid PIN, Serial, or card limit reached." };
    }

    if (card.usageCount > 0 && card.usedById !== studentId) {
      return { success: false, error: "This card is already registered to another student." };
    }

    const newUsageCount = card.usageCount + 1;
    await prisma.scratchCard.update({
      where: { id: card.id },
      data: { 
        usageCount: newUsageCount,
        isUsed: newUsageCount >= card.maxUsage,
        usedById: studentId,
        usedAt: new Date()
      }
    });

    await prisma.accessGrant.create({
      data: { studentId, term, session, cardId: card.id }
    });

    return { success: true };
  } catch {
    return { success: false, error: "Verification failed." };
  }
}
