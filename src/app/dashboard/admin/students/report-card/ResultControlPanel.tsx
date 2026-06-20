"use client";
import { updateStudentResultStatus } from "@/admin/students/computeEngine";

export default function ResultControlPanel({ summary }) {
  const handleStatusChange = async (newStatus: any) => {
    await updateStudentResultStatus(summary.id, newStatus);
    alert(`Status updated to ${newStatus}`);
  };

  return (
    <div className="flex gap-2 p-4 border rounded">
      <button onClick={() => handleStatusChange('PUBLISHED')} className="bg-green-600 text-white p-2">Publish</button>
      <button onClick={() => handleStatusChange('WITHHELD')} className="bg-yellow-600 text-white p-2">Withhold</button>
      <button onClick={() => handleStatusChange('CANCELLED')} className="bg-red-600 text-white p-2">Cancel</button>
    </div>
  );
}