import { Schema, model, models, type Model, type HydratedDocument } from "mongoose";
import { EMAIL_REGEX } from "@/lib/regex";

export type MessageStatus = "new" | "read" | "archived";

export interface IContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  ip?: string;
  userAgent?: string;
  status: MessageStatus;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ContactMessageDoc = HydratedDocument<IContactMessage>;

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true, match: EMAIL_REGEX },
    subject: { type: String, required: true, trim: true, minlength: 1, maxlength: 160 },
    message: { type: String, required: true, minlength: 1, maxlength: 4000 },
    ip: { type: String, maxlength: 64 },
    userAgent: { type: String, maxlength: 512 },
    status: { type: String, enum: ["new", "read", "archived"], default: "new", index: true },
    readAt: Date,
  },
  { timestamps: true }
);

ContactMessageSchema.index({ status: 1, createdAt: -1 });
ContactMessageSchema.index({ createdAt: -1 });

ContactMessageSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "read" && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

export const ContactMessage: Model<IContactMessage> =
  (models.ContactMessage as Model<IContactMessage>) ??
  model<IContactMessage>("ContactMessage", ContactMessageSchema);
