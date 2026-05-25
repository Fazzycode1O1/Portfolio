import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Services } from "@/components/sections/services";
import { GitHubStats } from "@/components/sections/github-stats";
import { Contact } from "@/components/sections/contact";
import {
  getSkills,
  getProjects,
  getExperience,
  getServices,
} from "@/lib/content";

export default async function HomePage() {
  const [skills, projects, experience, services] = await Promise.all([
    getSkills(),
    getProjects(),
    getExperience(),
    getServices(),
  ]);

  return (
    <>
      <Hero />
      <About />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Experience experience={experience} />
      <Services services={services} />
      <GitHubStats />
      <Contact />
    </>
  );
}
