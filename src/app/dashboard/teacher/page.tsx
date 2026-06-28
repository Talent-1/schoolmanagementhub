import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ClipboardList, UserCheck, FileText, Upload, NotebookText } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function TeacherDashboard({ searchParams }: { searchParams: Promise<{ school?: string }> }) {
  const resolvedParams = await searchParams;
  const schoolId = resolvedParams.school || "school-01";
  
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!session || user?.role !== "TEACHER") {
    redirect("/login");
  }

  const staff = await prisma.staff.findUnique({
    where: { id: user.id },
    include: { managedClass: true }
  });

  if (!staff) {
    return <div className="p-10 text-slate-500 font-bold">Staff profile not found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Welcome back, {staff.name.split(' ')[0]}!
        </h1>
        <p className="text-slate-500 font-medium">Faculty Portal</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
        <Link href={`/dashboard/teacher/grading?school=${schoolId}`} className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-blue-400 transition-all group">
          <ClipboardList className="mb-4 text-blue-600" size={32} />
          <h2 className="text-xl font-bold text-slate-800">Gradebook</h2>
        </Link>

       
        <Link 
          href={`/dashboard/upload-result?school=${schoolId}`} 
          className="p-8 bg-white border border-blue-200 rounded-3xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all group"
        >
          <Upload className="mb-4 text-blue-600 group-hover:scale-110 transition-transform" size={32} />
          <h2 className="text-xl font-bold text-slate-800">Upload Results</h2>
          <p className="text-sm text-slate-500 mt-1">Bulk upload student scores via Excel.</p>
        </Link>

        <Link
          href={`/dashboard/teacher/notes?school=${schoolId}`}
          className="p-8 bg-white border border-yellow-200 rounded-3xl shadow-sm hover:border-yellow-400 transition-all group"
        >
          <NotebookText className="mb-4 text-yellow-600" size={32} />
          <h2 className="text-xl font-bold text-slate-800">Lesson Notes</h2>
          <p className="text-sm text-slate-500 mt-1">Generate AI-powered notes or view history.</p>
        </Link> 

        {/* Conditional Tiles */}
        {staff.managedClass && (
          <>
            <Link href={`/dashboard/teacher/attendance?school=${schoolId}`} className="p-8 bg-white border border-green-200 rounded-3xl shadow-sm hover:border-green-400 transition-all group">
              <UserCheck className="mb-4 text-green-600" size={32} />
              <h2 className="text-xl font-bold text-slate-800">Attendance</h2>
            </Link>
            <Link href={`/dashboard/teacher/broadsheet?school=${schoolId}`} className="p-8 bg-white border border-purple-200 rounded-3xl shadow-sm hover:border-purple-400 transition-all group">
              <FileText className="mb-4 text-purple-600" size={32} />
              <h2 className="text-xl font-bold text-slate-800">Mastersheet</h2>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}