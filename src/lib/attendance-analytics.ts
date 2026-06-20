"use server";

import { prisma } from "@/lib/prisma";
import { startOfDay, startOfWeek } from "date-fns";

export async function getAttendanceAnalytics(classId: string, schoolId: string, targetDate: Date) {
  const activeTerm = await prisma.term.findFirst({ where: { schoolId, isActive: true } });
  if (!activeTerm) return { termPresentPercent: "0.0", termAbsentPercent: "0.0", dayPresentPercent: "0.0", dayAbsentPercent: "0.0", weekPresentPercent: "0.0", weekAbsentPercent: "0.0", termName: "No active term" };

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  
  const dayStart = startOfDay(targetDate);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const allRecords = await prisma.attendance.findMany({
    where: { student: { classId }, date: { gte: activeTerm.startDate } },
    select: { date: true, status: true }
  });

  const totalStudents = await prisma.student.count({ where: { classId } });

  const processData = (startDate: Date, endDate: Date = now) => {
    const filtered = allRecords.filter(r => r.date >= startDate && r.date < endDate);
    const sessions = new Set(filtered.map(r => r.date.toDateString())).size;
    const present = filtered.filter(r => r.status === "PRESENT").length;
    const absent = filtered.filter(r => r.status === "ABSENT").length;
    const getP = (count: number) => (totalStudents * (sessions || 1) > 0 ? ((count / (totalStudents * (sessions || 1))) * 100).toFixed(1) : "0.0");
    return { present: getP(present), absent: getP(absent) };
  };

  return {
    termName: activeTerm.name,
    termPresentPercent: processData(activeTerm.startDate, new Date(activeTerm.endDate.getTime() + 86400000)).present,
    termAbsentPercent: processData(activeTerm.startDate, new Date(activeTerm.endDate.getTime() + 86400000)).absent,
    dayPresentPercent: processData(dayStart, dayEnd).present,
    dayAbsentPercent: processData(dayStart, dayEnd).absent,
    weekPresentPercent: processData(weekStart, new Date(now.getTime() + 86400000)).present,
    weekAbsentPercent: processData(weekStart, new Date(now.getTime() + 86400000)).absent,
  };
}