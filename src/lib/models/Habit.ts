import mongoose, { Schema, Document } from "mongoose";

export interface IHabit extends Document {
  userId: string;
  name: string;
  type: "avoid" | "good";
  category: string;
  active: boolean;
  createdAt: Date;
}

const HabitSchema = new Schema<IHabit>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["avoid", "good"], required: true },
  category: { type: String, default: "general" },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Habit || mongoose.model<IHabit>("Habit", HabitSchema);
