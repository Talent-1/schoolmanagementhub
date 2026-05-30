import { prisma } from "@/lib/prisma";
import GradeInput from "./GradeInput"; // We will create this below

export default async function AssignmentGrading({ params }: { params: Promise<{ assignmentId: string }> }) {
  const { assignmentId } = await params;

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { 
      subject: true,
      class: { 
        include: { 
          students: { 
            include: { results: { where: { assignmentId } } } 
          } 
        } 
      } 
    }
  });

  if (!assignment) return <div>Assignment not found.</div>;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{assignment.subject.name} - Grading</h1>
      <table className="w-full bg-white rounded-xl shadow-sm border border-slate-200">
        <thead>
          <tr className="border-b text-left">
            <th className="p-4">Student Name</th>
            <th className="p-4">Score</th>
          </tr>
        </thead>
        <tbody>
          {assignment.class.students.map((student) => {
            const existingResult = student.results[0]?.score;
            return (
              <tr key={student.id} className="border-b">
                <td className="p-4">{student.firstName} {student.lastName}</td>
                <td className="p-4">
                  {/* We pass the data to this client component */}
                  <GradeInput 
                    assignmentId={assignmentId} 
                    studentId={student.id} 
                    initialScore={existingResult || 0} 
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}