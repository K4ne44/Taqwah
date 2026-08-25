import mongoose, { Schema, Document } from "mongoose";

export interface IReflection extends Document {
  userId: string;
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  arabicText: string;
  translation: string;
  reflection: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReflectionSchema = new Schema<IReflection>({
  userId: { type: String, required: true, index: true },
  surahNumber: { type: Number, required: true },
  ayahNumber: { type: Number, required: true },
  surahName: { type: String, default: "" },
  arabicText: { type: String, default: "" },
  translation: { type: String, default: "" },
  reflection: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ReflectionSchema.index({ userId: 1, surahNumber: 1, ayahNumber: 1 }, { unique: true });

ReflectionSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Reflection || mongoose.model<IReflection>("Reflection", ReflectionSchema);
