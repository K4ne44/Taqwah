import mongoose, { Schema, Document } from "mongoose";

export interface IDuaFavorite extends Document {
  userId: string;
  duaId: string;
  createdAt: Date;
}

const DuaFavoriteSchema = new Schema<IDuaFavorite>({
  userId: { type: String, required: true, index: true },
  duaId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

DuaFavoriteSchema.index({ userId: 1, duaId: 1 }, { unique: true });

export default mongoose.models.DuaFavorite || mongoose.model<IDuaFavorite>("DuaFavorite", DuaFavoriteSchema);
