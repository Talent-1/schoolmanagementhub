import { prisma } from "@/lib/prisma";
import { format, startOfDay, parseISO } from "date-fns";
import { getAttendanceAnalytics } from "@/lib/attendance-analytics";
import StatCard from "@/components/StatCard";
import DateSwitcher from "@/components/DateSwitcher";
import { updateAttendanceAction } from "./actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link"; // Added Link import

export default async function AttendanceDashboard({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date: dateParam } = await searchParams;
  const date = dateParam ? parseISO(dateParam) : new Date();
  const normalizedDate = startOfDay(date);
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const managedClass = await prisma.class.findFirst({
    where: { formTeacherId: session.user.id },
    include: {
      parentClass: true,
      students: { include: { attendance: { where: { date: normalizedDate } } } }
    }
  });

  if (!managedClass) return <div>No class assigned.</div>;

  const hasAttendance = managedClass.students.some(s => s.attendance.length > 0);
  const stats = await getAttendanceAnalytics(managedClass.id, managedClass.schoolId, normalizedDate);

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      {/* HEADER SECTION WITH BACK BUTTON */}
      <div className="flex justify-between items-start mb-8">
        <div>
          {/* Back Button */}
          <Link href="/dashboard/teacher" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-2">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black">
            Attendance: {managedClass.parentClass ? `${managedClass.parentClass.name} - ` : ""}{managedClass.name}
          </h1>
          <p className="text-slate-500">{stats.termName}</p>
        </div>
        
        <DateSwitcher initialDate={normalizedDate} />
      </div>

      {!hasAttendance && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl mb-8">
          ⚠️ Attendance not submitted for {format(date, 'PPP')}.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Today" value={`${stats.dayPresentPercent}%`} description="Present" />
        <StatCard title="This Week" value={`${stats.weekPresentPercent}%`} description="Present" />
        <StatCard title="Termly" value={`${stats.termPresentPercent}%`} description="Present" />
      </div>

      <form action={updateAttendanceAction} className="bg-white rounded-3xl p-6 border shadow-sm">
        <input type="hidden" name="date" value={normalizedDate.toISOString()} />
        {managedClass.students.map((student) => (
          <div key={student.id} className="flex gap-4 items-center py-4 border-b">
            <span className="font-bold w-48">{student.lastName} {student.firstName}</span>
            <select name={`status-${student.id}`} defaultValue={student.attendance[0]?.status || "PRESENT"} className="p-2 border rounded">
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="HOLIDAY">Holiday</option>
            </select>
            <input name={`reason-${student.id}`} defaultValue={student.attendance[0]?.reason || ""} placeholder="Reason..." className="flex-1 p-2 border rounded" />
          </div>
        ))}
        <div className="flex gap-4 mt-6">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Save Attendance</button>
          <Link href="/dashboard/teacher" className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}