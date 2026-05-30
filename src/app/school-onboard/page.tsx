// src/app/school-onboard/page.tsx
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export default function SchoolOnboardPage() {
  async function handleSchoolOnboard(formData: FormData) {
    "use server";

    const schoolName = formData.get("schoolName") as string;
    const address = formData.get("address") as string;
    const adminEmail = formData.get("email") as string;
    const adminPassword = formData.get("password") as string;

    // 1. Create the School
    const school = await prisma.school.create({
      data: {
        id: `school-${Date.now()}`,
        name: schoolName,
        address,
        schoolCode: schoolName.toUpperCase().slice(0, 5) + Math.floor(Math.random() * 900),
      },
    });

    // 2. Create the Primary Admin Account for that school
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.staff.create({
      data: {
        id: `staff-${Date.now()}`,
        name: "School Administrator",
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        role: "ADMIN",
        schoolId: school.id,
      },
    });

    redirect("/login"); // Redirect to login after successful onboarding
  }

  return (
    <div className="max-w-xl mx-auto py-16 px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-white">Setup New School</h1>
        <p className="text-slate-400 mt-2">Initialize a new campus and administrative account.</p>
      </div>

      <form action={handleSchoolOnboard} className="space-y-6 bg-slate-900 p-8 rounded-2xl border border-white/10 shadow-xl">
        {/* School Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-cyan-400 border-b border-white/10 pb-2">School Details</h2>
          <input name="schoolName" placeholder="School Name" required className="w-full p-3 rounded-lg bg-slate-950 border border-white/10 text-white" />
          <input name="address" placeholder="School Address" required className="w-full p-3 rounded-lg bg-slate-950 border border-white/10 text-white" />
        </div>

        {/* Initial Admin Account */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-fuchsia-400 border-b border-white/10 pb-2">Admin Setup</h2>
          <input name="email" type="email" placeholder="Admin Email" required className="w-full p-3 rounded-lg bg-slate-950 border border-white/10 text-white" />
          <input name="password" type="password" placeholder="Admin Password" required className="w-full p-3 rounded-lg bg-slate-950 border border-white/10 text-white" />
        </div>

        <button type="submit" className="w-full py-4 rounded-full bg-linear-to-r from-cyan-400 to-indigo-600 font-bold text-slate-950 hover:opacity-90 transition">
          Initialize School
        </button>
      </form>
    </div>
  );
}