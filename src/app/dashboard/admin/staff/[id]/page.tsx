import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Mail, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { appointFormTeacher } from "../actions"; 

export default async function StaffProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const staff = await prisma.staff.findUnique({
    where: { id },
    include: {
      school: true,
      managedClass: { include: { parentClass: true } }, // Added parentClass for context
      assignments: {
        include: {
          subject: true,
          class: true,
        },
      },
    },
  });

  if (!staff) return notFound();

  const allClasses = await prisma.class.findMany({
    where: { 
      schoolId: staff.schoolId,
      NOT: { parentId: null } 
    },
    include: {
      parentClass: true,
    },
    orderBy: { parentClass: { name: "asc" } },
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        
        <Link 
          href="/dashboard/admin/staff" 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-8 transition-colors font-bold text-sm"
        >
          <ArrowLeft size={18} /> BACK TO DIRECTORY
        </Link>

        {/* Profile Header Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200 relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem]" />
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-xl">
              {staff.name.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-900 mb-2">{staff.name}</h1>
              <span className="px-4 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">{staff.role}</span>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 font-medium mt-4">
                <div className="flex items-center gap-1"><Mail size={16} /> {staff.email}</div>
                <div className="flex items-center gap-1"><Shield size={16} /> ID: {staff.id.slice(-6).toUpperCase()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-black text-slate-900">Current Workload ({staff.assignments.length})</h2>
          </div>

          <div className="space-y-6">
            {/* Class Management Section */}
            <h2 className="text-xl font-black text-slate-900">Class Management</h2>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Form Teacher Of
              </label>
              
              <form action={async (formData) => {
                "use server";
                const classId = formData.get("classId") as string;
                await appointFormTeacher(classId, classId ? staff.id : null);
              }} className="space-y-3">
                <select 
                  name="classId"
                  defaultValue={staff.managedClass?.id || ""}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-sm"
                >
                  <option value="">None</option>
                  {allClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.parentClass ? `${cls.parentClass.name} - ${cls.name}` : cls.name}
                    </option>
                  ))}
                </select>
                <button 
                  type="submit"
                  className={`w-full py-2 rounded-xl font-bold text-xs transition-all ${
                    staff.managedClass 
                      ? "bg-amber-600 text-white hover:bg-amber-700" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {staff.managedClass ? "Update / Remove Assignment" : "Save Assignment"}
                </button>
              </form>

              {staff.managedClass && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Currently Assigned:</p>
                  <p className="text-sm font-bold text-slate-700">
                    {staff.managedClass.parentClass?.name} - {staff.managedClass.name}
                  </p>
                </div>
              )}
            </div>

            {/* Account Security */}
            <h2 className="text-xl font-black text-slate-900">Account Security</h2>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <button className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all">
                Reset Password
              </button>
              <button className="w-full py-3 border border-red-200 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all">
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}