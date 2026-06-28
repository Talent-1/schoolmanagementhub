"use server";

import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";
import { updateTermSummary } from "@/app/dashboard/admin/students/computeEngine";

export async function uploadExcelResults(formData: FormData) {
  const file = formData.get("file") as File;
  const classId = formData.get("classId") as string;
  const teacherIdInput = formData.get("teacherId") as string;
  const term = formData.get("term") as string;
  const session = formData.get("session") as string;

  if (!file || !classId || !teacherIdInput || !term || !session) {
    return { success: false, message: "Missing Required Fields." };
  }

  // 1. Find Staff
  const staff = await prisma.staff.findFirst({
    where: { id: { endsWith: teacherIdInput, mode: 'insensitive' } }
  });

  if (!staff) return { success: false, message: "Teacher ID not found." };

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const rows: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    const allStudents = await prisma.student.findMany({ where: { classId } });
    const allSubjects = await prisma.subject.findMany();
    const results = [];

    // 2. Matching Logic: Find assignment PER SUBJECT
    for (const row of rows) {
      const studentName = (row["student_name"] || "").toString().trim().toLowerCase();
      const subjectName = (row["subject_name"] || "").toString().trim().toLowerCase();

      const student = allStudents.find(s => 
        (s.firstName + " " + s.lastName).trim().toLowerCase() === studentName
      );
      
      const subject = allSubjects.find(s => 
        s.name.trim().toLowerCase() === subjectName
      );

      if (student && subject) {
        // Find assignment specifically for this teacher AND this subject
        const assignment = await prisma.assignment.findFirst({
          where: { 
            staffId: staff.id, 
            classId: classId,
            subjectId: subject.id 
          }
        });

        if (assignment) {
          results.push({
            assignmentId: assignment.id,
            studentId: student.id,
            subjectId: subject.id,
            classId,
            term,
            session,
            caScore: parseFloat(row["ca_score"] || 0),
            examScore: parseFloat(row["exam_score"] || 0),
            totalScore: (parseFloat(row["ca_score"] || 0) + parseFloat(row["exam_score"] || 0))
          });
        } else {
          console.log(`No assignment found for Teacher in ${subjectName}`);
        }
      }
    }

    if (results.length === 0) {
      return { success: false, message: "No valid records found. Check Teacher-Subject assignments." };
    }

    // 3. Database Write (Upsert Logic compatible with the new @@unique constraint)
    let updatedCount = 0;

    for (const res of results) {
      await prisma.result.upsert({
        where: {
          studentId_subjectId_term_session: {
            studentId: res.studentId,
            subjectId: res.subjectId,
            term: res.term,
            session: res.session
          }
        },
        update: { 
          caScore: res.caScore, 
          examScore: res.examScore, 
          totalScore: res.totalScore,
          assignmentId: res.assignmentId // Update assignment in case it changed
        },
        create: res
      });
      // We count based on logic; for simplicity, we treat upsert as an operation
      updatedCount++; 
    }

    // 4. Update Summaries
    const affectedStudentIds = Array.from(new Set(results.map(r => r.studentId)));
    for (const studentId of affectedStudentIds) {
      await updateTermSummary(studentId, classId, term, session);
    }

    return { success: true, message: `Successfully processed ${updatedCount} records.` };
  } catch (error) {
    console.error("Upload Error:", error);
    return { success: false, message: "System error during database write." };
  }
}