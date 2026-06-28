"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendBulkSmsAction } from "@/app/dashboard/admin/sms/actions";
import { MessageSquare, ArrowLeft, Send } from "lucide-react";

export default function SmsComposer({ schoolId, classes }: { schoolId: string; classes: any[] }) {
  const [classId, setClassId] = useState<string>("ALL");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const router = useRouter();

  // Preview logic to show how placeholders render
  const preview = message
    .replace(/{{studentName}}/g, "John Doe")
    .replace(/{{studentId}}/g, "12345");

  async function handleSend() {
    if (!message) return alert("Please type a message first.");
    setIsSending(true);
    
    try {
      const result = await sendBulkSmsAction({ classId }, message, schoolId);
      alert(`Success! Sent ${result.sentCount} messages.`);
      // Optional: Clear message after successful send
      setMessage(""); 
    } catch {
      alert("Failed to send messages. Please check the logs.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      {/* Navigation: Back to Dashboard */}
      <button 
        onClick={() => router.push("/dashboard/admin")} 
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <MessageSquare size={20} /> SMS Composer
      </h2>

      {/* Target Selection */}
      <div className="mb-4">
        <label htmlFor="sms-target" className="block text-sm font-medium text-slate-700 mb-1">Select Target</label>
        <select
          id="sms-target"
          className="w-full p-2 border border-slate-300 rounded-md"
          onChange={(e) => setClassId(e.target.value)}
          value={classId}
          aria-label="Select Target"
        >
          <option value="ALL">All Students</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>

      {/* Message Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">Message Template</label>
        <textarea
          className="w-full p-3 border border-slate-300 rounded-md h-32 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Type your message... Use {{studentName}} and {{studentId}} as tags."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* Live Preview */}
      <div className="text-xs text-slate-500 mb-6 bg-slate-50 p-3 rounded border border-slate-200">
        <strong>Preview (for a sample student):</strong> 
        <p className="mt-1 italic">{preview || "Your message will appear here..."}</p>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={isSending || !message}
        className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
      >
        {isSending ? (
          "Sending..."
        ) : (
          <>
            <Send size={18} /> Send Bulk SMS
          </>
        )}
      </button>
    </div>
  );
}