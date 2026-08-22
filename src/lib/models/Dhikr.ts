import mongoose, { Schema, Document } from "mongoose";

export interface IDhikr extends Document {
  userId: string;
  date: string;
  counts: { name: string; count: number }[];
  createdAt: Date;
}

const DhikrSchema = new Schema<IDhikr>({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  counts: [{
    name: { type: String, required: true },
    count: { type: Number, default: 0 },
  }],
  createdAt: { type: Date, default: Date.now },
});

DhikrSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.Dhikr || mongoose.model<IDhikr>("Dhikr", DhikrSchema);
