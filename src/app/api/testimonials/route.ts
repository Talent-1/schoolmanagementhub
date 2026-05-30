import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

let CACHE: { ts: number; data: any } | null = null;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

function readLocal() {
  try {
    const file = path.join(process.cwd(), "src", "data", "testimonials.json");
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export async function GET() {
  const now = Date.now();
  if (CACHE && now - CACHE.ts < CACHE_TTL) {
    return NextResponse.json({ data: CACHE.data, cached: true });
  }

  // Prefer DB if Prisma client is available (production-ready). Fallback to local JSON.
  try {
    // Try the repo-local generated client first
    let PrismaClient: any | null = null;
    try {
      const mod = await import("../../generated/prisma/client");
      PrismaClient = (mod as any).PrismaClient ?? (mod as any).default ?? (mod as any).PrismaClient;
    } catch (_) {
      // ignore
    }

    // Fallback to standard @prisma/client
    if (!PrismaClient) {
      try {
        const mod = await import("@prisma/client");
        PrismaClient = (mod as any).PrismaClient ?? (mod as any).PrismaClient ?? (mod as any).PrismaClient;
      } catch (__) {
        PrismaClient = null;
      }
    }

    if (PrismaClient) {
      const prisma = new PrismaClient();
      const rows = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
      CACHE = { ts: now, data: rows };
      await prisma.$disconnect();
      return NextResponse.json({ data: rows, cached: false, source: "db" });
    }

    // If no Prisma available, fallthrough to local JSON
  } catch (e) {
    const local = readLocal();
    const data = local ?? [];
    CACHE = { ts: now, data };
    return NextResponse.json({ data, cached: false, source: "local" });
  }
  const local = readLocal();
  const data = local ?? [];
  CACHE = { ts: now, data };
  return NextResponse.json({ data, cached: false, source: "local" });
}
