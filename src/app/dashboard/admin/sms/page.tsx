// src/app/dashboard/admin/sms/page.tsx
import { prisma } from "@/lib/prisma";
import SmsComposer from "@/components/SmsComposer";
import { getServerSession } from "next-auth/next";

export default async function SmsPage() {
  const session = await getServerSession();
  // Fetch user school
  const admin = await prisma.staff.findFirst({
    where: { email: session?.user?.email as string },
    include: { school: true }
  });

  const classes = await prisma.class.findMany({
    where: { schoolId: admin?.schoolId }
  });

  return (
    <div className="max-w-2xl mx-auto py-10">
      <SmsComposer schoolId={admin?.schoolId as string} classes={classes} />
    </div>
  );
}