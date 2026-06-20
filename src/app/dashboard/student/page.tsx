// src/app/dashboard/student/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);

  // Safely extract the type
  const userType = (session?.user as any)?.type;
  const userId = session?.user?.id;

  // If no session OR user is not a student, redirect to login
  if (!session || userType !== "STUDENT") {
    redirect("/login");
  }

  // If for some reason we have a student session but no ID, we can't redirect
  if (!userId) {
    redirect("/login");
  }

  redirect(`/students/${userId}`);
}