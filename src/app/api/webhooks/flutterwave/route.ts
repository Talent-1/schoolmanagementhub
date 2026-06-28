import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers.get("verif-hash");

  // 1. Verify that the request is actually from Flutterwave
  if (!signature || signature !== secretHash) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const payload = await req.json();

  // 2. If payment is successful
  if (payload.event === "charge.completed" && payload.data.status === "successful") {
    const staffId = payload.data.meta.staffId; 

    // 3. Update the subscription in your database
    await prisma.subscription.upsert({
      where: { staffId },
      update: { status: "ACTIVE", plan: "PREMIUM" },
      create: { staffId, status: "ACTIVE", plan: "PREMIUM" },
    });
  }

  return NextResponse.json({ received: true });
}