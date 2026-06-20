export default function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
        {title}
      </p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}