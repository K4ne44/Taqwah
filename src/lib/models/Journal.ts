import mongoose, { Schema, Document } from "mongoose";

export interface IJournal extends Document {
  userId: string;
  date: string;
  wentWell: string;
  mistakes: string;
  triggers: string;
  improvement: string;
  createdAt: Date;
}

const JournalSchema = new Schema<IJournal>({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  wentWell: { type: String, default: "" },
  mistakes: { type: String, default: "" },
  triggers: { type: String, default: "" },
  improvement: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

JournalSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.Journal || mongoose.model<IJournal>("Journal", JournalSchema);
