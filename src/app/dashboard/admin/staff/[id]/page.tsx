import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Mail, Calendar, Shield, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function StaffProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch staff with their school details and current assignments
  const staff = await prisma.staff.findUnique({
    where: { id },
    include: {
      school: true,
      assignments: {
        include: {
          subject: true,
          class: true,
        },
      },
    },
  });

  if (!staff) return notFound();

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <Link 
          href="/dashboard/admin/staff" 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-8 transition-colors font-bold text-sm"
        >
          <ArrowLeft size={18} />
          BACK TO DIRECTORY
        </Link>

        {/* Profile Header Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200 relative overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] -z-0" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar */}
            <div className="w-32 h-32 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-xl shadow-blue-100">
              {staff.name.charAt(0)}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{staff.name}</h1>
                <span className="px-4 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest self-center">
                  {staff.role}
                </span>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 font-medium">
                <div className="flex items-center gap-1">
                  <Mail size={16} className="text-blue-500" />
                  {staff.email}
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={16} className="text-purple-500" />
                  ID: {staff.id.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workload / Assignments Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-4 justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Current Workload
              <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-md font-bold">
                {staff.assignments.length}
              </span>
            </h2>
            <button
              type="button"
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
            >
              Clear
            </button>
          </div>

            {staff.assignments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {staff.assignments.map((asgn) => (
                  <div key={asgn.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-1">
                      {asgn.class.name}
                    </p>
                    <h4 className="text-lg font-bold text-slate-800">{asgn.subject.name}</h4>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                <p className="text-slate-400 font-bold">No subjects assigned yet.</p>
                <Link 
                  href={`/dashboard/admin/assignments?school=${staff.schoolId}`}
                  className="text-blue-600 text-sm font-black mt-2 inline-block hover:underline"
                >
                  GO TO ASSIGNMENT ENGINE →
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
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