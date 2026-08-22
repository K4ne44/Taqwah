import mongoose, { Schema, Document } from "mongoose";

export interface IGoal extends Document {
  userId: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  target: number;
  unit: string;
  completed: boolean;
  createdAt: Date;
}

const GoalSchema = new Schema<IGoal>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  targetDate: { type: String, default: "" },
  progress: { type: Number, default: 0 },
  target: { type: Number, default: 30 },
  unit: { type: String, default: "days" },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Goal || mongoose.model<IGoal>("Goal", GoalSchema);
