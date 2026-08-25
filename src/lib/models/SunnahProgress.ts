import mongoose, { Schema, Document } from "mongoose";

export interface ISunnahProgress extends Document {
  userId: string;
  sunnahId: string;
  status: "completed" | "missed" | "in-progress";
  date: string;
  notes: string;
  createdAt: Date;
}

const SunnahProgressSchema = new Schema<ISunnahProgress>({
  userId: { type: String, required: true, index: true },
  sunnahId: { type: String, required: true },
  status: { type: String, enum: ["completed", "missed", "in-progress"], required: true },
  date: { type: String, required: true },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

SunnahProgressSchema.index({ userId: 1, sunnahId: 1, date: 1 }, { unique: true });

export default mongoose.models.SunnahProgress || mongoose.model<ISunnahProgress>("SunnahProgress", SunnahProgressSchema);
