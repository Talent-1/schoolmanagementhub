import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
// Added Calendar icon
import { BookOpen, Users, GraduationCap, Printer, CreditCard, MessageSquare, Calendar } from "lucide-react"; 
import LogoutButton from "@/components/LogoutButton";

export default async function AdminDashboard() {
  const session = (await getServerSession(authOptions)) as Session | null;
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const admin = await prisma.staff.findUnique({
    where: { email: session.user.email },
    select: { schoolId: true, school: true }
  });

  const schoolId = admin?.schoolId ?? "school-01";
  const schoolName = admin?.school?.name ?? "HillCity Management System";

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
            <p className="text-slate-500 font-medium">{schoolName}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              ID: {schoolId}
            </div>
            <LogoutButton />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Term Management Card */}
          <DashboardCard href={`/dashboard/admin/terms`} icon={<Calendar size={24} />} title="Academic Terms" description="Set active terms and dates." color="sky" />
          
          <DashboardCard href={`/dashboard/admin/students?school=${schoolId}`} icon={<GraduationCap size={24} />} title="Student Directory" description="Manage rosters and bulk uploads." color="indigo" />
          <DashboardCard href={`/dashboard/admin/students/report-card?school=${schoolId}`} icon={<Printer size={24} />} title="Report Cards" description="Compile broadsheets and remarks." color="blue" />
          <DashboardCard href={`/dashboard/admin/scratch-cards?school=${schoolId}`} icon={<CreditCard size={24} />} title="Scratch Cards" description="Manage PINs and access." color="amber" />
          <DashboardCard href={`/dashboard/admin/staff?school=${schoolId}`} icon={<Users size={24} />} title="Staff Records" description="Manage teachers and assignments." color="green" />
          <DashboardCard href={`/dashboard/admin/subjects?school=${schoolId}`} icon={<BookOpen size={24} />} title="Curriculum" description="Configure subjects and departments." color="orange" />
          <DashboardCard href={`/dashboard/admin/sms?school=${schoolId}`} icon={<MessageSquare size={24} />} title="Bulk SMS" description="Send announcements to parents." color="violet" />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ href, icon, title, description, color }: any) {
  const colorStyles: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border-indigo-200",
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border-blue-200",
    amber: "bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white border-amber-200",
    green: "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border-green-200",
    orange: "bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white border-orange-200",
    violet: "bg-violet-50 text-violet-600 hover:bg-violet-600 hover:text-white border-violet-200",
    sky: "bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white border-sky-200",
  };
  
  return (
    <Link href={href} className="group p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl transition-all flex flex-col gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${colorStyles[color]}`}>
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-800 transition-colors">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
    </Link>
  );
}