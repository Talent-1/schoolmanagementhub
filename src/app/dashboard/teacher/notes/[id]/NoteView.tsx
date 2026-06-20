"use client"; 

import ReactMarkdown from "react-markdown";

export default function NoteView({ note }: { note: any }) {
  const handlePrint = () => window.print();

  const handleDownload = () => {
    const blob = new Blob([note.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.topic}.txt`;
    a.click();
  };

  return (
    <div className="p-8 bg-white shadow rounded-lg max-w-4xl mx-auto">
      {/* Action Buttons */}
      <div className="flex gap-4 mb-6 no-print">
        <button onClick={handlePrint} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded font-medium text-sm">Print Note</button>
        <button onClick={handleDownload} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded font-medium text-sm">Download (.txt)</button>
      </div>

      <h1 className="text-3xl font-bold mb-2">{note.topic}</h1>
      <article className="prose prose-blue max-w-none">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </article>

      <style jsx global>{`
        @media print { .no-print { display: none; } }
      `}</style>
    </div>
  );
}