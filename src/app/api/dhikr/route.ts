import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Dhikr from "@/lib/models/Dhikr";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const records = await Dhikr.find({ userId: user.userId }).sort({ date: -1 });
  return NextResponse.json({ records });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();
  const record = await Dhikr.findOneAndUpdate(
    { userId: user.userId, date: body.date },
    { $set: body },
    { new: true, upsert: true }
  );
  return NextResponse.json({ record });
}
