import { Service } from "@/models/Service";
import { serviceSchema, servicePatchSchema } from "@/lib/validators";
import { getOneHandler, patchHandler, deleteHandler } from "@/lib/crud";

export const runtime = "nodejs";

const opts = {
  model: Service,
  entity: "Service",
  createSchema: serviceSchema,
  patchSchema: servicePatchSchema,
  revalidatePaths: ["/"],
};

export const GET = getOneHandler(opts);
export const PATCH = patchHandler(opts);
export const DELETE = deleteHandler(opts);
