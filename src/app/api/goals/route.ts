import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Goal from "@/lib/models/Goal";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const goals = await Goal.find({ userId: user.userId }).sort({ createdAt: -1 });
  return NextResponse.json({ goals });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();
  const goal = await Goal.create({ ...body, userId: user.userId });
  return NextResponse.json({ goal }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();
  const { id, ...update } = body;
  const goal = await Goal.findOneAndUpdate({ _id: id, userId: user.userId }, update, { new: true });
  return NextResponse.json({ goal });
}

export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await Goal.findOneAndDelete({ _id: id, userId: user.userId });
  return NextResponse.json({ success: true });
}
