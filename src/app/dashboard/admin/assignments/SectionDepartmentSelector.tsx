"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SectionDepartmentSelector({
  sections,
  availableDepartments,
  schoolId,
  selectedSection,
}: {
  sections: string[];
  availableDepartments: string[];
  schoolId: string;
  selectedSection?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [section, setSection] = useState(selectedSection || "");
  const [department, setDepartment] = useState(searchParams.get("department") || "");

  // Reset department when section changes
  useEffect(() => {
    setDepartment("");
  }, [section]);

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSection = e.target.value;
    setSection(newSection);

    const params = new URLSearchParams(searchParams.toString());
    if (newSection) {
      params.set("section", newSection);
      params.delete("department");
    } else {
      params.delete("section");
      params.delete("department");
    }
    router.push(`?${params.toString()}`);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDepartment = e.target.value;
    setDepartment(newDepartment);

    const params = new URLSearchParams(searchParams.toString());
    if (newDepartment) {
      params.set("department", newDepartment);
    } else {
      params.delete("department");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
            Select Section
          </label>
          <select
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all"
            value={section}
            onChange={handleSectionChange}
            aria-label="Select Section"
          >
            <option value="">All Sections</option>
            {sections.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        {section && (
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
              Select Department
            </label>
            <select
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all"
              value={department}
              onChange={handleDepartmentChange}
              aria-label="Select Department"
            >
              <option value="">All Departments</option>
              {availableDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
