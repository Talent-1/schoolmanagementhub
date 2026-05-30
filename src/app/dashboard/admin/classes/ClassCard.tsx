"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Layers } from "lucide-react";
import ClassToggle from "./ClassToggle";
import AddClassModal from "./AddClassModal";

export default function ClassCard({ main, schoolId }: { main: any, schoolId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white rounded-[2.5rem] border transition-all duration-300 ${
      isOpen ? 'border-blue-400 shadow-xl' : 'border-slate-200 shadow-sm'
    }`}>
      {/* Header Row */}
      <div 
        className="p-6 flex justify-between items-center cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-colors ${
            isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
          }`}>
            {isOpen ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">{main.name}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Layers size={12} /> {main.subClasses.length} Arms Configured
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <ClassToggle classId={main.id} initialStatus={main.isActive} />
          <AddClassModal schoolId={schoolId} parentId={main.id} parentName={main.name} />
        </div>
      </div>

      {/* Expandable Sub-classes (The "Folder" contents) */}
      {isOpen && (
        <div className="px-6 pb-8 pt-2 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-slate-50 pt-6">
            {main.subClasses.map((sub: any) => (
              <div 
                key={sub.id} 
                className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors group"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{main.name}</span>
                  <span className="font-bold text-slate-700">Arm {sub.name}</span>
                </div>
                <ClassToggle classId={sub.id} initialStatus={sub.isActive} isSmall />
              </div>
            ))}
            {main.subClasses.length === 0 && (
              <div className="col-span-full py-4 text-center text-slate-400 text-sm font-medium italic">
                No arms added to this level yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}