import { prisma } from "@/lib/prisma";
import SmsComposer from "@/components/SmsComposer";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function SmsPage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  // Fetch admin and their school
  const admin = await prisma.staff.findFirst({
    where: { email: session.user.email },
    include: { school: true }
  });

  if (!admin?.schoolId) return <div>School not found.</div>;

  // Fetch classes including parent info to allow for "Level - Arm" display
  const classes = await prisma.class.findMany({
    where: { 
      schoolId: admin.schoolId,
      isActive: true
    },
    include: { 
      parentClass: true 
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-2xl mx-auto py-10">
      <SmsComposer schoolId={admin.schoolId} classes={classes} />
    </div>
  );
}