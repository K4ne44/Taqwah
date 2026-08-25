import mongoose, { Schema, Document } from "mongoose";

export interface IHadithReading extends Document {
  userId: string;
  hadithId: string;
  readAt: Date;
}

const HadithReadingSchema = new Schema<IHadithReading>({
  userId: { type: String, required: true, index: true },
  hadithId: { type: String, required: true },
  readAt: { type: Date, default: Date.now },
});

HadithReadingSchema.index({ userId: 1, hadithId: 1 });

export default mongoose.models.HadithReading || mongoose.model<IHadithReading>("HadithReading", HadithReadingSchema);
