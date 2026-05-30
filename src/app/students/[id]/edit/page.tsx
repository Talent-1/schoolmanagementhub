import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditStudentPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Await params to get the ID safely
  const { id } = await params;

  if (!id) return notFound();

  // 2. Fetch data: student info and available classes for the edit form
  const [student, classes] = await Promise.all([
    prisma.student.findUnique({
      where: { id },
      include: { 
        class: {
          include: { parentClass: true }
        }, 
        school: true 
      }
    }),
    prisma.class.findMany({
      include: { parentClass: true }
    })
  ]);

  if (!student) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <Link href={`/students/${id}`} className="text-blue-600 hover:underline font-medium">
          ← Back to Profile
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2">Edit Student</h1>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        {/* Your Form Component would be rendered here */}
        <p className="text-slate-600">
          Editing: <span className="font-bold">{student.firstName} {student.lastName}</span>
        </p>
        <p className="text-sm text-slate-400 font-mono mb-6">{student.regNumber}</p>
        
        {/* Example: Form placeholder */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Class</label>
            <select className="w-full p-3 border rounded-lg">
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.parentClass?.name} - {cls.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}