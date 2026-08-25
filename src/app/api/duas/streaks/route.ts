import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import DuaStreak from "@/lib/models/DuaStreak";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const today = new Date().toISOString().split("T")[0];
  const todayRecord = await DuaStreak.findOne({ userId: user.userId, date: today });
  const todayCount = todayRecord ? todayRecord.count : 0;

  const allStreaks = await DuaStreak.find({ userId: user.userId }).sort({ date: -1 });

  let currentStreak = 0;
  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);

  for (const streak of allStreaks) {
    const streakDate = new Date(streak.date);
    streakDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (checkDate.getTime() - streakDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      currentStreak++;
      checkDate = streakDate;
    } else if (diffDays === 1) {
      currentStreak++;
      checkDate = streakDate;
    } else {
      break;
    }
  }

  const totalDays = allStreaks.length;

  return NextResponse.json({ currentStreak, totalDays, todayCount });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const today = new Date().toISOString().split("T")[0];

  const existing = await DuaStreak.findOne({ userId: user.userId, date: today });

  if (existing) {
    existing.count += 1;
    await existing.save();
    return NextResponse.json({ success: true, count: existing.count });
  }

  const streak = await DuaStreak.create({ userId: user.userId, date: today, count: 1 });
  return NextResponse.json({ success: true, count: streak.count });
}
