import mongoose, { Schema, Document } from "mongoose";

export interface ICheckin extends Document {
  userId: string;
  date: string;
  sinsAvoided: boolean;
  goodHabitsCompleted: boolean;
  notes: string;
  trigger: string;
  triggers: string[];
  habitResults: { habitId: string; completed: boolean }[];
  createdAt: Date;
}

const CheckinSchema = new Schema<ICheckin>({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  sinsAvoided: { type: Boolean, default: false },
  goodHabitsCompleted: { type: Boolean, default: false },
  notes: { type: String, default: "" },
  trigger: { type: String, default: "" },
  triggers: [{ type: String }],
  habitResults: [{
    habitId: { type: String },
    completed: { type: Boolean, default: false },
  }],
  createdAt: { type: Date, default: Date.now },
});

CheckinSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.Checkin || mongoose.model<ICheckin>("Checkin", CheckinSchema);
