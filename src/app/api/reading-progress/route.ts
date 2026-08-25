import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ReadingProgress from "@/lib/models/ReadingProgress";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  let progress = await ReadingProgress.findOne({ userId: user.userId });
  if (!progress) {
    progress = await ReadingProgress.create({ userId: user.userId });
  }
  return NextResponse.json({ progress });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();
  const today = new Date().toISOString().split("T")[0];

  const progress = await ReadingProgress.findOneAndUpdate(
    { userId: user.userId },
    {
      $set: {
        lastSurah: body.lastSurah,
        lastAyah: body.lastAyah,
        lastReadDate: today,
      },
      $inc: {
        totalAyahs: body.ayahsRead || 0,
        totalPages: body.pagesRead || 0,
        totalMinutes: body.minutesRead || 0,
      },
    },
    { new: true, upsert: true }
  );

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (progress.lastReadDate === today && progress.readingStreak === 0) {
    progress.readingStreak = 1;
    await progress.save();
  } else if (body.lastReadDate === yesterdayStr || progress.lastReadDate === today) {
    if (progress.lastReadDate !== today) {
      progress.readingStreak += 1;
      await progress.save();
    }
  } else {
    progress.readingStreak = 1;
    await progress.save();
  }

  return NextResponse.json({ progress });
}
