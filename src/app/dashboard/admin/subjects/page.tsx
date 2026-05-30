// src/app/dashboard/admin/subjects/page.tsx
import { prisma } from "@/lib/prisma";
import SubjectSettings from "./SubjectSettings";

export default async function SubjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ school?: string }>;
}) {
  const { school: schoolParam } = await searchParams;
  const school = schoolParam
    ? await prisma.school.findUnique({ where: { id: schoolParam } })
      ?? await prisma.school.findUnique({ where: { schoolCode: schoolParam } })
    : null;
  const schoolId = school?.id || "school-01";

  // 2. Fetch subjects linked to this specific school ID
  const subjects = await prisma.subject.findMany({
    where: { 
      schoolId: schoolId 
    },
    orderBy: [
      { section: 'asc' },
      { name: 'asc' }
    ]
  });

  return (
    <div className="p-6 md:p-10 bg-white min-h-screen">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Curriculum Management</h1>
          <p className="text-slate-500 font-medium">Enable or disable subjects for the current academic session.</p>
        </div>
        
        {/* Helper tag to see what ID is being used */}
        <div className="bg-slate-100 px-3 py-1 rounded text-[10px] font-mono text-slate-400">
          ID: {schoolId}
        </div>
      </div>
      
      {subjects.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
          <p className="text-slate-400 font-bold text-lg">No subjects found in the database.</p>
          <p className="text-slate-400 text-sm mt-2">
            Make sure your subjects in Supabase have the <code className="bg-slate-200 px-1 rounded">schoolId</code> set to <span className="font-bold">&quot;{schoolId}&quot;</span>.
          </p>
        </div>
      ) : (
        <SubjectSettings initialSubjects={subjects} schoolId={schoolId} />
      )}
    </div>
  );
}