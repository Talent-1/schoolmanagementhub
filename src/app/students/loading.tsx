export default function StudentsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Loading student portal</p>
        <div className="mt-6 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-2 w-2/5 animate-pulse rounded-full bg-blue-600" />
        </div>
      </div>
    </div>
  );
}
