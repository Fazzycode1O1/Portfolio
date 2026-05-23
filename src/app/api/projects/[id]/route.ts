import { Project } from "@/models/Project";
import { projectSchema, projectPatchSchema } from "@/lib/validators";
import { getOneHandler, patchHandler, deleteHandler } from "@/lib/crud";

export const runtime = "nodejs";

const opts = {
  model: Project,
  entity: "Project",
  createSchema: projectSchema,
  patchSchema: projectPatchSchema,
  revalidatePaths: [
    "/",
    "/projects",
    { path: "/projects/[slug]", type: "page" as const },
    "/sitemap.xml",
  ],
};

export const GET = getOneHandler(opts);
export const PATCH = patchHandler(opts);
export const DELETE = deleteHandler(opts);
