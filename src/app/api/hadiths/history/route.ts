import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HadithReading from "@/lib/models/HadithReading";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const history = await HadithReading.find({ userId: user.userId })
    .sort({ readAt: -1 })
    .limit(50);
  return NextResponse.json({ history: history.map((h) => h.hadithId) });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();

  await HadithReading.create({ userId: user.userId, hadithId: body.hadithId });
  return NextResponse.json({ success: true });
}
