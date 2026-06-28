import { prisma } from "@/lib/prisma";
import GradeInput from "./GradeInput";
import { notFound } from "next/navigation";

export default async function AssignmentGrading({ params }: { params: Promise<{ assignmentId: string }> }) {
  const { assignmentId } = await params;

  // 1. Fetch the active term
  const activeTerm = await prisma.term.findFirst({ where: { isActive: true } });
  if (!activeTerm) return <div className="p-10">No active term found.</div>;

  // 2. Fetch the assignment
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { subject: true, class: true }
  });

  if (!assignment) notFound();

  // 3. FLEXIBLE FETCH with ParentClass
  // Including parentClass ensures that if the class structure is hierarchical, 
  // we have full access to the data structure.
  if (!assignment.subjectId) return <div className="p-10">Assignment has no subject.</div>;

  const classData = await prisma.class.findUnique({
    where: { id: assignment.classId },
    select: {
      id: true,
      name: true,
      section: true,
      isActive: true,
      parentId: true,
      formTeacherId: true,
      schoolId: true,
      parentClass: {
        select: {
          id: true,
          name: true,
          section: true,
          isActive: true,
          parentId: true,
          schoolId: true
        }
      },
      students: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          results: {
            where: {
              subjectId: assignment.subjectId,
              term: {
                startsWith: activeTerm.name.split(" ")[0],
                mode: 'insensitive'
              }
            },
            select: {
              totalScore: true
            }
          }
        },
        orderBy: { lastName: 'asc' }
      }
    }
  });

  if (!classData) return <div className="p-10">Class data not found.</div>;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{assignment.subject?.name ?? "Untitled subject"} - Grading</h1>
      <p className="text-slate-500 mb-6">
        {/* Displaying parentClass name if it exists */}
        Class: {classData.parentClass?.name} {classData.name} | Active Term: {activeTerm.name}
      </p>
      
      <table className="w-full bg-white rounded-xl shadow-sm border border-slate-200">
        <thead>
          <tr className="border-b text-left bg-slate-50">
            <th className="p-4">Student Name</th>
            <th className="p-4 text-center">Score</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {classData.students.length === 0 ? (
            <tr><td colSpan={3} className="p-4 text-center">No students found.</td></tr>
          ) : (
            classData.students.map((student) => {
              const existingResult = student.results[0]?.totalScore || 0;
              return (
                <tr key={student.id} className="border-b">
                  <td className="p-4">{student.lastName} {student.firstName}</td>
                  <td className="p-4 text-center">
                    <span className="font-mono bg-slate-100 px-3 py-1 rounded">{existingResult}</span>
                  </td>
                  <td className="p-4 flex justify-center">
                    <GradeInput 
                      assignmentId={assignmentId} 
                      studentId={student.id} 
                      initialScore={String(existingResult)}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}