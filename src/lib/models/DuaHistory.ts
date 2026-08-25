import mongoose, { Schema, Document } from "mongoose";

export interface IDuaHistory extends Document {
  userId: string;
  duaId: string;
  viewedAt: Date;
}

const DuaHistorySchema = new Schema<IDuaHistory>({
  userId: { type: String, required: true, index: true },
  duaId: { type: String, required: true },
  viewedAt: { type: Date, default: Date.now },
});

DuaHistorySchema.index({ userId: 1, duaId: 1 });

export default mongoose.models.DuaHistory || mongoose.model<IDuaHistory>("DuaHistory", DuaHistorySchema);
