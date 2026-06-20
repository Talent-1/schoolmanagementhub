'use client';
import { useState } from 'react';
import ReportCardPrintView from "@/app/dashboard/admin/students/report-card/ReportCardPrintView";

export default function ReportCardManager({ datasets, activeTerm, activeSession }: any) {
  const [selectedStudent, setSelectedStudent] = useState(datasets[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[80vh]">
      {/* Sidebar: List of Students */}
      <div className="md:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-y-auto">
        <div className="p-4 border-b font-bold text-slate-700">Student List ({datasets.length})</div>
        {datasets.map((student: any) => (
          <button
            key={student.id}
            onClick={() => setSelectedStudent(student)}
            className={`w-full p-4 text-left border-b hover:bg-slate-50 transition ${selectedStudent.id === student.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
          >
            <p className="font-bold text-slate-900">{student.firstName} {student.lastName}</p>
            <p className="text-xs text-slate-500 font-mono">{student.regNumber}</p>
          </button>
        ))}
      </div>

      {/* Main View: Result Card */}
      <div className="md:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 overflow-y-auto">
        <ReportCardPrintView
          student={selectedStudent}
          school={selectedStudent.school}
          classLabel={selectedStudent.class?.parentClass?.name || selectedStudent.class?.name}
          results={selectedStudent.results}
          summary={selectedStudent.termSummaries[0]}
          term={activeTerm}
          session={activeSession}
        />
      </div>
    </div>
  );
}