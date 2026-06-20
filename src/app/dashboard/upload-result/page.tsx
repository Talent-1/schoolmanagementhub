import { prisma } from "@/lib/prisma";
import SubjectMappingForm from "@/components/SubjectMappingForm";

export default async function UploadResultsPage() {
  // Added 'include: { parentClass: true }' to fetch class hierarchy
  const [classes, subjects] = await Promise.all([
    prisma.class.findMany({ 
      include: { parentClass: true }, 
      orderBy: { name: 'asc' } 
    }),
    prisma.subject.findMany({ 
      where: { isActive: true }, 
      orderBy: { name: 'asc' } 
    })
  ]);

  const departments = Array.from(new Set(subjects.map(s => s.department).filter(Boolean)));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-900">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-black">Result Management</h1>
          <p className="opacity-80 text-sm">Download templates and upload results</p>
        </div>
        
        <SubjectMappingForm 
            classes={classes || []} 
            subjects={subjects || []} 
            departments={departments as string[] || []}
        />
      </div>
    </div>
  );
}