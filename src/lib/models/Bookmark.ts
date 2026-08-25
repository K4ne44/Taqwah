import mongoose, { Schema, Document } from "mongoose";

export interface IBookmark extends Document {
  userId: string;
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  arabicText: string;
  translation: string;
  bookmarkCollection: string;
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>({
  userId: { type: String, required: true, index: true },
  surahNumber: { type: Number, required: true },
  ayahNumber: { type: Number, required: true },
  surahName: { type: String, default: "" },
  arabicText: { type: String, default: "" },
  translation: { type: String, default: "" },
  bookmarkCollection: { type: String, default: "favorites" },
  createdAt: { type: Date, default: Date.now },
});

BookmarkSchema.index({ userId: 1, surahNumber: 1, ayahNumber: 1 }, { unique: true });

export default mongoose.models.Bookmark || mongoose.model<IBookmark>("Bookmark", BookmarkSchema);
