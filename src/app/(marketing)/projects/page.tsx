import type { Metadata } from "next";
import { Projects } from "@/components/sections/projects";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "A complete archive of projects —  open-source libraries.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="pt-24">
      <Projects projects={projects} />
    </div>
  );
}
