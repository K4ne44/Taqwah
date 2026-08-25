import mongoose, { Schema, Document } from "mongoose";

export interface IDuaStreak extends Document {
  userId: string;
  date: string;
  count: number;
  createdAt: Date;
}

const DuaStreakSchema = new Schema<IDuaStreak>({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  count: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

DuaStreakSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.DuaStreak || mongoose.model<IDuaStreak>("DuaStreak", DuaStreakSchema);
