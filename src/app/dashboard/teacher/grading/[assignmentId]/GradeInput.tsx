"use client";

import { useState } from "react";
import { updateGrade } from "../../actions"; // Importing your server action

export default function GradeInput({ assignmentId, studentId, initialScore }: { 
  assignmentId: string; 
  studentId: string; 
  initialScore: number 
}) {
  const [score, setScore] = useState(initialScore);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await updateGrade(assignmentId, studentId, score);
    setLoading(false);
    alert("Grade saved successfully!");
  };

  return (
    <div className="flex gap-2">
      <input 
        type="number" 
        value={score}
        onChange={(e) => setScore(Number(e.target.value))}
        className="border p-2 rounded w-20"
      />
      <button 
        onClick={handleSave}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}