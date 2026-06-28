"use client";

import { useState, useEffect } from "react";
import { getFormData, generateAndSaveNote } from "@/app/dashboard/teacher/notes/actions";

type NoteOption = { id: string; name: string | null; department?: string | null; section?: string | null };

export default function NoteGenerator() {
  const [data, setData] = useState<{ subjects: NoteOption[]; classes: NoteOption[]; departments: NoteOption[] }>({ subjects: [], classes: [], departments: [] });
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedClassName, setSelectedClassName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [deptId, setDeptId] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFormData().then((res) => {
      if (res.success) setData({ subjects: res.subjects, classes: res.classes, departments: res.departments });
    });
  }, []);

  // Professional check for SSS (Senior Secondary)
  const isSss = selectedClassName.toLowerCase().includes("sss");

  const handleGenerate = async () => {
    if (!subjectId || !topic || !selectedClassId || (isSss && !deptId)) {
      alert("Please fill in all required fields (including Department for SSS).");
      return;
    }

    setLoading(true);
    try {
      const result = await generateAndSaveNote(
        subjectId,
        topic,
        "3rd Term", 
        "2026/2027",
        selectedClassId,
        isSss ? deptId : undefined
      );

      if (result.success) {
        alert("Lesson note generated and saved successfully!");
        setTopic(""); 
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Generation error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-6 text-gray-800">New Lesson Note</h2>

      {/* Class Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Class</label>
        <select 
          title="Class"
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" 
          onChange={(e) => {
            const id = e.target.value;
            setSelectedClassId(id);
            const selected = data.classes.find((c) => c.id === id);
            setSelectedClassName(selected?.name || "");
          }}
        >
          <option value="">Select Class</option>
          {data.classes.map((c) => (
            <option key={c.id} value={c.id}>
              {/* OPTION 1: If you have separate fields: {c.level} - {c.section}
                  OPTION 2: If you only have a name field: {c.name}
              */}
              {c.name ?? "Unnamed"}
            </option>
          ))}
        </select>
      </div>

      {/* Conditional Department Field for SSS */}
      {isSss && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">Department</label>
          <select title="Department" className="w-full border p-2 rounded" onChange={(e) => setDeptId(e.target.value)}>
            <option value="">Select Department</option>
            {data.departments.map((d) => (
              <option key={d.id} value={d.name ?? ""}>{d.name ?? "Unnamed"}</option>
            ))}
          </select>
        </div>
      )}

      {/* Subject Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Subject</label>
        <select title="Subject" className="w-full border p-2 rounded" onChange={(e) => setSubjectId(e.target.value)}>
          <option value="">Select Subject</option>
          {data.subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Topic Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1 text-gray-700">Topic</label>
        <input 
          className="w-full border p-2 rounded"
          placeholder="e.g. Introduction to Photosynthesis"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>
      
      <button 
        onClick={handleGenerate}
        disabled={loading}
        className={`w-full py-2 rounded font-semibold text-white transition ${
          loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Generating..." : "Generate & Save Note"}
      </button>
    </div>
  );
}
