import { Schema, model, models, type Model, type HydratedDocument } from "mongoose";

export type UserRole = "admin" | "owner";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string;
  lastLoginAt?: Date;
  refreshTokens?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type UserDoc = HydratedDocument<IUser>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [EMAIL_REGEX, "Invalid email format"],
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "owner"], default: "admin", index: true },
    avatarUrl: { type: String, match: /^https?:\/\//i },
    lastLoginAt: Date,
    refreshTokens: { type: [String], default: [], select: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete (ret as Record<string, unknown>).passwordHash;
        delete (ret as Record<string, unknown>).refreshTokens;
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  }
);

export const User: Model<IUser> = (models.User as Model<IUser>) ?? model<IUser>("User", UserSchema);
