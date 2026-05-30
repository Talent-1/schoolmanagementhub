import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ClipboardList, UserCheck, FileText } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function TeacherDashboard({ searchParams }: { searchParams: Promise<{ school?: string }> }) {
  const resolvedParams = await searchParams;
  const schoolId = resolvedParams.school || "school-01";
  
  // 1. Get the session
  const session = await getServerSession(authOptions);
  
  // 2. Validate session existence and role
  const user = session?.user as any;

  if (!session || user?.role !== "TEACHER") {
    redirect("/login");
  }

  // 3. Fetch staff using the ID from the session
  const staff = await prisma.staff.findUnique({
    where: { id: user.id },
    include: { managedClass: true }
  });

  if (!staff) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">
        Staff profile not found. Please contact an administrator.
      </div>
    );
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
        {/* Gradebook Tile */}
        <Link 
          href={`/dashboard/teacher/grading?school=${schoolId}`} 
          className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <ClipboardList className="mb-4 text-blue-600 group-hover:scale-110 transition-transform" size={32} />
          <h2 className="text-xl font-bold text-slate-800">Gradebook</h2>
          <p className="text-sm text-slate-500 mt-1">Manage scores for your subject assignments.</p>
        </Link>

        {/* Attendance Tile (Visible only to Form Teachers) */}
        {staff.managedClass && (
          <Link 
            href={`/dashboard/teacher/attendance?school=${schoolId}`} 
            className="p-8 bg-white border border-green-200 rounded-3xl shadow-sm hover:border-green-400 hover:shadow-md transition-all group"
          >
            <UserCheck className="mb-4 text-green-600 group-hover:scale-110 transition-transform" size={32} />
            <h2 className="text-xl font-bold text-slate-800">Attendance</h2>
            <p className="text-sm text-green-600 font-bold uppercase mt-1">
              Form Teacher: {staff.managedClass.name}
            </p>
          </Link>
        )}

        {/* Mastersheet Tile (Visible only to Form Teachers) */}
        {staff.managedClass && (
          <Link 
            href={`/dashboard/teacher/broadsheet?school=${schoolId}`} 
            className="p-8 bg-white border border-purple-200 rounded-3xl shadow-sm hover:border-purple-400 hover:shadow-md transition-all group"
          >
            <FileText className="mb-4 text-purple-600 group-hover:scale-110 transition-transform" size={32} />
            <h2 className="text-xl font-bold text-slate-800">Mastersheet</h2>
            <p className="text-sm text-purple-600 font-bold uppercase mt-1">
              {staff.managedClass.name} Results
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}