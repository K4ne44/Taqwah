import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HadithBookmark from "@/lib/models/HadithBookmark";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection");

  const filter: Record<string, string> = { userId: user.userId };
  if (collection) filter.collection = collection;

  const bookmarks = await HadithBookmark.find(filter).sort({ createdAt: -1 });
  return NextResponse.json({ bookmarks });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();

  const existing = await HadithBookmark.findOne({
    userId: user.userId,
    hadithId: body.hadithId,
  });

  if (existing) {
    return NextResponse.json({ bookmarked: true });
  }

  await HadithBookmark.create({
    userId: user.userId,
    hadithId: body.hadithId,
    collection: body.collection || "favorites",
    notes: body.notes || "",
  });

  return NextResponse.json({ success: true, bookmarked: true });
}

export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const hadithId = searchParams.get("hadithId");

  await HadithBookmark.deleteOne({ userId: user.userId, hadithId });
  return NextResponse.json({ success: true, bookmarked: false });
}
