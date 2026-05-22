import type { Metadata } from "next";
import { Projects } from "@/components/sections/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "A complete archive of projects — shipped products, AI tools, and open-source libraries.",
};

export default function ProjectsPage() {
  return (
    <div className="pt-24">
      <Projects />
    </div>
  );
}
