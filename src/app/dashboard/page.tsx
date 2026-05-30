"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { LayoutDashboard, ShieldCheck, GraduationCap, Users } from 'lucide-react';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const schoolId = searchParams.get('school') || "school-01";

  const roles = [
    { 
      id: 'admin', 
      title: 'Principal / Admin', 
      desc: 'Manage staff, students, curriculum, and school settings.',
      color: 'bg-purple-50 border-purple-100 hover:bg-purple-100 hover:border-purple-300',
      icon: <ShieldCheck className="text-purple-600" size={40} />
    },
    { 
      id: 'teacher', 
      title: 'Teacher Portal', 
      desc: 'Manage your assigned classes, attendance, and student grading.',
      color: 'bg-blue-50 border-blue-100 hover:bg-blue-100 hover:border-blue-300',
      icon: <Users className="text-blue-600" size={40} />
    },
    { 
      id: 'student', 
      title: 'Student / Parent', 
      desc: 'View results, download assignments, and check school news.',
      color: 'bg-green-50 border-green-100 hover:bg-green-100 hover:border-green-300',
      icon: <GraduationCap className="text-green-600" size={40} />
    }
  ];

  const selectRole = (roleId: string) => {
    // Navigates to the respective portal: /dashboard/admin, /dashboard/teacher, etc.
    router.push(`/dashboard/${roleId}?school=${schoolId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12 flex flex-col items-center font-sans">
      <header className="text-center mb-16">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100">
            <LayoutDashboard className="text-white" size={32} />
          </div>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          HillCity Academics
        </h1>
        <p className="text-slate-500 mt-3 text-lg font-medium">
          Select your destination portal to continue
        </p>
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
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              {role.title}
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              {role.desc}
            </p>
            <div className="mt-8 flex items-center text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
              Enter Portal →
            </div>
          </button>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4">
        <button 
          onClick={() => router.push('/login')}
          className="text-slate-400 hover:text-blue-600 font-bold text-sm transition-colors flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          Switch School Instance
        </button>
        
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
          HillCity Management System v1.0
        </p>
      </div>
    </div>
  );
}