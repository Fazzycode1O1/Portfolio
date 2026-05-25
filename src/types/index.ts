export type SkillCategory = "language" | "framework" | "ai" | "devops" | "db" | "tool";

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiency: 1 | 2 | 3 | 4 | 5;
  icon?: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  tech: string[];
  categories: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  year: number;
}

export interface ExperienceItem {
  company: string;
  role: string;
  type: "work" | "education";
  start: string;
  end: string | null;
  location: string;
  highlights: string[];
  logo?: string;
}

export interface Service {
  title: string;
  icon: string;
  summary: string;
  deliverables: string[];
}
