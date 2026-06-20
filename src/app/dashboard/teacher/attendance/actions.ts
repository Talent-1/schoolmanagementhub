"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAttendanceAction(formData: FormData) {
  // 1. Get the date from the hidden input field in the form
  const dateStr = formData.get("date") as string;
  const date = new Date(dateStr); 

  // 2. Extract entries
  const entries = Array.from(formData.entries());
  
  for (const [key, value] of entries) {
    if (key.startsWith("status-")) {
      const studentId = key.replace("status-", "");
      const status = value as string;
      const reason = formData.get(`reason-${studentId}`) as string;

      // 3. Perform the Upsert using the specific date from the form
      await prisma.attendance.upsert({
        where: { 
          studentId_date: { 
            studentId, 
            date 
          } 
        },
        update: { status, reason },
        create: { 
          studentId, 
          date, 
          status, 
          reason 
        }
      });
    }
  }
  
  revalidatePath("/dashboard/teacher/attendance");
}