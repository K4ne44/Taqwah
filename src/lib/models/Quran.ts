import mongoose, { Schema, Document } from "mongoose";

export interface IQuran extends Document {
  userId: string;
  date: string;
  pagesRead: number;
  ayatMemorized: number;
  createdAt: Date;
}

const QuranSchema = new Schema<IQuran>({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  pagesRead: { type: Number, default: 0 },
  ayatMemorized: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

QuranSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.Quran || mongoose.model<IQuran>("Quran", QuranSchema);
