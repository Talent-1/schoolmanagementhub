"use client";

import { useState, useEffect } from "react";
import { searchStaff, updateAssignment, getAllStaff } from "./actions";
import { Check, Search, ChevronDown } from "lucide-react";

interface Props {
  subject: { id: string; name: string };
  classId: string;
  schoolId: string;
  assignedStaff?: { id: string; name: string } | null;
}

export default function AssignmentRow({ subject, classId, schoolId, assignedStaff }: Props) {
  const [query, setQuery] = useState(assignedStaff?.name || "");
  const [results, setResults] = useState<{ id: string; name: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAllStaff, setShowAllStaff] = useState(false);
  const [allStaff, setAllStaff] = useState<{ id: string; name: string }[]>([]);
  const isAssigned = !!assignedStaff;

  // Fetch all staff on mount for debugging
  useEffect(() => {
    const fetchAll = async () => {
      const staff = await getAllStaff(schoolId);
      setAllStaff(staff);
    };
    fetchAll();
  }, [schoolId]);

  // Search effect with minimal debounce for real-time results
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 1) {
        const data = await searchStaff(query, schoolId);
        setResults(data);
      } else {
        setResults([]);
      }
    }, 100);

    return () => clearTimeout(delayDebounceFn);
  }, [query, schoolId]);

  const handleSelect = async (staffId: string, staffName: string) => {
    setIsSaving(true);
    await updateAssignment(subject.id, classId, staffId);
    setQuery(staffName);
    setResults([]);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000); // Reset "Saved" checkmark after 2s
  };

  return (
    <tr className={`transition-colors ${isAssigned ? 'bg-green-50 hover:bg-green-50' : 'hover:bg-slate-50'}`}>
      <td className="p-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">{subject.name}</span>
          {isAssigned && (
            <span className="text-[10px] font-black uppercase px-2 py-1 bg-green-200 text-green-800 rounded-lg">
              Assigned
            </span>
          )}
        </div>
      </td>
      <td className="p-6 relative">
        <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
          isAssigned
            ? 'bg-green-100 border-green-300 focus-within:border-green-400 focus-within:bg-green-50'
            : 'bg-slate-100 border-slate-200 focus-within:border-blue-400 focus-within:bg-white'
        }`}>
          <Search size={16} className={isAssigned ? 'text-green-600' : 'text-slate-400'} />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSaved(false); }}
            placeholder={isAssigned ? `Assigned: ${assignedStaff?.name}` : "Type Name or ID..."}
            className={`bg-transparent outline-none text-sm font-medium w-full ${
              isAssigned ? 'text-green-700 opacity-70' : 'text-slate-600'
            }`}
          />
          {isSaving && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
          {saved && <Check size={18} className="text-green-500" />}
        </div>

        {/* Dropdown Results */}
        {query.length > 0 && (
          <div className="absolute left-6 right-6 mt-1 bg-white border border-slate-200 shadow-xl rounded-2xl z-10 overflow-hidden">
            {results.length > 0 ? (
              results.map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => handleSelect(staff.id, staff.name)}
                  className="w-full text-left p-4 hover:bg-blue-50 flex items-center gap-3 transition-colors border-b border-slate-100 last:border-b-0"
                >
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{staff.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">ID: {staff.id.slice(-6)}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 space-y-2">
                <p className="text-center text-slate-400 text-sm font-medium">
                  No teachers found matching &quot;{query}&quot;
                </p>
                <button
                  type="button"
                  onClick={() => setShowAllStaff(!showAllStaff)}
                  className="w-full text-center text-blue-600 hover:text-blue-700 text-xs font-bold py-2 flex items-center justify-center gap-1 hover:bg-blue-50 rounded transition-colors"
                >
                  <ChevronDown size={14} />
                  View All {allStaff.length} Teachers
                </button>
              </div>
            )}
          </div>
        )}

        {/* Show All Staff List */}
        {showAllStaff && (
          <div className="absolute left-6 right-6 mt-1 bg-white border border-slate-200 shadow-xl rounded-2xl z-10 overflow-y-auto max-h-64">
            {allStaff.length > 0 ? (
              allStaff.map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => handleSelect(staff.id, staff.name)}
                  className="w-full text-left p-3 hover:bg-blue-50 flex items-center gap-3 transition-colors border-b border-slate-100 last:border-b-0"
                >
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold text-[10px]">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{staff.name}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">ID: {staff.id.slice(-6)}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-slate-400 text-xs font-medium">
                No teachers registered in this school
              </div>
            )}
          </div>
        )}
      </td>
      <td className="p-6 text-right">
        {/* Optional: Add a 'Clear' button here if needed */}
      </td>
    </tr>
  );
}