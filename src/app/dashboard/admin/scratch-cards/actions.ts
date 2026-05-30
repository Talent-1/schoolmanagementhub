"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper function to generate unique numeric sequences
function generateNumericCode(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

export async function generateBulkScratchCards(schoolId: string, batchSize: number, maxUsage: number = 1) {
  try {
    if (!schoolId) return { success: false, error: "Missing active School ID context." };
    if (batchSize <= 0 || batchSize > 500) return { success: false, error: "Batch size must be between 1 and 500." };
    if (maxUsage <= 0 || maxUsage > 10) return { success: false, error: "Max usage must be between 1 and 10." };

    const cardsToCreate = [];

    for (let i = 0; i < batchSize; i++) {
      // 10-Digit Serial Number, 12-Digit PIN
      const serialNumber = "SN-" + generateNumericCode(10);
      const pin = generateNumericCode(12);

      cardsToCreate.push({
        schoolId,
        serialNumber,
        pin,
        isUsed: false,
        usageCount: 0,
        maxUsage,
      });
    }

    // Bulk insert using prisma createMany
    await prisma.scratchCard.createMany({
      data: cardsToCreate,
      skipDuplicates: true, // Safeguard against rare duplicate random generation hits
    });

    revalidatePath(`/dashboard/admin/scratch-cards`);
    return { success: true, count: cardsToCreate.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Card Generation Failure:", message);
    return { success: false, error: message };
  }
}