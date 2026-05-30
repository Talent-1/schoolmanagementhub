"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ClassSelector({ 
  parentClasses, 
  childClasses,
  schoolId,
  selectedParentId
}: { 
  parentClasses: { id: string, name: string }[], 
  childClasses: { id: string, name: string }[],
  schoolId: string,
  selectedParentId?: string
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedParent, setSelectedParent] = useState(selectedParentId || "");
  const [selectedChild, setSelectedChild] = useState(searchParams.get("class") || "");

  // Reset child selection when parent changes
  useEffect(() => {
    setSelectedChild("");
  }, [selectedParent]);

  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parentId = e.target.value;
    setSelectedParent(parentId);
    // Navigate with parent class selected, no child yet
    router.push(`?school=${schoolId}&parentClass=${parentId}`);
  };

  const handleChildChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const childId = e.target.value;
    setSelectedChild(childId);
    // Navigate with both parent and child selected
    router.push(`?school=${schoolId}&parentClass=${selectedParent}&class=${childId}`);
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 mb-8 space-y-4">
      {/* Parent Class Dropdown */}
      <div>
        <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
          Select Parent Class (Level)
        </label>
        <select 
          className="w-full md:w-1/3 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all"
          value={selectedParent}
          onChange={handleParentChange}
          aria-label="Select Parent Class"
        >
          <option value="">Choose a Level...</option>
          {parentClasses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Child Class Dropdown - Only show if parent is selected */}
      {selectedParent && (
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
            Select Class Arm
          </label>
          <select 
            className="w-full md:w-1/3 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all"
            value={selectedChild}
            onChange={handleChildChange}
            aria-label="Select Class Arm"
          >
            <option value="">Choose an Arm...</option>
            {childClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}