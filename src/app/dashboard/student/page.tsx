// src/app/dashboard/student/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).type !== "STUDENT") {
    redirect("/login");
  }

  // Redirect the student to their specific profile page
  // where the code already exists
  redirect(`/students/${session.user.id}`);
}