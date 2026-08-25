import mongoose, { Schema, Document } from "mongoose";

export interface IHadithBookmark extends Document {
  userId: string;
  hadithId: string;
  bookmarkCollection: string;
  notes: string;
  createdAt: Date;
}

const HadithBookmarkSchema = new Schema<IHadithBookmark>({
  userId: { type: String, required: true, index: true },
  hadithId: { type: String, required: true },
  bookmarkCollection: { type: String, default: "favorites" },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

HadithBookmarkSchema.index({ userId: 1, hadithId: 1 }, { unique: true });

export default mongoose.models.HadithBookmark || mongoose.model<IHadithBookmark>("HadithBookmark", HadithBookmarkSchema);
