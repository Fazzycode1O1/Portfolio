import { Schema, model, models, type Model, type HydratedDocument } from "mongoose";
import { PERIOD_REGEX, URL_REGEX } from "@/lib/regex";

export type ExperienceType = "work" | "education";

export interface IExperience {
  company: string;
  role: string;
  type: ExperienceType;
  start: string;          // "2024" or "2024-06"
  end: string | null;     // null => "Present"
  location: string;
  highlights: string[];
  logo?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ExperienceDoc = HydratedDocument<IExperience>;

const ExperienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
    role: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
    type: { type: String, enum: ["work", "education"], required: true, index: true },
    start: { type: String, required: true, match: [PERIOD_REGEX, "Use YYYY or YYYY-MM"] },
    end: {
      type: String,
      default: null,
      validate: {
        validator: (v: string | null) => v === null || PERIOD_REGEX.test(v),
        message: "Use YYYY, YYYY-MM, or null for present",
      },
    },
    location: { type: String, default: "", maxlength: 120 },
    highlights: {
      type: [String],
      default: [],
      validate: (v: string[]) => v.length <= 12,
    },
    logo: { type: String, match: URL_REGEX },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ExperienceSchema.index({ type: 1, order: 1, start: -1 });

export const Experience: Model<IExperience> =
  (models.Experience as Model<IExperience>) ?? model<IExperience>("Experience", ExperienceSchema);
