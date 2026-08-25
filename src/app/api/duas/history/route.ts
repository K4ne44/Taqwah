import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import DuaHistory from "@/lib/models/DuaHistory";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const history = await DuaHistory.find({ userId: user.userId })
    .sort({ viewedAt: -1 })
    .limit(20);
  return NextResponse.json({ history: history.map((h) => h.duaId) });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();

  await DuaHistory.create({ userId: user.userId, duaId: body.duaId });
  return NextResponse.json({ success: true });
}
