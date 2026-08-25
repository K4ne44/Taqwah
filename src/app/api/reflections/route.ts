import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Reflection from "@/lib/models/Reflection";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const surah = searchParams.get("surah");

  const filter: Record<string, string | number> = { userId: user.userId };
  if (surah) filter.surahNumber = Number(surah);

  const reflections = await Reflection.find(filter).sort({ createdAt: -1 });
  return NextResponse.json({ reflections });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();

  const reflection = await Reflection.findOneAndUpdate(
    { userId: user.userId, surahNumber: body.surahNumber, ayahNumber: body.ayahNumber },
    {
      $set: {
        surahName: body.surahName || "",
        arabicText: body.arabicText || "",
        translation: body.translation || "",
        reflection: body.reflection || "",
      },
    },
    { new: true, upsert: true }
  );

  return NextResponse.json({ reflection });
}

export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    await Reflection.deleteOne({ _id: id, userId: user.userId });
  }
  return NextResponse.json({ deleted: true });
}
