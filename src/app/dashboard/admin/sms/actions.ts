// src/app/dashboard/admin/sms/actions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { sendTermiiSms } from "@/lib/sms";

export async function sendBulkSmsAction(
  target: { classId: string | "ALL" }, 
  messageTemplate: string, 
  schoolId: string
) {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    select: { name: true }
  });

  const schoolName = school?.name || "HillCity";

  // 1. Fetch students based on target (Class or ALL)
  const students = await prisma.student.findMany({
    where: target.classId === "ALL" ? { schoolId } : { classId: target.classId },
    include: { parent: true }
  });

  // 2. Loop and Personalize
  const logs = await Promise.all(students.map(async (student) => {
    const phone = student.parent?.phoneNumber;
    if (!phone) return null;

    // Replace placeholders dynamically
    const personalizedMessage = messageTemplate
      .replace("{{studentName}}", student.firstName)
      .replace("{{studentId}}", student.id);
      
    const brandedMessage = `${schoolName}: ${personalizedMessage}`;

    const result = await sendTermiiSms(phone, brandedMessage);
    
    return prisma.smsLog.create({
      data: {
        schoolId,
        recipient: phone,
        message: brandedMessage,
        status: result.message === "Successfully sent" ? "sent" : "failed"
      }
    });
  }));

  return { success: true, count: logs.filter(Boolean).length };
}