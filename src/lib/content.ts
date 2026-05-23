/**
 * Server-only loaders for public-facing content.
 *
 * Each loader queries MongoDB and falls back to the seed data in `lib/data.ts`
 * when the collection is empty — so a freshly-deployed site still renders
 * something coherent before any admin edits.
 */

import "server-only";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { Skill } from "@/models/Skill";
import { Experience } from "@/models/Experience";
import { Service } from "@/models/Service";
import { Testimonial } from "@/models/Testimonial";
import {
  projects as fallbackProjects,
  skills as fallbackSkills,
  experience as fallbackExperience,
  services as fallbackServices,
  testimonials as fallbackTestimonials,
} from "@/lib/data";
import type {
  Project as ProjectT,
  Skill as SkillT,
  ExperienceItem as ExperienceT,
  Service as ServiceT,
  Testimonial as TestimonialT,
} from "@/types";

/** Wrap any DB call with a safe fallback so a stale connection never blanks the public site. */
async function tryDB<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    await connectDB();
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getProjects(): Promise<ProjectT[]> {
  return tryDB(async () => {
    const docs = await Project.find({ status: "published" })
      .sort({ featured: -1, order: 1, year: -1, createdAt: -1 })
      .lean();
    if (docs.length === 0) return fallbackProjects;
    return docs.map((d) => ({
      slug: d.slug,
      title: d.title,
      tagline: d.tagline,
      description: d.description,
      cover: d.cover,
      tech: d.tech ?? [],
      categories: d.categories ?? [],
      liveUrl: d.liveUrl,
      repoUrl: d.repoUrl,
      featured: d.featured,
      year: d.year,
    }));
  }, fallbackProjects);
}

export async function getProjectBySlug(slug: string): Promise<ProjectT | null> {
  return tryDB(async () => {
    const d = await Project.findOne({ slug, status: "published" }).lean();
    if (d) {
      return {
        slug: d.slug,
        title: d.title,
        tagline: d.tagline,
        description: d.description,
        cover: d.cover,
        tech: d.tech ?? [],
        categories: d.categories ?? [],
        liveUrl: d.liveUrl,
        repoUrl: d.repoUrl,
        featured: d.featured,
        year: d.year,
      };
    }
    return fallbackProjects.find((p) => p.slug === slug) ?? null;
  }, fallbackProjects.find((p) => p.slug === slug) ?? null);
}

export async function getAllProjectSlugs(): Promise<string[]> {
  return tryDB(async () => {
    const docs = await Project.find({ status: "published" }).select("slug").lean();
    if (docs.length === 0) return fallbackProjects.map((p) => p.slug);
    return docs.map((d) => d.slug);
  }, fallbackProjects.map((p) => p.slug));
}

export async function getSkills(): Promise<SkillT[]> {
  return tryDB(async () => {
    const docs = await Skill.find({}).sort({ order: 1, name: 1 }).lean();
    if (docs.length === 0) return fallbackSkills;
    return docs.map((d) => ({
      name: d.name,
      category: d.category,
      proficiency: d.proficiency,
      icon: d.icon,
    }));
  }, fallbackSkills);
}

export async function getExperience(): Promise<ExperienceT[]> {
  return tryDB(async () => {
    const docs = await Experience.find({}).sort({ order: 1, start: -1 }).lean();
    if (docs.length === 0) return fallbackExperience;
    return docs.map((d) => ({
      company: d.company,
      role: d.role,
      type: d.type,
      start: d.start,
      end: d.end,
      location: d.location ?? "",
      highlights: d.highlights ?? [],
      logo: d.logo,
    }));
  }, fallbackExperience);
}

export async function getServices(): Promise<ServiceT[]> {
  return tryDB(async () => {
    const docs = await Service.find({}).sort({ order: 1 }).lean();
    if (docs.length === 0) return fallbackServices;
    return docs.map((d) => ({
      title: d.title,
      icon: d.icon,
      summary: d.summary,
      deliverables: d.deliverables ?? [],
    }));
  }, fallbackServices);
}

export async function getTestimonials(): Promise<TestimonialT[]> {
  return tryDB(async () => {
    const docs = await Testimonial.find({ approved: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    if (docs.length === 0) return fallbackTestimonials;
    return docs.map((d) => ({
      author: d.author,
      role: d.role,
      company: d.company,
      avatar: d.avatarUrl,
      quote: d.quote,
      rating: d.rating,
    }));
  }, fallbackTestimonials);
}
