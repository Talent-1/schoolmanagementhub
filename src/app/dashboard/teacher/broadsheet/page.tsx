import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BroadsheetClient from "@/components/BroadsheetClient";

export default async function BroadsheetPage() {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session?.user?.id) redirect("/login");

  const activeTerm = await prisma.term.findFirst({ where: { isActive: true } });
  if (!activeTerm) return <div className="p-10">No active term set.</div>;

  const managedClass = await prisma.class.findFirst({
    where: { formTeacherId: session.user.id },
    include: {
      parentClass: true,
      students: {
        include: {
          results: { 
            where: { term: { contains: "3rd", mode: 'insensitive' } }, 
            include: { subject: true } 
          }
        },
        orderBy: { lastName: 'asc' }
      }
    }
  });

  if (!managedClass) return <div className="p-10">No class assigned.</div>;

  // --- AUTOMATIC CALCULATION & RANKING ---
  const studentsWithStats = managedClass.students.map(student => {
    const totalScore = student.results.reduce((sum, r) => sum + (r.totalScore || 0), 0);
    const avgScore = student.results.length > 0 ? totalScore / student.results.length : 0;
    return { ...student, totalScore, avgScore };
  });

  // Rank using Standard Competition Ranking
  const sorted = [...studentsWithStats].sort((a, b) => b.avgScore - a.avgScore);
  const rankedStudents = sorted.reduce<Array<(typeof sorted)[number] & { rank: number }>>((acc, student, index) => {
    const previous = acc[acc.length - 1];
    const rank = previous && student.avgScore === previous.avgScore ? previous.rank : index + 1;
    acc.push({ ...student, rank });
    return acc;
  }, []);

  const isJunior = managedClass.name.includes("JS") || managedClass.parentClass?.name.includes("JS");
  const section = isJunior ? "JUNIOR" : "SENIOR";
  const subjects = await prisma.subject.findMany({
    where: { schoolId: managedClass.schoolId, isActive: true, section },
    orderBy: { name: 'asc' }
  });

  return (
    <BroadsheetClient 
      managedClass={managedClass} 
      subjects={subjects} 
      rankedStudents={rankedStudents} 
      termName={activeTerm.name}
    />
  );
}