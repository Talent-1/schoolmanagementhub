import { prisma } from "@/lib/prisma";
import ReportCardPrintView from "./ReportCardPrintView";

interface PageProps {
  searchParams: Promise<{
    classId?: string;
    term?: string;
    session?: string;
  }>;
}

export default async function ReportCardGeneratorPage({ searchParams }: PageProps) {
  const { classId, term, session } = await searchParams;

  // Fallback defaults if URL parameters aren't selected yet
  const activeClassId = classId ?? "";
  const activeTerm = term ?? "FIRST";
  const activeSession = session ?? "2025/2026";

  // Fetch contextual options for the filtering control bars
  const classes = await prisma.class.findMany({
    where: { isActive: true },
    include: { parentClass: true }
  });

  // Pull complete records for calculation rendering
  const datasets = activeClassId
    ? await prisma.student.findMany({
        where: { classId: activeClassId },
        include: {
          school: true,
          class: { include: { parentClass: true } },
          results: {
            where: { term: activeTerm, session: activeSession },
            include: { subject: true }
          },
          termSummaries: {
            where: { term: activeTerm, session: activeSession }
          }
        }
      })
    : [];

  const classSnapshot = datasets.length
    ? datasets.map((student) => {
        const summary = student.termSummaries[0];
        const average = summary?.studentAverage ?? (student.results.reduce((sum, res) => sum + res.totalScore, 0) / Math.max(student.results.length, 1));
        return average;
      })
    : [];

  const classAverage = classSnapshot.length ? classSnapshot.reduce((sum, avg) => sum + avg, 0) / classSnapshot.length : 0;
  const topAverage = classSnapshot.length ? Math.max(...classSnapshot) : 0;
  const bottomAverage = classSnapshot.length ? Math.min(...classSnapshot) : 0;
  const fallingCount = classSnapshot.filter((avg) => avg < 40).length;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 print:bg-white print:p-0">
      {/* TOOLBAR CONTROLS: Automatically hidden completely during browser print actions */}
      {datasets.length > 0 && (
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm print:hidden">
          <p className="text-sm text-slate-500">
            Class snapshot: {datasets.length} learners, average {classAverage.toFixed(1)}%, top average {topAverage.toFixed(1)}%, bottom average {bottomAverage.toFixed(1)}%.
            {fallingCount > 0 && ` ${fallingCount} learner${fallingCount === 1 ? '' : 's'} below the pass threshold.`}
          </p>
        </div>
      )}
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm print:hidden">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Terminal Report Card Generator</h1>
            <p className="text-sm text-slate-500 mt-1">Select parameters to compile transcripts, edit form teacher remarks, and print records.</p>
          </div>
          {datasets.length > 0 && (
            <button
              onClick={() => typeof window !== "undefined" && window.print()}
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition"
            >
              🖨️ Print All Cards ({datasets.length})
            </button>
          )}
        </div>

        {/* Navigation Dropdown Filters */}
        <form method="GET" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Class Arm</label>
            <select
              id="class-id"
              name="classId"
              defaultValue={activeClassId}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-800 focus:border-blue-500 focus:bg-white outline-none"
            >
              <option value="">-- Choose Class Arm --</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.parentClass ? `${c.parentClass.name} (${c.name})` : c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Academic Term</label>
            <select
              id="term"
              name="term"
              defaultValue={activeTerm}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-800 focus:border-blue-500 focus:bg-white outline-none"
            >
              <option value="FIRST">First Term</option>
              <option value="SECOND">Second Term</option>
              <option value="THIRD">Third Term</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Session Year</label>
            <select
              id="session"
              name="session"
              defaultValue={activeSession}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-800 focus:border-blue-500 focus:bg-white outline-none"
            >
              <option value="2025/2026">2025/2026</option>
              <option value="2026/2027">2026/2027</option>
            </select>
          </div>

          <div className="sm:col-span-3 mt-2 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition"
            >
              Fetch Roster Records
            </button>
          </div>
        </form>
      </div>

      {/* EMPTY PLACEHOLDER BANNER */}
      {!activeClassId && (
        <div className="rounded-[2.5rem] border border-dashed border-slate-300 bg-white p-16 text-center print:hidden">
          <p className="text-lg font-semibold text-slate-700">No Class Selected</p>
          <p className="mt-2 text-sm text-slate-500">Choose a class arm and target term above to generate terminal report templates.</p>
        </div>
      )}

      {/* RENDER REPORT CARDS STACK */}
      {datasets.length > 0 && (
        <div className="flex flex-col gap-12 items-center">
          {datasets.map(student => {
            const summary = student.termSummaries[0] || null;
            return (
              <ReportCardPrintView
                key={student.id}
                student={student}
                school={student.school}
                classLabel={
                  student.class?.parentClass
                    ? `${student.class.parentClass.name} (${student.class.name})`
                    : student.class?.name || "Unassigned"
                }
                results={student.results}
                summary={summary}
                term={activeTerm}
                session={activeSession}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}