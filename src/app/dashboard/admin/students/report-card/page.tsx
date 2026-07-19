import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import ReportCardManager from "@/components/ReportCardManager";

export default async function ReportCardGeneratorPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ classId?: string; term?: string; session?: string; school?: string }>; 
}) {
  // 1. AUTHENTICATION: Only Admins allowed
 const session = await getServerSession(authOptions);
  
  // Debug: Print the whole session to your terminal
  console.log("DEBUG SESSION DATA:", JSON.stringify(session, null, 2));

  // Use a more flexible check for debugging
  const userRole = session?.user?.role;
  console.log("Found Role:", userRole);

  if (!session || userRole !== "ADMIN") {
    return (
      <div className="p-20 text-center text-red-600 font-bold">
        Access Denied. Current Role: {userRole || "No Role Found"}
      </div>
    );
  }
  const { classId, term, session: sessionParam, school: schoolId } = await searchParams;
  
  // 2. CONTEXT CHECK
  if (!schoolId) {
    return (
      <div className="p-20 text-center bg-white rounded-3xl border border-red-200 text-red-600">
        <h2 className="text-xl font-bold">Unauthorized Access</h2>
        <p>School context is required to generate report cards.</p>
      </div>
    );
  }

  const activeClassId = classId ?? "";
  const activeTerm = term ?? "FIRST";
  const activeSession = sessionParam ?? "2025/2026";

  // 3. FETCH CLASSES (Scoped to school)
  const classes = await prisma.class.findMany({
    where: { 
      schoolId: schoolId,
      isActive: true 
    },
    include: { parentClass: true },
    orderBy: { parentClass: { name: 'asc' } }
  });

  // 4. FETCH DATASETS (Scoped to school and class)
  const datasets = activeClassId ? await prisma.student.findMany({
      where: { 
        classId: activeClassId,
        schoolId: schoolId
      },
      include: {
        school: true,
        class: { include: { parentClass: true } },
        results: { 
          where: { term: activeTerm, session: activeSession }, 
          include: { subject: true } 
        },
        termSummaries: { where: { term: activeTerm, session: activeSession } }
      }
  }) : [];

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-3xl shadow-sm">
        <h1 className="text-2xl font-black">Report Card Generator</h1>
        {datasets.length > 0 && <PrintButton label="Print Current Selection" count={1} />}
      </div>

      {/* FILTER FORM */}
      <div className="bg-white p-6 rounded-3xl shadow-sm mb-6 border border-slate-200">
        <form method="GET" className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <input type="hidden" name="school" value={schoolId} />
          
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Class Arm</label>
            <select name="classId" defaultValue={activeClassId} className="w-full p-3 rounded-xl border bg-slate-50">
              <option value="">-- Choose Class --</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.parentClass ? `${c.parentClass.name} (${c.name})` : c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Term</label>
            <select name="term" defaultValue={activeTerm} className="w-full p-3 rounded-xl border bg-slate-50">
              <option value="FIRST">First Term</option>
              <option value="SECOND">Second Term</option>
              <option value="THIRD">Third Term</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Session</label>
            <select name="session" defaultValue={activeSession} className="w-full p-3 rounded-xl border bg-slate-50">
              <option value="2025/2026">2025/2026</option>
              <option value="2026/2027">2026/2027</option>
            </select>
          </div>

          <button type="submit" className="bg-slate-900 text-white p-3 rounded-xl font-bold hover:bg-slate-800">
            Fetch Records
          </button>
        </form>
      </div>

      {/* RENDER MANAGER (Only renders for Admins) */}
      {datasets.length > 0 ? (
        <ReportCardManager 
          datasets={datasets} 
          activeTerm={activeTerm} 
          activeSession={activeSession} 
        />
      ) : (
        <div className="p-20 text-center bg-white rounded-3xl border border-dashed">
          Please select a class arm to view student report cards.
        </div>
      )}
    </div>
  );
}