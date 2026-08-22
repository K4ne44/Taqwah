import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Habit from "@/lib/models/Habit";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const habits = await Habit.find({ userId: user.userId }).sort({ createdAt: -1 });
  return NextResponse.json({ habits });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();
  const habit = await Habit.create({ ...body, userId: user.userId });
  return NextResponse.json({ habit }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();
  const { id, ...update } = body;
  const habit = await Habit.findOneAndUpdate({ _id: id, userId: user.userId }, update, { new: true });
  return NextResponse.json({ habit });
}

export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await Habit.findOneAndDelete({ _id: id, userId: user.userId });
  return NextResponse.json({ success: true });
}
