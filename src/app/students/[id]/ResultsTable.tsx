import { prisma } from "@/lib/prisma";

export async function ResultsTable({ studentId }: { studentId: string }) {
  const results = await prisma.result.findMany({
    where: { studentId },
    orderBy: [{ session: 'desc' }, { term: 'asc' }],
    include: { subject: true }
  });

  if (results.length === 0) return <div className="p-10 text-center text-slate-500">No results found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b">
          <tr className="text-[10px] uppercase text-slate-400 font-bold">
            <th className="p-4">Subject</th>
            <th className="p-4">Term</th>
            <th className="p-4 text-center">Total Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {results.map((r) => {
            const total = r.caScore + r.examScore;
            return (
              <tr key={r.id}>
                <td className="p-4 font-bold text-slate-700">{r.subject?.name ?? 'Unknown'}</td>
                <td className="p-4 text-sm text-slate-500">{r.term} ({r.session})</td>
                <td className="p-4 text-center"><span className="px-3 py-1 rounded-full bg-slate-100 font-black text-xs">{total}%</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}