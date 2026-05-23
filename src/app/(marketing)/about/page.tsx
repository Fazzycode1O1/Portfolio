import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { getSkills, getExperience } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about my background, skills, and what I bring to engineering teams.",
};

export default async function AboutPage() {
  const [skills, experience] = await Promise.all([getSkills(), getExperience()]);
  return (
    <div className="pt-24">
      <About />
      <Skills skills={skills} />
      <Experience experience={experience} />
    </div>
  );
}
