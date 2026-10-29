import { prisma } from "@/lib/prisma";
import { redirect } from 'next/navigation';
import AddClassModal from "./AddClassModal";
import ClassCard from "./ClassCard"; 

// 1. Accept searchParams as a prop
export default async function ClassManagementPage({
  searchParams,
}: {
  searchParams: { school?: string };
}) {
  const schoolId = searchParams.school;

  // 2. Redirect to login if no school is provided
  if (!schoolId) {
    redirect('/login');
  }

  // 3. Fetch data dynamically using the validated schoolId
  const mainClasses = await prisma.class.findMany({
    where: { 
      schoolId: schoolId, // Now uses the ID from the URL
      parentId: null 
    },
    include: {
      subClasses: {
        orderBy: { name: 'asc' }
      }
    },
    orderBy: { name: 'asc' } 
  });

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Class Structure</h1>
            <p className="text-slate-500 font-medium italic">Click a level to manage its academic arms.</p>
          </div>
          <AddClassModal schoolId={schoolId} />
        </header>

        <div className="space-y-4">
          {mainClasses.map((main) => (
            <ClassCard key={main.id} main={main} schoolId={schoolId} />
          ))}
        </div>

        {mainClasses.length === 0 && (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-lg">No classes found in the system.</p>
            <p className="text-slate-400 text-sm">Start by adding a main Level (e.g. JSS 1)</p>
          </div>
        )}
      </div>
    </div>
  );
}