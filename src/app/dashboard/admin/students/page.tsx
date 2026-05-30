import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

interface StudentWithClass {
  id: string;
  firstName: string;
  lastName: string;
  regNumber: string;
  class: {
    id: string;
    name: string;
    parentClass?: { name: string } | null;
  } | null;
}

// Function to fetch students dynamically based on URL params
async function fetchStudentRoster(schoolId: string) {
  return await prisma.student.findMany({
    where: { schoolId },
    include: {
      class: { include: { parentClass: true } },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
}

function formatClassLabel(studentClass: StudentWithClass["class"]) {
  if (!studentClass) return "Unassigned";
  return studentClass.parentClass
    ? `${studentClass.parentClass.name} (${studentClass.name})`
    : studentClass.name;
}

function groupStudentsByClass(students: StudentWithClass[]) {
  const groups = new Map<string, { label: string; students: StudentWithClass[] }>();
  for (const student of students) {
    const key = student.class?.id ?? "unassigned";
    const label = formatClassLabel(student.class);
    if (!groups.has(key)) groups.set(key, { label, students: [] });
    groups.get(key)!.students.push(student);
  }
  return Array.from(groups.values()).sort((a, b) => {
    if (a.label === "Unassigned") return 1;
    if (b.label === "Unassigned") return -1;
    return a.label.localeCompare(b.label);
  });
}

export default async function AdminStudentRosterPage({
  searchParams,
}: {
  searchParams: Promise<{ school?: string }>;
}) {
  const { school } = await searchParams;
  
  // Professional logic: Redirect if school is missing
  if (!school) {
    redirect("/dashboard/admin"); 
  }

  const students = await fetchStudentRoster(school);
  const studentGroups = groupStudentsByClass(students as StudentWithClass[]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Student Roster</h1>
          <p className="mt-2 text-slate-500 max-w-2xl">
            Browse all enrolled learners by class grouping and manage their records.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href={`/dashboard/admin/students/onboard?school=${school}`}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus size={20} />
            Enroll New Student
          </Link>
        </div>
      </div>

      {studentGroups.length === 0 ? (
        <div className="rounded-[2.5rem] border border-dashed border-slate-300 bg-white p-16 text-center">
          <p className="text-lg font-semibold text-slate-700">No students found for this school.</p>
          <Link href={`/dashboard/admin/students/onboard?school=${school}`} className="mt-4 inline-block text-blue-600 font-bold hover:underline">
            Register your first student →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {studentGroups.map((group) => (
            <section key={group.label} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{group.label}</h2>
                  <p className="text-sm text-slate-500">{group.students.length} students</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Reg. Number</th>
                      <th className="px-6 py-4 font-semibold">Student Name</th>
                      <th className="px-6 py-4 font-semibold">Class</th>
                      <th className="px-6 py-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {group.students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-700">{student.regNumber}</td>
                        <td className="px-6 py-4 text-slate-800">{student.lastName.toUpperCase()}, {student.firstName}</td>
                        <td className="px-6 py-4 text-slate-600">
                          <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                            {formatClassLabel(student.class)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/students/${student.id}`} className="font-semibold text-blue-600 hover:text-blue-800">
                            View profile →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}