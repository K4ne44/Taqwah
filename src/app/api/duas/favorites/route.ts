import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import DuaFavorite from "@/lib/models/DuaFavorite";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const favorites = await DuaFavorite.find({ userId: user.userId }).sort({ createdAt: -1 });
  return NextResponse.json({ favorites: favorites.map((f) => f.duaId) });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();

  const existing = await DuaFavorite.findOne({ userId: user.userId, duaId: body.duaId });
  if (existing) {
    return NextResponse.json({ success: true, favorite: true });
  }

  await DuaFavorite.create({ userId: user.userId, duaId: body.duaId });
  return NextResponse.json({ success: true, favorite: true });
}

export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const duaId = searchParams.get("duaId");

  await DuaFavorite.deleteOne({ userId: user.userId, duaId });
  return NextResponse.json({ success: true, favorite: false });
}
