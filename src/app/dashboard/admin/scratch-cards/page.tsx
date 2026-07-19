import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ScratchCardBatchForm from "./ScratchCardBatchForm";
import { CreditCard, CheckCircle, XCircle } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ school?: string }>;
}

export default async function ScratchCardManagerPage({ searchParams }: PageProps) {
  const { school: schoolParam } = await searchParams;

  // 1. Enforce school selection
  if (!schoolParam) {
    redirect("/dashboard");
  }

  // 2. Fetch school to ensure it exists
  const school = await prisma.school.findUnique({ where: { id: schoolParam } });
  
  if (!school) {
    return <div className="p-10 text-red-600 font-bold">Invalid School ID.</div>;
  }

  const schoolId = school.id;

  // 3. Fetch cards for the specific school
  const cards = await prisma.scratchCard.findMany({
    where: { schoolId },
    include: { usedBy: true },
    orderBy: { createdAt: "desc" },
  });

  const totalCards = cards.length;
  const usedCards = cards.filter((c) => c.isUsed).length;
  const activeCards = totalCards - usedCards;

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Scratch Card Manager</h1>
            <p className="text-slate-500 font-medium">{school.name} - Terminal Token Management</p>
          </div>
        </header>

        {/* Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
           <StatCard icon={<CreditCard size={22}/>} label="Total Generated" value={totalCards} color="blue" />
           <StatCard icon={<CheckCircle size={22}/>} label="Active Tokens" value={activeCards} color="green" />
           <StatCard icon={<XCircle size={22}/>} label="Burnt / Used" value={usedCards} color="amber" />
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Generate Token Batch</h2>
          <ScratchCardBatchForm schoolId={schoolId} />
        </div>

        {/* Ledger table remains the same, using the validated schoolId */}
        {/* ... */}
      </div>
    </div>
  );
}

// Helper component to clean up the dashboard grid
function StatCard({ icon, label, value, color }: any) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600"
  };
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 ${styles[color as keyof typeof styles]} rounded-2xl flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-800 font-mono mt-0.5">{value}</p>
      </div>
    </div>
  );
}