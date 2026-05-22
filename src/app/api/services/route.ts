import { Service } from "@/models/Service";
import { serviceSchema, servicePatchSchema } from "@/lib/validators";
import { listHandler, createHandler } from "@/lib/crud";

export const runtime = "nodejs";

const opts = { model: Service, entity: "Service", createSchema: serviceSchema, patchSchema: servicePatchSchema };

export const GET = listHandler(opts);
export const POST = createHandler(opts);
