"use client";

import { useActionState, useEffect, useRef } from "react";
import { registerStaff } from "./action";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function RegisterForm({ schools }: { schools: any[] }) {
  // 1. Create a reference to the form so we can reset it
  const formRef = useRef<HTMLFormElement>(null);
  
  // 2. Use the Action State to track success/error
  const [state, formAction] = useActionState(registerStaff, null);

  // 3. Clear the form ONLY when registration is successful
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {/* 🟢 Success Alert */}
      {state?.success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-bold animate-in fade-in duration-500">
          ✅ {state.message}
        </div>
      )}
      
      {/* 🔴 Error Alert */}
      {state?.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-bold">
          ❌ {state.error}
        </div>
      )}

      {/* Inputs (Keep your existing styles here) */}
      <div className="space-y-4">
        <input name="name" type="text" required placeholder="Full Name" className="w-full border p-2.5 rounded-lg" />
        <input name="email" type="email" required placeholder="Email Address" className="w-full border p-2.5 rounded-lg" />
        <input name="password" type="password" required placeholder="Temporary Password" className="w-full border p-2.5 rounded-lg" />
        
        <select name="schoolId" title="School" required className="w-full border p-2.5 rounded-lg bg-white">
          {schools.map((school) => (
            <option key={school.id} value={school.id}>{school.name}</option>
          ))}
        </select>

        <select name="role" title="Role" className="w-full border p-2.5 rounded-lg bg-white">
          <option value="TEACHER">Teacher</option>
          <option value="DEAN">Dean of Studies</option>
          <option value="VP_ACADEMICS">VP Academics</option>
          <option value="ADMIN">Administrator</option>
        </select>
      </div>

      <SubmitButton 
        text="Register Staff Member" 
        loadingText="Onboarding to HillCity..." 
      />
    </form>
  );
}