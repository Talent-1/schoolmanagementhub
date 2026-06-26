"use client";

import React, { useRef } from 'react';
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function NoteView({ note }: { note: any }) {
  // 1. Create a reference to the container
  const noteRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();

  // 2. Updated PDF download logic that captures the FULL rendered component
  const handleDownloadPdf = async () => {
    const element = noteRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const doc = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    doc.save(`${note.topic.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    // 3. Attach the ref here so the capture includes everything inside
    <div className="p-8 bg-white shadow rounded-lg max-w-4xl mx-auto" ref={noteRef}>
      {/* Action Buttons */}
      <div className="flex gap-4 mb-6 no-print">
        <button 
          onClick={handlePrint} 
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded font-medium text-sm"
        >
          Print Note
        </button>
        <button 
          onClick={handleDownloadPdf} 
          className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded font-medium text-sm"
        >
          Download PDF
        </button>
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