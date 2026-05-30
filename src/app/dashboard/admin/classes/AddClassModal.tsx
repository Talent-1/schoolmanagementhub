"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { createClass } from "./actions";

interface Props {
  schoolId: string;
  parentId?: string;   // Optional: If present, we are adding an "Arm"
  parentName?: string; // Optional: For the UI label
}

export default function AddClassModal({ schoolId, parentId, parentName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await createClass(formData, schoolId, parentId);

    if (result.success) {
      toast.success(parentId ? "Class arm created successfully." : "Class level created successfully.");
      setIsOpen(false);
      setErrorMessage(null);
      (e.target as HTMLFormElement).reset();
    } else {
      setErrorMessage(result.error || "Could not save the class. Please try again.");
    }

    setIsPending(false);
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setErrorMessage(null);
        }}
        className={`${
          parentId 
            ? "p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white" 
            : "px-6 py-3 bg-slate-900 text-white hover:bg-black"
        } rounded-xl font-bold text-xs transition-all flex items-center gap-2`}
      >
        <Plus size={16} />
        {parentId ? `Add Arm to ${parentName}` : "Create New Level"}
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {parentId ? "Add Class Arm" : "New Level"}
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">
                    {parentId ? `Adding a sub-section to ${parentName}` : "Create a main academic level"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setErrorMessage(null);
                  }}
                  aria-label="Close modal"
                  className="text-slate-400 hover:text-slate-900"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">
                    {parentId ? "Arm Name (e.g., G, Blue, or Gold)" : "Level Name (e.g., JSS 1)"}
                  </label>
                  <input
                    name="name"
                    required
                    placeholder={parentId ? "Ex: G" : "Ex: JSS 1"}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold"
                  />
                </div>

                {/* Section is usually inherited or default for school types */}
                <input type="hidden" name="section" value="SECONDARY" />

                {errorMessage && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-black transition-all disabled:opacity-50"
                >
                  {isPending ? "SAVING TO DATABASE..." : "CONFIRM & CREATE"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}