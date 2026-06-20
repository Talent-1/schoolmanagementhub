import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ResultsTable } from "./ResultsTable";
import { ResultGatekeeper } from "@/components/ResultGatekeeper";
import ResetPasswordButton from "@/components/ResetPasswordButton";

export default async function StudentProfilePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ tab?: string, term?: string, session?: string }>
}) {
  const { id } = await params;
  const { tab: tabParam, term, session } = await searchParams;
  
  const tab = tabParam ?? "timeline";
  // Defaulting to current term/session - you can adjust these defaults
  const activeTerm = term ?? "FIRST";
  const activeSession = session ?? "2025/2026";

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      class: { include: { parentClass: true } },
      school: { include: { announcements: { orderBy: { createdAt: 'desc' }, take: 10, include: { author: true } } } }
    }
  });

  if (!student) return notFound();

  return (
    <div className="max-w-5xl mx-auto pb-10 bg-slate-50 min-h-screen">
      <div className="p-4"><Link href="/students" className="text-slate-600 text-sm">← Back to Directory</Link></div>
      
      {/* Profile Header */}
      <div className="bg-white rounded-b-2xl shadow-sm border-x border-b border-slate-200">
        <div className="h-48 bg-gradient-to-r from-blue-700 to-indigo-900" />
        <div className="px-6 pb-6 -mt-12 flex items-end gap-4">
          <div className="h-32 w-32 bg-slate-200 border-4 border-white rounded-full flex items-center justify-center text-4xl font-bold">{student.firstName[0]}{student.lastName[0]}</div>
          <div className="flex-1 pb-2">
            <h1 className="text-4xl font-extrabold">{student.firstName} {student.lastName}</h1>
            <p className="text-blue-600 font-mono">{student.regNumber}</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="px-6 border-t flex gap-6 text-sm font-bold">
          {["timeline", "about", "results", "photos", "settings"].map((t) => (
            <Link key={t} href={`/students/${id}?tab=${t}`} className={`py-4 capitalize ${tab === t ? "border-b-4 border-blue-600 text-blue-600" : "text-slate-500"}`}>
              {t}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 px-4">
        <div className="md:col-span-4 bg-white p-6 rounded-xl border border-slate-200 h-fit">
          <h2 className="font-bold mb-4">Intro</h2>
          <p className="text-sm">Class: {student.class ? `${student.class.parentClass?.name} - ${student.class.name}` : "N/A"}</p>
        </div>

        <div className="md:col-span-8">
          {tab === "timeline" && student.school.announcements.map((news) => (
            <div key={news.id} className="bg-white p-6 mb-4 rounded-xl border">{news.title}</div>
          ))}
          {tab === "about" && <div className="bg-white p-8 rounded-xl border">Name: {student.firstName} {student.lastName}</div>}
          
          {tab === "results" && (
            <Suspense fallback={<div className="p-8">Verifying access...</div>}>
              <ResultGatekeeper 
                studentId={id} 
                term={activeTerm} 
                session={activeSession}
              >
                <ResultsTable studentId={id} term={activeTerm} session={activeSession} />
              </ResultGatekeeper>
            </Suspense>
          )}

          {tab === "settings" && (
             <div className="bg-white p-8 rounded-xl border">
               <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
               <ResetPasswordButton studentId={id} />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}