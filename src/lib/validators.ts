import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  subject: z.string().min(2).max(160),
  message: z.string().min(10).max(4000),
  // Honeypot — must be empty.
  company: z.string().max(0).optional(),
});

export const projectSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(120),
  tagline: z.string().min(1).max(200),
  description: z.string().min(1).max(10_000),
  cover: z.string().url(),
  gallery: z.array(z.string().url()).default([]),
  tech: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  liveUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  status: z.enum(["draft", "published"]).default("published"),
  year: z.number().int().min(2000).max(2100),
});
export const projectPatchSchema = projectSchema.partial();

export const skillSchema = z.object({
  name: z.string().min(1).max(60),
  category: z.enum(["language", "framework", "ai", "devops", "db", "tool"]),
  proficiency: z.number().int().min(1).max(5),
  icon: z.string().optional(),
  order: z.number().int().default(0),
});
export const skillPatchSchema = skillSchema.partial();

export const experienceSchema = z.object({
  company: z.string().min(1).max(120),
  role: z.string().min(1).max(120),
  type: z.enum(["work", "education"]),
  start: z.string().min(1).max(40),
  end: z.string().max(40).nullable().default(null),
  location: z.string().max(120).default(""),
  highlights: z.array(z.string()).default([]),
  logo: z.string().url().optional(),
  order: z.number().int().default(0),
});
export const experiencePatchSchema = experienceSchema.partial();

export const serviceSchema = z.object({
  title: z.string().min(1).max(120),
  icon: z.string().max(40).default("layers"),
  summary: z.string().min(1).max(400),
  deliverables: z.array(z.string()).default([]),
  priceRange: z.string().max(80).optional(),
  order: z.number().int().default(0),
});
export const servicePatchSchema = serviceSchema.partial();

export const testimonialSchema = z.object({
  author: z.string().min(1).max(80),
  role: z.string().min(1).max(120),
  company: z.string().min(1).max(120),
  avatarUrl: z.string().url().optional(),
  quote: z.string().min(1).max(800),
  rating: z.number().int().min(1).max(5).default(5),
  approved: z.boolean().default(false),
});
export const testimonialPatchSchema = testimonialSchema.partial();

export const settingsSchema = z.object({
  heroHeadline: z.string().max(200).optional(),
  heroSub: z.string().max(400).optional(),
  resumeUrl: z.string().url().optional(),
  social: z
    .object({
      github: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      email: z.string().email().optional(),
    })
    .optional(),
  seoDefaults: z
    .object({
      title: z.string().max(120).optional(),
      description: z.string().max(300).optional(),
      ogImage: z.string().url().optional(),
    })
    .optional(),
});

export const messagePatchSchema = z.object({
  status: z.enum(["new", "read", "archived"]),
});
