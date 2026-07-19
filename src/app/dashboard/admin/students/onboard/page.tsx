import { prisma } from "@/lib/prisma";
import StudentOnboardingForm from "./StudentOnboardingForm";
import { redirect } from "next/navigation";

export default async function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ school?: string }> 
}) {
  // 1. Extract the school ID from searchParams
  const { school } = await searchParams;

  // 2. Validate it exists. If not, redirect or handle the error
  if (!school) {
    redirect("/dashboard/admin"); 
  }

  // 3. Define the variable using the extracted value
  const currentSchoolId = school;

  // 4. Now the query will work correctly
  const classes = await prisma.class.findMany({
    where: { 
      schoolId: currentSchoolId, 
      isActive: true 
    },
    include: { parentClass: true },
    orderBy: { name: 'asc' }
  });

  return <StudentOnboardingForm classes={classes} schoolId={currentSchoolId} />;
}