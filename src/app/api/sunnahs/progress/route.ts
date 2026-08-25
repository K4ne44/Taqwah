import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SunnahProgress from "@/lib/models/SunnahProgress";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");
  const statsParam = searchParams.get("stats");
  const weekParam = searchParams.get("week");
  const monthParam = searchParams.get("month");

  const today = new Date().toISOString().split("T")[0];

  if (statsParam === "true") {
    const allProgress = await SunnahProgress.find({ userId: user.userId });
    const dateSet = new Set(allProgress.map((p) => p.date));
    const dates = Array.from(dateSet).sort().reverse();

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const checkDate = new Date();
    for (let i = 0; i < 365; i++) {
      const ds = checkDate.toISOString().split("T")[0];
      if (dateSet.has(ds)) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }

    dates.forEach((d) => {
      if (dateSet.has(d)) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });

    const todayProgress = await SunnahProgress.find({ userId: user.userId, date: today });
    const todayCompleted = todayProgress.filter((p) => p.status === "completed").length;
    const todayTotal = todayProgress.length;

    return NextResponse.json({ currentStreak, longestStreak, totalDays: dateSet.size, todayCompleted, todayTotal });
  }

  if (weekParam) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekStart = weekAgo.toISOString().split("T")[0];
    const weekData = await SunnahProgress.find({ userId: user.userId, date: { $gte: weekStart } });
    return NextResponse.json({ progress: weekData });
  }

  if (monthParam) {
    const monthData = await SunnahProgress.find({
      userId: user.userId,
      date: { $regex: `^${monthParam}` },
    });
    return NextResponse.json({ progress: monthData });
  }

  let dateStr: string;
  if (!dateParam || dateParam === "today") {
    dateStr = today;
  } else {
    dateStr = dateParam;
  }

  const dayProgress = await SunnahProgress.find({ userId: user.userId, date: dateStr });
  return NextResponse.json({ date: dateStr, progress: dayProgress });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();
  const { sunnahId, status, date, notes } = body;

  if (!sunnahId || !status) {
    return NextResponse.json({ error: "Missing sunnahId or status" }, { status: 400 });
  }

  const dateStr = date || new Date().toISOString().split("T")[0];

  const existing = await SunnahProgress.findOne({ userId: user.userId, sunnahId, date: dateStr });

  if (existing) {
    existing.status = status;
    existing.notes = notes || existing.notes;
    await existing.save();
    return NextResponse.json({ success: true, progress: existing });
  }

  const progress = await SunnahProgress.create({
    userId: user.userId,
    sunnahId,
    status,
    date: dateStr,
    notes: notes || "",
  });

  return NextResponse.json({ success: true, progress });
}
