import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function StudentProfilePage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ tab?: string }>
}) {
  const { id } = await params;
  const { tab: tabParam } = await searchParams;
  
  const tab = tabParam ?? "timeline";

  if (!id) return notFound();

  const currentUser = { role: "ADMIN" }; 

  const student = await prisma.student.findUnique({
    where: { id },
    include: { 
      class: {
        include: {
          parentClass: true // To get the parent class name (e.g., "JS1") for display purposes
        }
      }, 
      school: {
        include: {
          announcements: {
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { author: true }
          }
        }
      },
      results: {
        orderBy: [{ session: 'desc' }, { term: 'asc' }],
        include: { subject: true }
      }
    }
  });

  if (!student) return notFound();

  const activeTabClass = "border-b-4 border-blue-600 text-blue-600";
  const inactiveTabClass = "text-slate-500 hover:bg-slate-50";

  return (
    <div className="max-w-5xl mx-auto pb-10 bg-slate-50 min-h-screen font-sans">
      {/* 1. Header Navigation */}
      <div className="p-4 flex items-center justify-between">
        <Link href="/students" className="text-slate-600 hover:text-blue-600 font-medium flex items-center gap-1 text-sm">
          ← Back to Directory
        </Link>
      </div>

      {/* 2. The Card Wrapper */}
      <div className="bg-white rounded-b-2xl shadow-sm overflow-hidden border-x border-b border-slate-200">
        <div className="h-48 md:h-64 bg-gradient-to-r from-blue-700 to-indigo-900 relative">
          <div className="absolute bottom-4 right-6 bg-white/20 backdrop-blur-md px-3 py-1 rounded text-white text-xs font-mono">
             {student.school.name}
          </div>
        </div>

        <div className="px-6 pb-6 relative flex flex-col md:flex-row items-end gap-4 -mt-12 md:-mt-16">
          <div className="h-32 w-32 md:h-40 md:w-40 bg-slate-200 border-4 border-white rounded-full flex items-center justify-center text-4xl font-bold text-slate-400 shadow-lg shrink-0 overflow-hidden">
            {student.firstName[0]}{student.lastName[0]}
          </div>

          <div className="flex-1 pb-2">
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-blue-600 font-bold font-mono tracking-tighter">
              {student.regNumber}
            </p>
          </div>

          <div className="flex gap-2 mb-2 w-full md:w-auto">
            {(currentUser.role === "ADMIN" || currentUser.role === "TEACHER") && (
              <Link 
                href={`/students/${id}/edit`} 
                className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition text-center shadow-sm"
              >
                Edit Profile
              </Link>
            )}
            <button className="flex-1 md:flex-none bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-bold hover:bg-slate-200 transition">
              Share
            </button>
          </div>
        </div>

        <div className="px-6 border-t border-slate-100 flex gap-6 text-sm font-bold overflow-x-auto">
          <Link href={`/students/${id}?tab=timeline`} className={`py-4 whitespace-nowrap transition-all ${tab === 'timeline' ? activeTabClass : inactiveTabClass}`}>Timeline</Link>
          <Link href={`/students/${id}?tab=about`} className={`py-4 whitespace-nowrap transition-all ${tab === 'about' ? activeTabClass : inactiveTabClass}`}>About</Link>
          <Link href={`/students/${id}?tab=results`} className={`py-4 whitespace-nowrap transition-all ${tab === 'results' ? activeTabClass : inactiveTabClass}`}>Academic Results</Link>
          <Link href={`/students/${id}?tab=photos`} className={`py-4 whitespace-nowrap transition-all ${tab === 'photos' ? activeTabClass : inactiveTabClass}`}>Photos</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 px-4 md:px-0">
        {/* Left Column */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Intro</h2>
            <div className="space-y-4 text-slate-600 text-sm">
              <div className="flex items-center gap-3">
                 <span className="text-xl">🏫</span>
                 <span>Studies at <span className="font-bold">{student.school.name}</span></span>
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-xl">📚</span>
                 <span>Class: <span className="font-bold text-blue-600">{student.class?`${student.class.parentClass?.name || ''} -${student.class.name}`:"Unassigned"}</span></span>
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-xl">📍</span>
                 <span>Section: <span className="font-bold">{student.class?.section || "Secondary"}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-8">
          {tab === "timeline" && (
            <div className="space-y-6">
              {student.school.announcements.map((news) => (
                <div key={news.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-blue-600 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold">{news.author.name[0]}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{news.author.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{new Date(news.createdAt).toDateString()}</p>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{news.title}</h3>
                  <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{news.content}</p>
                </div>
              ))}
            </div>
          )}

         {tab === "about" && (
  <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
    <h2 className="text-2xl font-bold text-slate-800 mb-6">Student Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
      <div className="border-l-4 border-blue-100 pl-4">
        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Full Name</p>
        <p className="text-slate-900 font-semibold">{student.firstName} {student.lastName}</p>
      </div>
      <div className="border-l-4 border-blue-100 pl-4">
        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Reg Number</p>
        <p className="text-slate-900 font-mono font-bold text-blue-600">{student.regNumber}</p>
      </div>
      <div className="border-l-4 border-blue-100 pl-4">
        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Current Campus</p>
        <p className="text-slate-900 font-semibold">{student.school.name}</p>
      </div>
      <div className="border-l-4 border-blue-100 pl-4">
        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Class & Section</p>
        <p className="text-slate-900 font-semibold">
          {student.class 
            ? `${student.class.parentClass?.name || 'N/A'} - ${student.class.name}` 
            : "Not Assigned"}
        </p>
      </div>
    </div>
  </div>
)}

          {tab === "results" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">Academic Records</h2>
              </div>
              {student.results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                      <tr className="text-[10px] uppercase text-slate-400 font-bold">
                        <th className="p-4">Subject</th>
                        <th className="p-4">Term</th>
                        <th className="p-4 text-center">Total Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {student.results.map((r) => {
                        const total = r.caScore + r.examScore;
                        let statusStyles = "text-slate-700 bg-slate-100";
                        if (total >= 70) statusStyles = "text-green-700 bg-green-50";
                        else if (total >= 50) statusStyles = "text-amber-700 bg-amber-50";
                        else if (total < 40) statusStyles = "text-red-700 bg-red-50";

                        return (
                          <tr key={r.id} className="hover:bg-slate-50 transition">
                            <td className="p-4 font-bold text-slate-700">{r.subject?.name ?? 'Unknown Subject'}</td>
                            <td className="p-4 text-sm text-slate-500">{r.term} ({r.session})</td>
                            <td className="p-4 text-center">
                              <span className={`px-3 py-1 rounded-full font-black text-xs ${statusStyles}`}>
                                {total}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-20 text-center">
                  <div className="text-5xl mb-4">📝</div>
                  <h3 className="text-lg font-bold text-slate-800">Results Under Compilation</h3>
                </div>
              )}
            </div>
          )}

          {tab === "photos" && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 text-xs border border-dashed border-slate-200">
                    No Images Uploaded
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}