import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Memorization from "@/lib/models/Memorization";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const surah = searchParams.get("surah");

  const filter: Record<string, string | number> = { userId: user.userId };
  if (surah) filter.surahNumber = Number(surah);

  const records = await Memorization.find(filter).sort({ surahNumber: 1, ayahNumber: 1 });
  return NextResponse.json({ records });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();

  const record = await Memorization.findOneAndUpdate(
    { userId: user.userId, surahNumber: body.surahNumber, ayahNumber: body.ayahNumber },
    { $set: { status: body.status } },
    { new: true, upsert: true }
  );

  return NextResponse.json({ record });
}

export async function PUT(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();

  if (body.surahNumber && body.status) {
    await Memorization.updateMany(
      { userId: user.userId, surahNumber: body.surahNumber },
      { $set: { status: body.status } }
    );
    return NextResponse.json({ updated: true });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
