"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function updateStudent(formData: FormData) {
  const id = formData.get("id") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const regNumber = formData.get("regNumber") as string;
  const classId = formData.get("classId") as string;

  await prisma.student.update({
    where: { id },
    data: {
      firstName,
      lastName,
      regNumber,
      classId: classId === "" ? null : classId,
    },
  });

  revalidatePath(`/students/${id}`);
  redirect(`/students/${id}`);
}