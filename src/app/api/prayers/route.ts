import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Prayer from "@/lib/models/Prayer";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const query: Record<string, unknown> = { userId: user.userId };
  if (month) query.date = { $regex: `^${month}` };

  const prayers = await Prayer.find(query).sort({ date: -1 });
  return NextResponse.json({ prayers });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();
  const prayer = await Prayer.findOneAndUpdate(
    { userId: user.userId, date: body.date },
    { $set: body },
    { new: true, upsert: true }
  );
  return NextResponse.json({ prayer });
}
