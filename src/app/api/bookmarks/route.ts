import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Bookmark from "@/lib/models/Bookmark";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection");

  const filter: Record<string, string> = { userId: user.userId };
  if (collection) filter.bookmarkCollection = collection;

  const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
  return NextResponse.json({ bookmarks });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();

  const existing = await Bookmark.findOne({
    userId: user.userId,
    surahNumber: body.surahNumber,
    ayahNumber: body.ayahNumber,
  });

  if (existing) {
    await Bookmark.deleteOne({ _id: existing._id });
    return NextResponse.json({ bookmarked: false });
  }

  const bookmark = await Bookmark.create({
    userId: user.userId,
    surahNumber: body.surahNumber,
    ayahNumber: body.ayahNumber,
    surahName: body.surahName || "",
    arabicText: body.arabicText || "",
    translation: body.translation || "",
    bookmarkCollection: body.collection || "favorites",
  });

  return NextResponse.json({ bookmark, bookmarked: true });
}

export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const surah = Number(searchParams.get("surah"));
  const ayah = Number(searchParams.get("ayah"));

  await Bookmark.deleteOne({ userId: user.userId, surahNumber: surah, ayahNumber: ayah });
  return NextResponse.json({ deleted: true });
}
