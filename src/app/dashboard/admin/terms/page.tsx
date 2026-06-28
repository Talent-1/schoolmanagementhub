import { prisma } from "@/lib/prisma";
import { createTermAction, deleteTermAction, toggleTermActiveAction } from "./actions";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminTermsPage() {
  const session = (await getServerSession(authOptions)) as Session | null;
  const schoolId = (session?.user as any)?.schoolId; 

  if (!schoolId) return <div>Access Denied: You must be logged in.</div>;

  const terms = await prisma.term.findMany({ 
    where: { schoolId }, 
    orderBy: { startDate: 'desc' } 
  });

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Manage Academic Terms</h1>
      
      <form action={createTermAction} className="bg-white p-6 border rounded-lg mb-8 max-w-lg">
        <input type="hidden" name="schoolId" value={schoolId} />
        <div className="mb-4">
          <label htmlFor="term-name" className="block text-sm font-bold">Term Name</label>
          <input id="term-name" name="name" required className="w-full p-2 border rounded" placeholder="e.g., 3rd Term 2026" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="start-date" className="block text-sm">Start Date</label>
            <input id="start-date" type="date" name="startDate" required className="w-full p-2 border rounded" />
          </div>
          <div className="flex-1">
            <label htmlFor="end-date" className="block text-sm">End Date</label>
            <input id="end-date" type="date" name="endDate" required className="w-full p-2 border rounded" />
          </div>
        </div>
        <button type="submit" className="mt-4 bg-green-600 text-white px-6 py-2 rounded font-bold">Create Term</button>
      </form>

      <div className="bg-white border rounded-lg overflow-hidden">
        {terms.map((term) => (
          <div key={term.id} className="p-4 border-b flex justify-between items-center gap-4">
            <div>
              <p className="font-bold">{term.name}</p>
              <p className="text-xs text-gray-500">{term.startDate.toLocaleDateString()} to {term.endDate.toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 text-xs rounded ${term.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                {term.isActive ? "Active" : "Inactive"}
              </span>
              {!term.isActive && (
                <form action={toggleTermActiveAction.bind(null, term.id, schoolId)}>
                  <button type="submit" className="text-xs text-blue-600 hover:underline">Activate</button>
                </form>
              )}
              <form action={deleteTermAction.bind(null, term.id)}>
                <button type="submit" className="text-xs text-red-600 hover:underline">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}