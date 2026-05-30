import { prisma } from "@/lib/prisma";
import { Mail, ShieldCheck, UserPlus, Settings2 } from "lucide-react";
import Link from "next/link";
import AddStaffModal from "./AddStaffModal";

export default async function StaffManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ school?: string }>;
}) {
  const resolvedParams = await searchParams;
  const schoolId = resolvedParams.school || "HILLCITY-01";

  const staffList = await prisma.staff.findMany({
    where: { schoolId: schoolId },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="p-6 lg:p-10 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Directory</h1>
          <p className="text-slate-500 font-medium">Manage faculty profiles and system access.</p>
        </div>
        
        <AddStaffModal schoolId={schoolId} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {staffList.map((staff) => (
          <div key={staff.id} className="group p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                {staff.name.charAt(0)}
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                staff.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
              }`}>
                {staff.role}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-1">{staff.name}</h3>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Mail size={14} />
                <span className="truncate">{staff.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <ShieldCheck size={14} className="text-blue-500" />
                <span className="font-medium text-slate-600 uppercase">ID: {staff.id.slice(-6)}</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-auto pt-6 border-t border-slate-200 flex gap-2">
              <Link 
                href={`/dashboard/admin/staff/${staff.id}`} 
                className="flex-1 py-3 text-center bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Profile
              </Link>
              <Link 
                href={`/dashboard/admin/assignments?school=${schoolId}&staff=${staff.id}`} 
                className="flex-1 py-3 text-center bg-blue-600 rounded-xl text-xs font-bold text-white hover:bg-black transition-all flex items-center justify-center gap-1"
              >
                <Settings2 size={14} />
                Assign
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}