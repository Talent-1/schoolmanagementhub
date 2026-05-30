"use client";

import { useState } from "react";
import { createStaff } from "./actions";
import { X, Loader2, ShieldCheck, UserPlus } from "lucide-react";

export default function AddStaffModal({ schoolId }: { schoolId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await createStaff(formData, schoolId);
    
    setLoading(false);
    if (result.success) {
      setGeneratedPassword(result.defaultPassword || null);
    } else {
      alert(result.error);
    }
  }

  const closeModal = () => {
    setIsOpen(false);
    setGeneratedPassword(null);
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)} 
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100"
    >
      <UserPlus size={20} />
      Add New Staff
    </button>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative border border-slate-100">
        
        {/* Close Button */}
        <button 
          onClick={closeModal} 
          className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        {generatedPassword ? (
          /* SUCCESS STATE */
          <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Staff Registered!</h2>
            <p className="text-slate-500 mt-2 px-4">
              Give these credentials to the teacher for their first login:
            </p>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Default Password</p>
              <code className="text-lg font-mono font-bold text-blue-600 select-all cursor-pointer">
                {generatedPassword}
              </code>
            </div>

            <button 
              onClick={closeModal}
              className="mt-8 w-full bg-slate-900 text-white p-5 rounded-2xl font-bold hover:bg-black transition-all"
            >
              Back to Directory
            </button>
          </div>
        ) : (
          /* FORM STATE */
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Register Staff</h2>
              <p className="text-slate-500 font-medium">Create a new faculty account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Full Name</label>
                <input 
                  name="name" 
                  required 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                  placeholder="e.g. Amara Onyejekwe" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                  placeholder="staff@school.com" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Assign Role</label>
                <select 
                  name="role" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="DEAN">Dean of Studies</option>
                  <option value="VP_ACADEMICS">VP Academics</option>
                </select>
              </div>

              <button 
                disabled={loading} 
                type="submit" 
                className="w-full bg-slate-900 text-white p-5 rounded-2xl font-bold flex justify-center items-center gap-3 hover:bg-black transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Confirm Registration"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}