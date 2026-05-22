import { Project } from "@/models/Project";
import { projectSchema, projectPatchSchema } from "@/lib/validators";
import { listHandler, createHandler } from "@/lib/crud";

export const runtime = "nodejs";

const opts = {
  model: Project,
  entity: "Project",
  createSchema: projectSchema,
  patchSchema: projectPatchSchema,
  publicFilter: { status: "published" as const },
  defaultSort: { featured: -1 as const, order: 1 as const, year: -1 as const },
};

export const GET = listHandler(opts);
export const POST = createHandler(opts);
