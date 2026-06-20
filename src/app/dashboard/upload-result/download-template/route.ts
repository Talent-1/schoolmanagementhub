import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");
  const subjectId = searchParams.get("subjectId"); // New parameter

  if (!classId || !subjectId) {
    return new NextResponse("Missing classId or subjectId", { status: 400 });
  }

  const [students, subject] = await Promise.all([
    prisma.student.findMany({ where: { classId } }),
    prisma.subject.findUnique({ where: { id: subjectId } })
  ]);

  if (!subject) return new NextResponse("Subject not found", { status: 404 });

  const rows = [["student_name", "subject_name", "ca_score", "exam_score"]];
  
  for (const s of students) {
    rows.push([`${s.firstName} ${s.lastName}`, subject.name, 0, 0]);
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  return new NextResponse(excelBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${subject.name}_template.xlsx"`
    }
  });
}