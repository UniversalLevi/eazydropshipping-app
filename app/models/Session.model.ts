import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export interface ISession {
  id: string;
  shop: string;
  state?: string;
  scope?: string;
  expires?: Date;
  accessToken: string;
  isOnline: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    shop: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    state: {
      type: String,
      required: false,
    },
    scope: {
      type: String,
      required: false,
    },
    expires: {
      type: Date,
      required: false,
    },
    accessToken: {
      type: String,
      required: true,
    },
    isOnline: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "sessions",
  }
);

// Prevent model re-compilation during development
export const Session = models.Session || model<ISession>("Session", SessionSchema);
