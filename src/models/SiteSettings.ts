import { Schema, model, models, type Model, type HydratedDocument } from "mongoose";

export interface ISocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

export interface ISeoDefaults {
  title?: string;
  description?: string;
  ogImage?: string;
}

export interface ISiteSettings {
  /** Stable key so we can upsert the singleton without storing an ObjectId. */
  key: "default";
  heroHeadline?: string;
  heroSub?: string;
  resumeUrl?: string;
  social?: ISocialLinks;
  seoDefaults?: ISeoDefaults;
  createdAt: Date;
  updatedAt: Date;
}

export type SiteSettingsDoc = HydratedDocument<ISiteSettings>;

const URL_REGEX = /^https?:\/\//i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SocialSchema = new Schema<ISocialLinks>(
  {
    github: { type: String, match: URL_REGEX },
    linkedin: { type: String, match: URL_REGEX },
    twitter: { type: String, match: URL_REGEX },
    email: { type: String, match: EMAIL_REGEX, lowercase: true },
  },
  { _id: false }
);

const SeoSchema = new Schema<ISeoDefaults>(
  {
    title: { type: String, maxlength: 120 },
    description: { type: String, maxlength: 300 },
    ogImage: { type: String, match: URL_REGEX },
  },
  { _id: false }
);

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, enum: ["default"], default: "default", unique: true, index: true },
    heroHeadline: { type: String, maxlength: 200 },
    heroSub: { type: String, maxlength: 400 },
    resumeUrl: { type: String, match: URL_REGEX },
    social: { type: SocialSchema, default: () => ({}) },
    seoDefaults: { type: SeoSchema, default: () => ({}) },
  },
  { timestamps: true }
);

/** Convenience: always read/write the same singleton document. */
SiteSettingsSchema.statics.getSingleton = async function () {
  return (
    (await this.findOne({ key: "default" })) ?? (await this.create({ key: "default" }))
  );
};

interface SiteSettingsModel extends Model<ISiteSettings> {
  getSingleton(): Promise<SiteSettingsDoc>;
}

export const SiteSettings: SiteSettingsModel =
  (models.SiteSettings as SiteSettingsModel) ??
  model<ISiteSettings, SiteSettingsModel>("SiteSettings", SiteSettingsSchema);
