import { prisma } from "@/lib/prisma";
import StudentOnboardingForm from "./StudentOnboardingForm";

export default async function Page({ searchParams }: { searchParams: Promise<{ school?: string }> }) {
  const { school } = await searchParams;

  // Fetch only child classes (those that have a parentId)
  const classes = await prisma.class.findMany({
    where: {
      schoolId: school,
      NOT: { parentId: null } // Excludes parent headers like "JS1"
    },
    include: {
      parentClass: true // Fetches the parent data to get "JS1"
    },
    orderBy: { name: 'asc' }
  });

  return <StudentOnboardingForm classes={classes} schoolId={school || ""} />;
}