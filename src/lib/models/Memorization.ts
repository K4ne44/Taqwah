import mongoose, { Schema, Document } from "mongoose";

export interface IMemorization extends Document {
  userId: string;
  surahNumber: number;
  ayahNumber: number;
  status: "not_started" | "memorizing" | "memorized" | "needs_revision";
  createdAt: Date;
  updatedAt: Date;
}

const MemorizationSchema = new Schema<IMemorization>({
  userId: { type: String, required: true, index: true },
  surahNumber: { type: Number, required: true },
  ayahNumber: { type: Number, required: true },
  status: { type: String, enum: ["not_started", "memorizing", "memorized", "needs_revision"], default: "not_started" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

MemorizationSchema.index({ userId: 1, surahNumber: 1, ayahNumber: 1 }, { unique: true });

MemorizationSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Memorization || mongoose.model<IMemorization>("Memorization", MemorizationSchema);
