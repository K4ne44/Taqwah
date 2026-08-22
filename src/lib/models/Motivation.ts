import mongoose, { Schema, Document } from "mongoose";

export interface IMotivation extends Document {
  userId: string;
  type: "verse" | "hadith" | "reminder" | "goal" | "dream";
  content: string;
  source: string;
  createdAt: Date;
}

const MotivationSchema = new Schema<IMotivation>({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ["verse", "hadith", "reminder", "goal", "dream"], required: true },
  content: { type: String, required: true },
  source: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Motivation || mongoose.model<IMotivation>("Motivation", MotivationSchema);
