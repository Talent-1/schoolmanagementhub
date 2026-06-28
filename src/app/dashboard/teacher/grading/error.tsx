"use client"; // Error boundaries must be client components

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-bold text-red-600 mb-2">Unable to load data</h2>
      <p className="text-slate-600">The server is having trouble reaching the database.</p>
      <button 
        onClick={() => reset()} 
        className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
      >
        Try Again
      </button>
    </div>
  );
}