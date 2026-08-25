import mongoose, { Schema, Document } from "mongoose";

export interface IReadingProgress extends Document {
  userId: string;
  lastSurah: number;
  lastAyah: number;
  totalPages: number;
  totalAyahs: number;
  totalMinutes: number;
  readingStreak: number;
  lastReadDate: string;
  dailyGoal: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReadingProgressSchema = new Schema<IReadingProgress>({
  userId: { type: String, required: true, unique: true },
  lastSurah: { type: Number, default: 1 },
  lastAyah: { type: Number, default: 1 },
  totalPages: { type: Number, default: 0 },
  totalAyahs: { type: Number, default: 0 },
  totalMinutes: { type: Number, default: 0 },
  readingStreak: { type: Number, default: 0 },
  lastReadDate: { type: String, default: "" },
  dailyGoal: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ReadingProgressSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.ReadingProgress || mongoose.model<IReadingProgress>("ReadingProgress", ReadingProgressSchema);
