import { prisma } from "@/lib/prisma";
import StudentOnboardingForm from "./StudentOnboardingForm";

export default async function Page({ searchParams }: { searchParams: Promise<{ school?: string }> }) {
  const { school } = await searchParams;

  const classes = await prisma.class.findMany({
    where: { schoolId: school, NOT: { parentId: null } },
    include: { parentClass: true },
    orderBy: { name: 'asc' }
  });

  return <StudentOnboardingForm classes={classes} schoolId={school || ""} />;
}