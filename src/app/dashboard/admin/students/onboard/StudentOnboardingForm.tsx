"use client";

import { useState } from "react";
import { registerStudent } from "./actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

type ClassWithParent = {
  id: string;
  name: string;
  section: string;
  parentClass: { name: string } | null;
};

export default function StudentOnboardingForm({ classes, schoolId }: { classes: ClassWithParent[], schoolId: string }) {
  const [modalData, setModalData] = useState<{name: string, pass: string, reg: string} | null>(null);
  const [firstName, setFirstName] = useState("");

  async function handleAction(formData: FormData) {
    const result = await registerStudent(formData);
    if (result.success) {
      setModalData({ 
        name: result.firstName, 
        pass: result.temporaryPassword,
        reg: result.regNumber 
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-sm border border-slate-200 rounded-3xl mt-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Register New Student</h2>
      <form action={handleAction} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="hidden" name="schoolId" value={schoolId} />
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
          <input name="firstName" required onChange={(e) => setFirstName(e.target.value)} className="w-full border p-3 rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
          <input name="lastName" required className="w-full border p-3 rounded-xl" />
        </div>

        {/* New Field Added Here */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Parent Phone Number</label>
          <input type="tel" name="parentPhoneNumber" required placeholder="e.g. 08012345678" className="w-full border p-3 rounded-xl" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Default Password</label>
          <input name="password" defaultValue={firstName} key={firstName} className="w-full border p-3 rounded-xl bg-slate-50" />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Class & Arm</label>
          <select name="classId" required className="w-full border p-3 rounded-xl">
            <option value="">Select a Class Arm</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.parentClass?.name} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <SubmitButton text="Register Student" />
        </div>
      </form>

      {/* Success Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-3xl text-center shadow-2xl max-w-sm w-full">
            <h3 className="text-xl font-bold text-green-600 mb-4">Registration Successful!</h3>
            <div className="text-left bg-slate-50 p-4 rounded-xl space-y-2">
              <p className="text-sm">Student: <strong>{modalData.name}</strong></p>
              <p className="text-sm">Reg Number: <strong className="text-blue-700">{modalData.reg}</strong></p>
              <p className="text-sm">Temp Password: <strong className="text-blue-700">{modalData.pass}</strong></p>
            </div>
            <button onClick={() => setModalData(null)} className="mt-6 w-full bg-slate-900 text-white py-2 rounded-xl">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}