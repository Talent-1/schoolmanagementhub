"use client";

import { useState } from "react";
import { toggleSubjectStatus } from "./actions";
import { AddSubjectModal } from "./AddSubjectModal";

interface Subject {
  id: string;
  name: string;
  section: string;
  department: string | null;
  isActive: boolean;
}

export default function SubjectSettings({ initialSubjects, schoolId }: { initialSubjects: Subject[]; schoolId: string }) {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleAddSubject(newSubject: Subject) {
    setSubjects(prev => [...prev, newSubject]);
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <input 
          type="text"
          placeholder="Search subjects..."
          className="w-full md:w-80 p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          + Add New Subject
        </button>
      </div>

      {/* Subject Lists by Section */}
      {["JUNIOR", "SENIOR"].map((section) => (
        <div key={section} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h3 className="font-black text-slate-700 uppercase tracking-wider text-sm">{section} Section</h3>
          </div>
          
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjects.filter(s => s.section === section).length > 0 ? (
              filteredSubjects.filter(s => s.section === section).map((sub) => (
                <div 
                  key={sub.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    sub.isActive ? "border-blue-100 bg-blue-50/30" : "border-slate-100 bg-slate-50/50 opacity-60"
                  }`}
                >
                  <div>
                    <p className={`font-bold text-sm ${sub.isActive ? "text-slate-900" : "text-slate-500"}`}>
                      {sub.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{sub.department || "General"}</p>
                  </div>
                  
                  {/* Custom Toggle Switch */}
                  <button
                    onClick={() => handleToggle(sub.id, sub.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      sub.isActive ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        sub.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center py-10 text-slate-400 text-sm italic">No subjects found in this section.</p>
            )}
          </div>
        </div>
      ))}

      {/* The Modal */}
      <AddSubjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} schoolId={schoolId} />
    </div>
  );
}