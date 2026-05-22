import { Experience } from "@/models/Experience";
import { experienceSchema, experiencePatchSchema } from "@/lib/validators";
import { listHandler, createHandler } from "@/lib/crud";

export const runtime = "nodejs";

const opts = {
  model: Experience,
  entity: "Experience",
  createSchema: experienceSchema,
  patchSchema: experiencePatchSchema,
  defaultSort: { order: 1 as const, start: -1 as const },
};

export const GET = listHandler(opts);
export const POST = createHandler(opts);
