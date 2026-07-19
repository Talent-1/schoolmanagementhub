"use client";

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { LayoutDashboard, ShieldCheck, GraduationCap, Users } from 'lucide-react';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If not logged in, force to login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const selectRole = (roleId: string) => {
    // We no longer need to read 'school' from the URL.
    // The server/middleware will handle the school context 
    // based on the logged-in user's staff/student record.
    router.push(`/dashboard/${roleId}`);
  };

  if (status === "loading") return <div>Loading...</div>;

  const roles = [
    { id: 'admin', title: 'Principal / Admin', desc: 'Manage staff, students, curriculum.', color: 'bg-purple-50 border-purple-100 hover:bg-purple-100 hover:border-purple-300', icon: <ShieldCheck className="text-purple-600" size={40} /> },
    { id: 'teacher', title: 'Teacher Portal', desc: 'Manage classes, attendance, grading.', color: 'bg-blue-50 border-blue-100 hover:bg-blue-100 hover:border-blue-300', icon: <Users className="text-blue-600" size={40} /> },
    { id: 'student', title: 'Student / Parent', desc: 'View results, assignments, news.', color: 'bg-green-50 border-green-100 hover:bg-green-100 hover:border-green-300', icon: <GraduationCap className="text-green-600" size={40} /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12 flex flex-col items-center font-sans">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Portal Selection</h1>
        <p className="text-slate-500 mt-3 text-lg font-medium">Select your portal to continue</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => selectRole(role.id)}
            className={`flex flex-col items-start p-10 border-2 rounded-3xl transition-all duration-300 transform hover:-translate-y-2 text-left group ${role.color}`}
          >
            <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
              {role.icon}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">{role.title}</h2>
            <p className="text-slate-600 leading-relaxed font-medium">{role.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}