import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SubjectSettings from "./SubjectSettings";

export default async function SubjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ school?: string }>;
}) {
  const { school: schoolParam } = await searchParams;

  // 1. If no school param is provided, redirect to a selector or dashboard
  if (!schoolParam) {
    redirect("/dashboard");
  }

  // 2. Resolve the school
  const school = await prisma.school.findUnique({ 
    where: { id: schoolParam } 
  }) ?? await prisma.school.findUnique({ 
    where: { schoolCode: schoolParam } 
  });

  // 3. If school not found, handle gracefully
  if (!school) {
    return <div className="p-10 text-red-600 font-bold">School not found. Please check the URL.</div>;
  }

  const schoolId = school.id;

  // 4. Fetch subjects linked specifically to this schoolId
  const subjects = await prisma.subject.findMany({
    where: { schoolId },
    orderBy: [{ section: 'asc' }, { name: 'asc' }]
  });

  return (
    <div className="p-6 md:p-10 bg-white min-h-screen">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Curriculum Management</h1>
          <p className="text-slate-500 font-medium">Enable or disable subjects for the current academic session.</p>
        </div>
        
        <div className="bg-slate-100 px-3 py-1 rounded text-[10px] font-mono text-slate-400 uppercase">
          School: {school.name}
        </div>
      </div>
      
      {subjects.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
          <p className="text-slate-400 font-bold text-lg">No subjects found for this school.</p>
        </div>
      ) : (
        <SubjectSettings initialSubjects={subjects} schoolId={schoolId} />
      )}
    </div>
  );
}