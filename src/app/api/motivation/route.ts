import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Motivation from "@/lib/models/Motivation";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const items = await Motivation.find({ userId: user.userId }).sort({ createdAt: -1 });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();
  const item = await Motivation.create({ ...body, userId: user.userId });
  return NextResponse.json({ item }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await Motivation.findOneAndDelete({ _id: id, userId: user.userId });
  return NextResponse.json({ success: true });
}
