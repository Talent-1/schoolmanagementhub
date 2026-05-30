import { prisma } from "@/lib/prisma";
import Link from 'next/link';

export default async function StudentsPage() {
  const students = await prisma.student.findMany({
    include: { class: true },
    orderBy: { lastName: 'asc' } // Alphabetical by surname
  });

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white shadow-sm border rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 text-left border-b">
              <th className="p-4 text-sm font-semibold text-slate-600">Reg Number</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Full Name</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Class</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono text-sm text-blue-700 font-bold">
                  {s.regNumber}
                </td>
                <td className="p-4 text-slate-700 font-medium">
                  {s.lastName.toUpperCase()}, {s.firstName}
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${s.class ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {s.class?.name || "Unassigned"}
                  </span>
                </td>
                <td className="p-4">
                  <Link 
                    href={`/students/${s.id}`} 
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                  >
                    View Profile →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No students found. Start by registering one.
          </div>
        )}
      </div>
    </div>
  );
}