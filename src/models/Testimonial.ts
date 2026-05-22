import { Schema, model, models, type Model, type HydratedDocument, type Types } from "mongoose";
import { URL_REGEX } from "@/lib/regex";

export interface ITestimonial {
  author: string;
  role: string;
  company: string;
  avatarUrl?: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  approved: boolean;
  /** Optional link back to the project this testimonial is about. */
  project?: Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TestimonialDoc = HydratedDocument<ITestimonial>;

const TestimonialSchema = new Schema<ITestimonial>(
  {
    author: { type: String, required: true, trim: true, minlength: 1, maxlength: 80 },
    role: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
    company: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
    avatarUrl: { type: String, match: URL_REGEX },
    quote: { type: String, required: true, minlength: 1, maxlength: 800 },
    rating: { type: Number, min: 1, max: 5, default: 5, required: true },
    approved: { type: Boolean, default: false, index: true },
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TestimonialSchema.index({ approved: 1, order: 1, createdAt: -1 });

export const Testimonial: Model<ITestimonial> =
  (models.Testimonial as Model<ITestimonial>) ?? model<ITestimonial>("Testimonial", TestimonialSchema);
