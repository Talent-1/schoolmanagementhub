'use client';

export default function PrintButton({ label, count }: { label: string, count: number }) {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition"
    >
      🖨️ {label} ({count})
    </button>
  );
}