"use client";

import { useState } from "react";
import { generateBulkScratchCards } from "./actions";

export default function ScratchCardBatchForm({ schoolId }: { schoolId: string }) {
  const [size, setSize] = useState(50);
  const [maxUsage, setMaxUsage] = useState(3);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const res = await generateBulkScratchCards(schoolId, Number(size), Number(maxUsage));

    if (res.success) {
      setStatus({ success: true, message: `Successfully generated ${res.count} secure validation vouchers!` });
    } else {
      setStatus({ success: false, message: res.error || "Generation pipeline failed." });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <div>
          <label htmlFor="batch-count" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Voucher Batch Count</label>
          <select
            id="batch-count"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full border border-slate-200 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
          >
            <option value={10}>10 Cards</option>
            <option value={50}>50 Cards</option>
            <option value={100}>100 Cards</option>
            <option value={200}>200 Cards</option>
            <option value={500}>500 Cards</option>
          </select>
        </div>
        <div>
          <label htmlFor="max-usage" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Max Uses per Voucher</label>
          <select
            id="max-usage"
            value={maxUsage}
            onChange={(e) => setMaxUsage(Number(e.target.value))}
            className="w-full border border-slate-200 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
          >
            <option value={1}>1 Use</option>
            <option value={2}>2 Uses</option>
            <option value={3}>3 Uses</option>
            <option value={5}>5 Uses</option>
            <option value={10}>10 Uses</option>
          </select>
          <p className="text-[11px] text-slate-500 mt-2">Set how many times each card may redeem before being retired.</p>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-blue-600 text-white font-bold text-sm rounded-xl px-6 py-3.5 hover:bg-blue-700 transition shadow-md disabled:opacity-50"
      >
        {loading ? "Generating Codes..." : "⚡ Run Generation"}
      </button>

      {status && (
        <div className={`w-full sm:col-span-2 text-xs font-bold p-3 rounded-xl mt-2 ${status.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {status.message}
        </div>
      )}
    </form>
  );
}