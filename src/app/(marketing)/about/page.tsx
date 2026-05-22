import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about my background, skills, and what I bring to engineering teams.",
};

export default function AboutPage() {
  return (
    <div className="pt-24">
      <About />
      <Skills />
      <Experience />
    </div>
  );
}
