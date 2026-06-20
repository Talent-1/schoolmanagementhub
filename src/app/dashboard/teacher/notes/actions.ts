"use server";

import { prisma } from "@/lib/prisma";
import { generateLessonNote } from "@/lib/gemini";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * 1. Fetches data to populate the dynamic dropdowns in the UI
 */
export async function getFormData() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, subjects: [], classes: [], departments: [] };

  const staff = await prisma.staff.findUnique({
    where: { id: session.user.id },
    select: { schoolId: true }
  });

  if (!staff?.schoolId) return { success: false, subjects: [], classes: [], departments: [] };

  const [subjects, classes] = await Promise.all([
    prisma.subject.findMany({ where: { schoolId: staff.schoolId } }),
    prisma.class.findMany({ where: { schoolId: staff.schoolId } }),
  ]);

  const uniqueDepartments = Array.from(
    new Set(subjects.map((s) => s.department).filter(Boolean))
  ).map((name, index) => ({ id: index.toString(), name }));

  return { 
    success: true, 
    subjects, 
    classes, 
    departments: uniqueDepartments 
  };
}

/**
 * 2. Generates and saves the lesson note
 */
export async function generateAndSaveNote(
  subjectId: string,
  topic: string,
  term: string,
  session: string,
  classId: string,
  deptId?: string
) {
  const sessionData = await getServerSession(authOptions);
  
  if (!sessionData?.user?.id) {
    return { success: false, message: "Unauthorized: Please log in." };
  }

  const staffId = sessionData.user.id;

  try {
    const usageCount = await prisma.note.count({
      where: { staffId, term, session, isAiGenerated: true }
    });

    if (usageCount >= 3) {
      return { success: false, message: "Free limit reached." };
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      select: { department: true }
    });

    const noteContent = await generateLessonNote(topic, subjectId);

    const savedNote = await prisma.note.create({
      data: {
        staffId,
        subjectId,
        topic,
        content: noteContent,
        term,
        session,
        isAiGenerated: true,
        classId,
        departmentId: deptId || subject?.department || null, 
      },
    });

    return { success: true, data: savedNote };
  } catch (error) {
    console.error("AI Generation Error:", error);
    return { success: false, message: "An error occurred while saving." };
  }
}

/**
 * 3. Fetches a specific note by its ID
 */
export async function getNoteById(noteId: string) {
  try {
    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });
    return { success: true, note };
  } catch (error) {
    console.error("Fetch Note Error:", error);
    return { success: false, message: "Could not fetch note." };
  }
}