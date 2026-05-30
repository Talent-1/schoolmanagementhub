// src/app/register/page.tsx
import { prisma } from "@/lib/prisma";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  // This fetch triggers your "Loading..." spinner automatically!
  const schools = await prisma.school.findMany();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border border-slate-200">
        <h1 className="text-2xl font-bold mb-2 text-slate-800">Staff Onboarding</h1>
        <p className="text-sm text-slate-500 mb-6">Add new academic staff to HillCity Portal</p>
        
        <RegisterForm schools={schools} />
      </div>
    </div>
  );
}