import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Checkin from "@/lib/models/Checkin";
import Prayer from "@/lib/models/Prayer";
import Habit from "@/lib/models/Habit";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  const query: Record<string, unknown> = { userId: user.userId };
  if (month) query.date = { $regex: `^${month}` };

  const checkins = await Checkin.find(query);
  const prayers = await Prayer.find(query);
  const habits = await Habit.find({ userId: user.userId, active: true });

  const totalCheckins = checkins.length;
  const successDays = checkins.filter(c => c.sinsAvoided && c.goodHabitsCompleted).length;
  const partialDays = checkins.filter(c => c.sinsAvoided !== c.goodHabitsCompleted).length;
  const failedDays = checkins.filter(c => !c.sinsAvoided && !c.goodHabitsCompleted).length;

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const sortedCheckins = [...checkins].sort((a, b) => a.date.localeCompare(b.date));

  for (const c of sortedCheckins) {
    if (c.sinsAvoided) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  const recentSorted = [...checkins].sort((a, b) => b.date.localeCompare(a.date));
  for (const c of recentSorted) {
    if (c.sinsAvoided) {
      currentStreak++;
    } else {
      break;
    }
  }

  const totalPrayers = prayers.reduce((sum, p) => sum + p.prayers.filter((pr: { name: string; completed: boolean }) => pr.completed).length, 0);
  const possiblePrayers = prayers.length * 5;

  const triggers: Record<string, number> = {};
  checkins.forEach(c => {
    c.triggers?.forEach((t: string) => {
      triggers[t] = (triggers[t] || 0) + 1;
    });
  });

  const weeklyData: Record<string, { success: number; total: number }> = {};
  checkins.forEach(c => {
    const weekStart = getWeekStart(c.date);
    if (!weeklyData[weekStart]) weeklyData[weekStart] = { success: 0, total: 0 };
    weeklyData[weekStart].total++;
    if (c.sinsAvoided && c.goodHabitsCompleted) weeklyData[weekStart].success++;
  });

  return NextResponse.json({
    totalCheckins,
    successDays,
    partialDays,
    failedDays,
    currentStreak,
    longestStreak,
    totalPrayers,
    possiblePrayers,
    triggers,
    weeklyData,
    successPercentage: totalCheckins > 0 ? Math.round((successDays / totalCheckins) * 100) : 0,
    habits: { avoid: habits.filter(h => h.type === "avoid").length, good: habits.filter(h => h.type === "good").length },
  });
}

function getWeekStart(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d.toISOString().split("T")[0];
}
