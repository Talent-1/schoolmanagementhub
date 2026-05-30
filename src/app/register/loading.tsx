export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-700 font-semibold animate-pulse">
        Fetching HillCity Records...
      </p>
    </div>
  );
}