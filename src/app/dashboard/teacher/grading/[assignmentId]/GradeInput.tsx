"use client";

import { useState } from "react";
import { updateGrade } from "../../actions"; 

export default function GradeInput({ assignmentId, studentId, initialScore }: { 
  assignmentId: string; 
  studentId: string; 
  initialScore: string // Changed from number to string
}) {
  const [score, setScore] = useState(initialScore || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // Ensure you pass the string value to your action
    await updateGrade(assignmentId, studentId, score);
    setLoading(false);
    alert("Grade saved successfully!");
  };

  return (
    <div className="flex gap-2">
      <input 
        type="text" 
        value={score}
        // Use .toUpperCase() to ensure grades are saved consistently (e.g., 'a' becomes 'A')
        onChange={(e) => setScore(e.target.value.toUpperCase())}
        className="border p-2 rounded w-20 uppercase text-center"
        maxLength={2} // Prevents long inputs
        placeholder="A"
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