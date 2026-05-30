import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function GradingPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!session || user?.role !== "TEACHER") redirect("/login");

  // If this fails (like your DB error), it will automatically trigger the error.tsx file
  const assignments = await prisma.assignment.findMany({
    where: { staffId: user.id },
    include: { class: true, subject: true }
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Select Assignment to Grade</h1>
      
      {assignments.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
          <p>No assignments found assigned to your account.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((assignment) => (
            <Link 
              key={assignment.id} 
              href={`/dashboard/teacher/grading/${assignment.id}`}
              className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-500 transition-all"
            >
              <h2 className="text-lg font-bold text-slate-800">{assignment.subject.name}</h2>
              <p className="text-slate-500 mt-1">Class: {assignment.class.name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}