"use server";
import { prisma } from "@/lib/prisma";
import { sendSms } from "@/lib/sms";

export async function sendBulkSmsAction(
  target: { classId: string | "ALL" }, 
  messageTemplate: string, 
  schoolId: string
) {
  try {
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { name: true }
    });

    const schoolName = school?.name || "HillCity";

    // 1. Fetch students (No need for 'include' since phone is in the Student model)
    const students = await prisma.student.findMany({
      where: target.classId === "ALL" ? { schoolId } : { classId: target.classId },
    });

    // 2. Loop and Personalize
    const logs = await Promise.all(students.map(async (student) => {
      try {
        const phone = student.parentPhoneNumber;
        if (!phone) return null;

        // Use global regex for placeholders
        const personalizedMessage = messageTemplate
          .replace(/{{studentName}}/g, student.firstName || "Student")
          .replace(/{{studentId}}/g, student.id || "N/A");
          
        const brandedMessage = `${schoolName}: ${personalizedMessage}`;

        // Call the mockable SMS service
        const result = await sendSms(phone, brandedMessage);
        
        // Log to database
        return await prisma.smsLog.create({
          data: {
            schoolId,
            recipient: phone,
            message: brandedMessage,
            status: result.success ? "SENT" : "FAILED"
          }
        });
      } catch (error) {
        console.error(`Error processing student ${student.id}:`, error);
        return null;
      }
    }));

    return { 
      success: true, 
      sentCount: logs.filter(Boolean).length,
      totalStudents: students.length 
    };

  } catch (error) {
    console.error("Bulk SMS Action Failed:", error);
    throw new Error("Failed to process bulk SMS. Please check server logs.");
  }
}