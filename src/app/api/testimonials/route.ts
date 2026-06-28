import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Use your existing central instance

export async function GET() {
  try {
    // Simply fetch from your Prisma client
    const rows = await prisma.testimonial.findMany({ 
      orderBy: { createdAt: "desc" } 
    });

    return NextResponse.json({ 
      data: rows, 
      cached: false, 
      source: "db" 
    });
  } catch (error) {
    console.error("Database fetch failed:", error);
    
    // Fallback logic if needed
    return NextResponse.json(
      { error: "Failed to fetch testimonials" }, 
      { status: 500 }
    );
  }
}