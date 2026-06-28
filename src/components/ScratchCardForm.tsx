"use client";

import { useActionState } from "react";
import { verifyScratchCard } from "@/app/dashboard/admin/students/computeEngine";

/**
 * ScratchCardForm
 * This component provides a secure input form for students to unlock their results.
 * It uses the Server Action 'useScratchCard' to validate the PIN/Serial.
 */
export function ScratchCardForm({ 
  studentId, 
  term, 
  session 
}: { 
  studentId: string; 
  term: string; 
  session: string; 
}) {
  // useActionState manages the form submission lifecycle
  // 'state' holds the return value from our server action (success/error)
  // 'action' is the function we pass to the <form>
  // 'isPending' is true while the server is processing the request
  const [state, action, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const pin = formData.get("pin") as string;
      const serial = formData.get("serial") as string;
      
      // We pass the details to our server-side function
      return await verifyScratchCard(studentId, pin, serial, term, session);
    },
    { success: false, error: "" } // Initial state
  );

  return (
    <div className="flex justify-center items-center py-10">
      <form 
        action={action} 
        className="w-full max-w-sm bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
      >
        <h3 className="text-xl font-black text-slate-800 mb-2">Unlock Result</h3>
        <p className="text-slate-500 text-sm mb-6">
          Please enter your scratch card details to view your report card for {term} {session}.
        </p>

        {/* PIN Input */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">PIN</label>
          <input 
            name="pin" 
            type="text" 
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Enter your PIN"
            required 
          />
        </div>

        {/* Serial Input */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Serial Number</label>
          <input 
            name="serial" 
            type="text" 
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Enter Serial Number"
            required 
          />
        </div>
        
        {/* Submit Button */}
        <button 
          type="submit"
          disabled={isPending} 
          className="w-full bg-slate-900 text-white p-3 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:bg-slate-400"
        >
          {isPending ? "Verifying..." : "Unlock Result"}
        </button>
        
        {/* Error Message */}
        {state?.error && (
          <p className="text-red-600 mt-4 text-sm font-bold text-center">
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
}