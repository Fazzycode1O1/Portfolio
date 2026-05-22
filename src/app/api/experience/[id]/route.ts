import { Experience } from "@/models/Experience";
import { experienceSchema, experiencePatchSchema } from "@/lib/validators";
import { getOneHandler, patchHandler, deleteHandler } from "@/lib/crud";

export const runtime = "nodejs";

const opts = { model: Experience, entity: "Experience", createSchema: experienceSchema, patchSchema: experiencePatchSchema };

export const GET = getOneHandler(opts);
export const PATCH = patchHandler(opts);
export const DELETE = deleteHandler(opts);
