import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface IAppData {
  id: string;
  shop: string;
  key: string;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AppDataSchema = new Schema<IAppData>(
  {
    shop: {
      type: String,
      required: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "app_data",
  }
);

// Compound unique index on shop + key
AppDataSchema.index({ shop: 1, key: 1 }, { unique: true });

// Prevent model re-compilation during development
export const AppData = models.AppData || model<IAppData>("AppData", AppDataSchema);
