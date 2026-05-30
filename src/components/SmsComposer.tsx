"use client";

import { useState } from "react";
import { sendBulkSmsAction } from "@/app/dashboard/admin/sms/actions";

export default function SmsComposer({ schoolId, classes }: { schoolId: string, classes: any[] }) {
  const [target, setTarget] = useState("ALL");
  const [message, setMessage] = useState("Dear Parent, {{studentName}}'s performance report for this term is ready.");
  const [isSending, setIsSending] = useState(false);

  // Live preview logic
  const previewMessage = `HillCity: ${message
    .replace("{{studentName}}", "John Doe")
    .replace("{{studentId}}", "ST-999")}`;

  const handleSubmit = async () => {
    setIsSending(true);
    await sendBulkSmsAction({ classId: target }, message, schoolId);
    setIsSending(false);
    alert("SMS Job Sent Successfully!");
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Compose Bulk SMS</h2>

      {/* Target Selector */}
      <div>
        <label className="block text-sm font-semibold text-slate-600 mb-2">Select Target</label>
        <select 
          className="w-full p-3 rounded-xl border border-slate-200"
          onChange={(e) => setTarget(e.target.value)}
        >
          <option value="ALL">Entire School (All Parents)</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Message Area */}
      <div>
        <label className="block text-sm font-semibold text-slate-600 mb-2">Message Content</label>
        <textarea 
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200"
        />
        <div className="flex gap-2 mt-2">
          <button onClick={() => setMessage(prev => prev + " {{studentName}}")} className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-bold hover:bg-slate-200">+ Student Name</button>
          <button onClick={() => setMessage(prev => prev + " {{studentId}}")} className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-bold hover:bg-slate-200">+ Student ID</button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm italic text-slate-500">
        <span className="font-bold text-slate-800">Preview:</span> {previewMessage}
      </div>

      <button 
        onClick={handleSubmit}
        disabled={isSending}
        className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
      >
        {isSending ? "Sending..." : "Send Bulk SMS"}
      </button>
    </div>
  );
}