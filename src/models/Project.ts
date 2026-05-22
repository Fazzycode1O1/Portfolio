import { Schema, model, models, type Model, type HydratedDocument, type Types } from "mongoose";
import { SLUG_REGEX, URL_REGEX } from "@/lib/regex";

export type ProjectStatus = "draft" | "published";

export interface IProjectMetrics {
  stars: number;
  users: number;
  perf: number;
}

export interface IProject {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  gallery: string[];
  tech: string[];
  categories: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  order: number;
  status: ProjectStatus;
  year: number;
  metrics: IProjectMetrics;
  /** Author (owner/admin who created the project). */
  author?: Types.ObjectId;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectDoc = HydratedDocument<IProject>;

const MetricsSchema = new Schema<IProjectMetrics>(
  {
    stars: { type: Number, default: 0, min: 0 },
    users: { type: Number, default: 0, min: 0 },
    perf: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
      match: [SLUG_REGEX, "Slug must be kebab-case (lowercase, digits, hyphens)"],
      index: true,
    },
    title: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
    tagline: { type: String, required: true, trim: true, minlength: 1, maxlength: 200 },
    description: { type: String, required: true, minlength: 1, maxlength: 10_000 },
    cover: { type: String, required: true, match: [URL_REGEX, "Cover must be an absolute URL"] },
    gallery: { type: [String], default: [], validate: (a: string[]) => a.every((u) => URL_REGEX.test(u)) },
    tech: { type: [String], default: [], index: true },
    categories: { type: [String], default: [], index: true },
    liveUrl: { type: String, match: URL_REGEX },
    repoUrl: { type: String, match: URL_REGEX },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "published", index: true },
    year: { type: Number, required: true, min: 2000, max: 2100 },
    metrics: { type: MetricsSchema, default: () => ({}) },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    publishedAt: Date,
  },
  { timestamps: true }
);

// Compound indexes for common query paths
ProjectSchema.index({ status: 1, featured: -1, order: 1, year: -1 });
ProjectSchema.index({ tech: 1, status: 1 });
// Admin list has no status filter — sort-only index keeps it from collection-scanning.
ProjectSchema.index({ featured: -1, order: 1, year: -1 });

// Auto-set publishedAt when status flips to "published"
ProjectSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Virtual: route to the project detail page
ProjectSchema.virtual("path").get(function () {
  return `/projects/${this.slug}`;
});

export const Project: Model<IProject> =
  (models.Project as Model<IProject>) ?? model<IProject>("Project", ProjectSchema);
