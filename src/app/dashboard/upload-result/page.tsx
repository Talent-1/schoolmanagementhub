"use client";

import { useState } from "react";
import { uploadExcelResults } from "./actions";

export default function UploadResultsPage() {
  const [section, setSection] = useState(""); // JUNIOR or SENIOR
  const [dept, setDept] = useState(""); // SCIENCES, ARTS, etc.
  const [isPending, setIsPending] = useState(false);

  // Logic to determine which subjects to show
  let visibleSubjects: string[] = [];
  if (section === "JUNIOR") {
    visibleSubjects = NERDC_SUBJECTS.JUNIOR;
  } else if (section === "SENIOR") {
    visibleSubjects = [...NERDC_SUBJECTS.SENIOR.GENERAL];
    if (dept && dept !== "GENERAL") {
      visibleSubjects = [...visibleSubjects, ...NERDC_SUBJECTS.SENIOR[dept as keyof typeof NERDC_SUBJECTS.SENIOR]];
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-900">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-black">NERDC Result Management</h1>
          <p className="opacity-80 text-sm">Upload and map academic records for Hillcity Schools</p>
        </div>

        <form action={uploadExcelResults} className="p-6 md:p-10 space-y-8">
          
          {/* Step 1: Selection Logic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">School Section</label>
              <select 
                onChange={(e) => { setSection(e.target.value); setDept(""); }}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              >
                <option value="">Select Section</option>
                <option value="JUNIOR">Junior Secondary (JSS)</option>
                <option value="SENIOR">Senior Secondary (SS)</option>
              </select>
            </div>

            {section === "SENIOR" && (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Department</label>
                <select 
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="SCIENCES">Sciences</option>
                  <option value="ARTS">Arts & Humanities</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="ELECTRICAL">Electrical Work</option>
                  <option value="BUILDING">Building Construction</option>
                </select>
              </div>
            )}
          </div>

          {/* Step 2: Mapping Logic (Only shows if section is selected) */}
          {section && (
            <div className="space-y-6">
               <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-8">
                <label className="block text-sm font-bold text-blue-800 mb-2">Student Identifier Column (Reg Number)</label>
                <input name="regNumCol" placeholder="e.g. A" className="w-full p-3 border rounded-lg uppercase font-mono" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {visibleSubjects.map((subject) => (
                  <div key={subject} className="flex flex-col">
                    <label className="text-[11px] font-bold text-slate-500 mb-1">Which column contains {subject}?</label>
                    <input 
                      name={`col_${subject}`} 
                      placeholder="e.g. C" 
                      className="p-2.5 border border-slate-200 rounded-lg focus:border-blue-500 outline-none uppercase font-mono text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: File Upload */}
          <div className="pt-8 border-t border-slate-100">
            <label className="block text-sm font-bold text-slate-700 mb-4">Select Excel File (.xls, .xlsx)</label>
            <input 
              type="file" 
              name="excelFile"
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor:pointer"
              required 
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
          >
            Proceed to Upload
          </button>
        </form>
      </div>
    </div>
  );
}