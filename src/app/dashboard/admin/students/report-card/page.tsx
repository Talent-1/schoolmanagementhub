import { prisma } from "@/lib/prisma";
import PrintButton from "@/components/PrintButton";
import ReportCardManager from "@/components/ReportCardManager";

export default async function ReportCardGeneratorPage({ searchParams }: any) {
  const { classId, term, session } = await searchParams;
  
  const activeClassId = classId ?? "";
  const activeTerm = term ?? "FIRST";
  const activeSession = session ?? "2025/2026";

  // 1. Fetch classes with parentClass for the dropdown
  const classes = await prisma.class.findMany({
    where: { isActive: true },
    include: { parentClass: true },
    orderBy: { parentClass: { name: 'asc' } }
  });

  // 2. Fetch students only if a class is selected
  const datasets = activeClassId ? await prisma.student.findMany({
      where: { classId: activeClassId },
      include: {
        school: true,
        class: { include: { parentClass: true } },
        results: { where: { term: activeTerm, session: activeSession }, include: { subject: true } },
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
          
          <select name="term" defaultValue={activeTerm} className="p-3 rounded-xl border bg-slate-50">
            <option value="FIRST">First Term</option>
            <option value="SECOND">Second Term</option>
            <option value="THIRD">Third Term</option>
          </select>

          <select name="session" defaultValue={activeSession} className="p-3 rounded-xl border bg-slate-50">
            <option value="2025/2026">2025/2026</option>
            <option value="2026/2027">2026/2027</option>
          </select>

          <button type="submit" className="bg-slate-900 text-white p-3 rounded-xl font-bold hover:bg-slate-800">
            Fetch Records
          </button>
        </form>
      </div>

      {/* RENDER MANAGER */}
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