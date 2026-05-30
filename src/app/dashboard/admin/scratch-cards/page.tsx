import { prisma } from "@/lib/prisma";
import ScratchCardBatchForm from "./ScratchCardBatchForm";
import { CreditCard, CheckCircle, XCircle } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ school?: string }>;
}

export default async function ScratchCardManagerPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const schoolId = resolvedParams.school || "school-01";

  // Fetch all existing cards generated for this school scope
  const cards = await prisma.scratchCard.findMany({
    where: { schoolId },
    include: { usedBy: true },
    orderBy: { createdAt: "desc" },
  });

  // Calculate usage lifecycle aggregates
  const totalCards = cards.length;
  const usedCards = cards.filter((c) => c.isUsed).length;
  const activeCards = totalCards - usedCards;

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header Block */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Scratch Card Manager</h1>
            <p className="text-slate-500 font-medium">Generate and monitor terminal result checker tokens.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest self-start md:self-auto">
            School ID: {schoolId}
          </div>
        </header>

        {/* Aggregate Status Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <CreditCard size={22} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Generated</p>
              <p className="text-2xl font-black text-slate-800 font-mono mt-0.5">{totalCards}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <CheckCircle size={22} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active Tokens</p>
              <p className="text-2xl font-black text-slate-800 font-mono mt-0.5">{activeCards}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <XCircle size={22} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Burnt / Used</p>
              <p className="text-2xl font-black text-slate-800 font-mono mt-0.5">{usedCards}</p>
            </div>
          </div>
        </div>

        {/* Generate New Batch Action Block Component */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Generate Token Batch</h2>
          <p className="text-xs text-slate-500 mb-4">Specify how many scratch card PINs you want to emit securely into the database roster.</p>
          <ScratchCardBatchForm schoolId={schoolId} />
        </div>

        {/* Scratch Card Ledger Database Table */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm">Security Voucher Ledger</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold text-xs uppercase tracking-wider">
                  <th className="p-4">Serial Number</th>
                  <th className="p-4">Secret PIN</th>
                  <th className="p-4">Usage</th>
                  <th className="p-4">Lifecycle Status</th>
                  <th className="p-4">Activated By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {cards.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 italic bg-white">
                      No scratch cards have been allocated to this school database yet.
                    </td>
                  </tr>
                ) : (
                  cards.map((card) => (
                    <tr key={card.id} className="hover:bg-slate-50/50 bg-white">
                      <td className="p-4 font-mono font-bold text-slate-900">{card.serialNumber}</td>
                      <td className="p-4 font-mono tracking-widest text-slate-500">{card.pin}</td>
                      <td className="p-4 font-mono text-slate-700">{((card as unknown as { usageCount: number; maxUsage: number })).usageCount}/{((card as unknown as { usageCount: number; maxUsage: number })).maxUsage}</td>
                      <td className="p-4">
                        {card.isUsed ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            🔴 Burnt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                            🟢 Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-slate-800">
                        {card.isUsed && card.usedBy ? (
                          <span className="uppercase text-xs">
                            {card.usedBy.lastName} {card.usedBy.firstName} ({card.usedBy.regNumber})
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Unclaimed Voucher</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}