import { Skill } from "@/models/Skill";
import { skillSchema, skillPatchSchema } from "@/lib/validators";
import { listHandler, createHandler } from "@/lib/crud";

export const runtime = "nodejs";

const opts = { model: Skill, entity: "Skill", createSchema: skillSchema, patchSchema: skillPatchSchema };

export const GET = listHandler(opts);
export const POST = createHandler(opts);
