/* eslint-disable no-console */
import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../src/lib/db";
import { User } from "../src/models/User";
import { Project } from "../src/models/Project";
import { Skill } from "../src/models/Skill";
import { Experience } from "../src/models/Experience";
import { Service } from "../src/models/Service";
import { Testimonial } from "../src/models/Testimonial";
import { ContactMessage } from "../src/models/ContactMessage";
import { SiteSettings } from "../src/models/SiteSettings";
import {
  projects as projectsData,
  skills as skillsData,
  experience as experienceData,
  services as servicesData,
  testimonials as testimonialsData,
} from "../src/lib/data";
import { siteConfig } from "../src/config/site";

const SAMPLE_MESSAGES = [
  {
    name: "Sarah Chen",
    email: "sarah@northbeam.io",
    subject: "Collaboration opportunity",
    message:
      "Hi Alif, loved your work on Pulse Analytics — we're hiring a staff engineer and would love to chat. Are you open to a 30-min intro call next week?",
    status: "new" as const,
  },
  {
    name: "Devon Walsh",
    email: "devon@stripe.com",
    subject: "Hiring for staff engineer role",
    message:
      "Saw your GitHub and would love to chat about an opportunity on our platform team. Compensation is in the staff band and fully remote.",
    status: "new" as const,
  },
  {
    name: "Mira Okafor",
    email: "mira@lumen.dev",
    subject: "RAG architecture question",
    message:
      "Question about how you scaled embeddings in Neural Notes — specifically the cache eviction strategy. Could we hop on a 20-min call?",
    status: "read" as const,
  },
  {
    name: "Jules Patel",
    email: "jules@confs.io",
    subject: "Speaking invitation",
    message: "We'd love to have you keynote at AI Engineer Summit this fall. The slot is 35 minutes plus Q&A.",
    status: "read" as const,
  },
  {
    name: "Reza Khan",
    email: "reza@example.com",
    subject: "Open source contribution",
    message:
      "Filed a PR against lumen-ui for the modal a11y issue we discussed in #213. Let me know if you want me to split it up.",
    status: "archived" as const,
  },
];

async function seedOwner() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD required");

  const passwordHash = await bcrypt.hash(password, 12);
  const owner = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase(), name: "Owner", passwordHash, role: "owner" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`  owner: ${owner.email}`);
  return owner;
}

async function seedContent(authorId: mongoose.Types.ObjectId) {
  await Promise.all([
    Project.deleteMany({}),
    Skill.deleteMany({}),
    Experience.deleteMany({}),
    Service.deleteMany({}),
    Testimonial.deleteMany({}),
    ContactMessage.deleteMany({}),
  ]);

  const projects = await Project.insertMany(
    projectsData.map((p, i) => ({
      ...p,
      status: "published" as const,
      order: i,
      author: authorId,
      publishedAt: new Date(`${p.year}-01-01`),
    }))
  );
  console.log(`  projects: ${projects.length}`);

  const skills = await Skill.insertMany(skillsData.map((s, i) => ({ ...s, order: i })));
  console.log(`  skills: ${skills.length}`);

  const experiences = await Experience.insertMany(experienceData.map((e, i) => ({ ...e, order: i })));
  console.log(`  experiences: ${experiences.length}`);

  const services = await Service.insertMany(servicesData.map((s, i) => ({ ...s, order: i })));
  console.log(`  services: ${services.length}`);

  // Link each testimonial to a featured project for realistic relationships.
  const featured = projects.filter((p) => p.featured);
  const testimonials = await Testimonial.insertMany(
    testimonialsData.map((t, i) => ({
      ...t,
      approved: true,
      order: i,
      project: featured[i % featured.length]?._id,
    }))
  );
  console.log(`  testimonials: ${testimonials.length}`);

  // Sample inbox messages, spread across the last 5 days for analytics charts.
  const now = Date.now();
  const messages = await ContactMessage.insertMany(
    SAMPLE_MESSAGES.map((m, i) => ({
      ...m,
      ip: "127.0.0.1",
      userAgent: "seed-script/1.0",
      createdAt: new Date(now - i * 24 * 60 * 60 * 1000),
    }))
  );
  console.log(`  messages: ${messages.length}`);
}

async function seedSettings() {
  await SiteSettings.findOneAndUpdate(
    { key: "default" },
    {
      key: "default",
      heroHeadline: "Building the web's intelligent future.",
      heroSub: siteConfig.description,
      resumeUrl: siteConfig.links.resume.startsWith("http")
        ? siteConfig.links.resume
        : `${siteConfig.url}${siteConfig.links.resume}`,
      social: {
        github: siteConfig.links.github,
        linkedin: siteConfig.links.linkedin,
        twitter: siteConfig.links.twitter,
        email: siteConfig.author.email,
      },
      seoDefaults: {
        title: siteConfig.title,
        description: siteConfig.description,
        ogImage: `${siteConfig.url}/og.png`,
      },
    },
    { upsert: true, setDefaultsOnInsert: true, new: true }
  );
  console.log("  settings: ok");
}

async function main() {
  await connectDB();
  console.log("✓ connected");

  const owner = await seedOwner();
  await seedContent(owner._id as mongoose.Types.ObjectId);
  await seedSettings();

  console.log("✓ seeded");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
