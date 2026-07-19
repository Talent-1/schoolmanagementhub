// prisma/seed.ts
import { prisma } from "@/lib/prisma";

async function createSchoolClasses() {

  console.log("Seeding to database URL:", process.env.DATABASE_URL);

  const schoolId = "school-1783097070886";

  // 1. Create the Main Level (Parent)
  const JSS1 = await prisma.class.create({
    data: {
      name: "JSS 1",
      section: "Secondary",
      schoolId: schoolId,
    },
  });

  // 2. Create the Arms (Subclasses) linked to the Parent
  const classArms = ["A", "B", "C"];
  
  for (const arm of classArms) {
    await prisma.class.create({
      data: {
        name: arm,
        section: "Secondary",
        schoolId: schoolId,
        parentId: JSS1.id, // Links this arm to Primary 1
      },
    });
  }

  console.log("Classes created successfully!");
}