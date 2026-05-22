import { Schema, model, models, type Model, type HydratedDocument } from "mongoose";

export type SkillCategory = "language" | "framework" | "ai" | "devops" | "db" | "tool";

export interface ISkill {
  name: string;
  category: SkillCategory;
  proficiency: 1 | 2 | 3 | 4 | 5;
  icon?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type SkillDoc = HydratedDocument<ISkill>;

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: 60, unique: true },
    category: {
      type: String,
      enum: ["language", "framework", "ai", "devops", "db", "tool"],
      required: true,
      index: true,
    },
    proficiency: { type: Number, min: 1, max: 5, default: 3, required: true },
    icon: { type: String, maxlength: 80 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SkillSchema.index({ category: 1, order: 1 });

export const Skill: Model<ISkill> = (models.Skill as Model<ISkill>) ?? model<ISkill>("Skill", SkillSchema);
