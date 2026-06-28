"use client";
import { useState, useMemo } from 'react';
import { uploadExcelResults } from "@/app/dashboard/upload-result/actions";

type FormOption = { id: string; name: string; parentClass?: { name?: string | null } | null; section?: string | null; department?: string | null };

export default function SubjectMappingForm({ classes = [], subjects = [], departments = [] }: { classes?: FormOption[]; subjects?: FormOption[]; departments?: string[] }) {
  // State for Download Logic
  const [downloadClassId, setDownloadClassId] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  
  // State for Upload Logic
  const [uploadClassId, setUploadClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [term, setTerm] = useState("3rd Term");
  
  // Professional Dynamic Session Initialization
  const [session, setSession] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    // Academic year starts in September (month 8)
    return now.getMonth() >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
  });

  // --- ORIGINAL DYNAMIC FILTERING LOGIC ---
  const selectedClass = useMemo(() => classes.find(c => c.id === downloadClassId), [classes, downloadClassId]);
  
  const currentSection = useMemo(() => {
    if (!selectedClass) return null;
    const name = (selectedClass.parentClass?.name || selectedClass.name || "").toUpperCase();
    return name.includes("JSS") ? "Junior" : name.includes("SS") ? "Senior" : null;
  }, [selectedClass]);

  const availableDepts = useMemo(() => {
    if (currentSection !== "Senior") return [];
    const fallback = Array.from(new Set(
      subjects
        .filter((s) => s.section?.toUpperCase().includes("SENIOR"))
        .map((s) => s.department)
        .filter((dept): dept is string => typeof dept === "string" && dept.length > 0)
    ));
    return departments.length > 0 ? departments : fallback;
  }, [currentSection, departments, subjects]);

  const filteredSubjects = useMemo(() => {
    if (!currentSection) return [];
    return subjects.filter(s => {
      const matchesSection = s.section?.toUpperCase().includes(currentSection.toUpperCase());
      const matchesDept = currentSection === "Junior" || (selectedDept ? s.department === selectedDept : true);
      return matchesSection && matchesDept;
    });
  }, [currentSection, selectedDept, subjects]);

  return (
    <div className="p-6 space-y-8 bg-white rounded-xl border">
      
      {/* 1. DOWNLOAD TEMPLATE */}
      <div className="border-b pb-6">
        <h2 className="text-lg font-bold mb-4">1. Download Template</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select title="Class" onChange={(e) => { setDownloadClassId(e.target.value); setSelectedDept(""); }} className="p-2 border rounded">
            <option value="">Select Class...</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.parentClass ? `${c.parentClass.name} (${c.name})` : c.name}</option>)}
          </select>
          {currentSection === "Senior" && (
            <select title="Department" onChange={(e) => setSelectedDept(e.target.value)} value={selectedDept} className="p-2 border rounded">
              <option value="">Select Dept...</option>
              {availableDepts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          )}
          <select title="Subject" onChange={(e) => setSelectedSubjectId(e.target.value)} className="p-2 border rounded">
            <option value="">Select Subject...</option>
            {filteredSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <a href={downloadClassId && selectedSubjectId ? `/dashboard/upload-result/download-template?classId=${downloadClassId}&subjectId=${selectedSubjectId}` : "#"}
           className={`block mt-4 p-2 text-center rounded ${downloadClassId && selectedSubjectId ? 'bg-green-600 text-white' : 'bg-gray-200 pointer-events-none'}`}>
          Download Template
        </a>
      </div>

      {/* 2. UPLOAD FORM */}
      <form action={async (formData) => {
        const res = await uploadExcelResults(formData);
        alert(res.message);
      }} className="space-y-4">
        <h2 className="text-lg font-bold">2. Upload Filled Template</h2>
        
        <select name="classId" title="Class" value={uploadClassId} onChange={(e) => setUploadClassId(e.target.value)} className="w-full p-2 border rounded" required>
          <option value="">Select Class to Upload Results For...</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.parentClass ? `${c.parentClass.name} (${c.name})` : c.name}</option>)}
        </select>
        
        <input 
          name="teacherId" 
          placeholder="Enter Teacher ID (e.g., 25BB69)" 
          value={teacherId} 
          onChange={(e) => setTeacherId(e.target.value)} 
          className="w-full p-2 border rounded" 
          required 
        />

        <div className="grid grid-cols-2 gap-4">
          <select name="term" value={term} onChange={(e) => setTerm(e.target.value)} className="p-2 border rounded">
            <option value="1st Term">1st Term</option>
            <option value="2nd Term">2nd Term</option>
            <option value="3rd Term">3rd Term</option>
          </select>
          <input name="session" title="Session" placeholder="Session" value={session} onChange={(e) => setSession(e.target.value)} className="p-2 border rounded" required />
        </div>

        <input type="file" name="file" title="Result File" placeholder="Result File" required className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
          Process Upload
        </button>
      </form>
    </div>
  );
}