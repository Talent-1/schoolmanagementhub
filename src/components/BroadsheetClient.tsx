"use client";

import { utils, writeFile } from "xlsx";
import React from "react";

export default function BroadsheetClient({ managedClass, subjects, rankedStudents, termName }: any) {
  const exportToExcel = () => {
    const table = document.getElementById("broadsheet-table");
    const wb = utils.table_to_book(table);
    writeFile(wb, `${managedClass.parentClass?.name || ""}-${managedClass.name}_Broadsheet.xlsx`);
  };

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">{managedClass.parentClass?.name} {managedClass.name} - {termName}</h1>
        <button onClick={exportToExcel} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700">
          Download Excel
        </button>
      </div>

      <div className="overflow-x-auto bg-white p-6 rounded-3xl border shadow-sm">
        <table id="broadsheet-table" className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-2">Pos</th>
              <th className="border p-2 text-left">Name</th>
              {subjects.map((s: any) => <th key={s.id} className="border p-2" colSpan={3}>{s.name}</th>)}
              <th className="border p-2">Total</th>
              <th className="border p-2">Avg</th>
            </tr>
          </thead>
          <tbody>
            {rankedStudents.map((student: any) => (
              <tr key={student.id} className="hover:bg-slate-50">
                <td className="border p-2 text-center font-bold text-blue-600">{student.rank}</td>
                <td className="border p-2 font-medium">{student.lastName} {student.firstName}</td>
                {subjects.map((sub: any) => {
                  const res = student.results.find((r: any) => r.subjectId === sub.id);
                  return (
                    <React.Fragment key={sub.id}>
                      <td className="border p-2 text-center">{res?.caScore ?? "-"}</td>
                      <td className="border p-2 text-center">{res?.examScore ?? "-"}</td>
                      <td className="border p-2 text-center font-bold">{res?.totalScore ?? "-"}</td>
                    </React.Fragment>
                  );
                })}
                <td className="border p-2 text-center font-bold">{(student.totalScore ?? 0).toFixed(0)}</td>
                <td className="border p-2 text-center font-bold">{(student.avgScore ?? 0).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}