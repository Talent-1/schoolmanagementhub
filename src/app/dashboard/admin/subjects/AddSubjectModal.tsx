"use client";
import { useState } from "react";
import { addNewSubject } from "./actions";

export function AddSubjectModal({ isOpen, onClose, schoolId, onSuccess }: {
  isOpen: boolean,
  onClose: () => void;
  schoolId: string;
  onSuccess?: (subject: any) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const name = formData.get("name") as string;
    const section = formData.get("section") as string;
    const department = formData.get("department") as string;

    const result = await addNewSubject({ name, section, department, schoolId });

    setIsSubmitting(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    if (result.subject && onSuccess) {
      onSuccess(result.subject);
    }
    window.setTimeout(() => onClose(), 800);
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Add NERDC Subject</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl transition-colors">&times;</button>
        </div>

        <form action={handleSubmit} className="p-6 space-y-5">
          {error ? (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
              Subject added successfully. Closing now...
            </div>
          ) : null}

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5" htmlFor="subject-name">Subject Name</label>
            <input 
              id="subject-name"
              name="name" 
              placeholder="e.g. Further Mathematics" 
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-medium" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5" htmlFor="subject-section">Section</label>
              <select id="subject-section" name="section" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-medium" required>
                <option value="JUNIOR">Junior (JSS)</option>
                <option value="SENIOR">Senior (SS)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5" htmlFor="subject-department">Department</label>
              <select id="subject-department" name="department" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-medium">
                <option value="GENERAL">General</option>
                <option value="SCIENCES">Sciences</option>
                <option value="ARTS">Arts</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="TECHNICAL">Technical</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-slate-300 shadow-xl shadow-blue-100 active:scale-[0.98]"
          >
            {isSubmitting ? "Saving to Database..." : "Register Subject"}
          </button>
        </form>
      </div>
    </div>
  );
}