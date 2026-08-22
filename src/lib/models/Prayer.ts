import mongoose, { Schema, Document } from "mongoose";

export interface IPrayer extends Document {
  userId: string;
  date: string;
  prayers: { name: string; completed: boolean }[];
  createdAt: Date;
}

const PrayerSchema = new Schema<IPrayer>({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  prayers: [{
    name: { type: String, required: true },
    completed: { type: Boolean, default: false },
  }],
  createdAt: { type: Date, default: Date.now },
});

PrayerSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.Prayer || mongoose.model<IPrayer>("Prayer", PrayerSchema);
