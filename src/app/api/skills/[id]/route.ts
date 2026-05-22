import { Skill } from "@/models/Skill";
import { skillSchema, skillPatchSchema } from "@/lib/validators";
import { getOneHandler, patchHandler, deleteHandler } from "@/lib/crud";

export const runtime = "nodejs";

const opts = { model: Skill, entity: "Skill", createSchema: skillSchema, patchSchema: skillPatchSchema };

export const GET = getOneHandler(opts);
export const PATCH = patchHandler(opts);
export const DELETE = deleteHandler(opts);
