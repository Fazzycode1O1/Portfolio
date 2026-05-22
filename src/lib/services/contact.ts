/**
 * Contact service — business logic for the contact form and admin inbox.
 *
 * Routes call into these functions so HTTP/auth concerns stay in the route
 * layer and DB concerns stay here.
 */

import { connectDB } from "@/lib/db";
import { ContactMessage, type IContactMessage } from "@/models/ContactMessage";

export interface CreateMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  ip?: string;
  userAgent?: string;
}

export async function createContactMessage(input: CreateMessageInput) {
  await connectDB();
  const doc = await ContactMessage.create(input);
  return { id: String(doc._id) };
}

export async function listContactMessages(): Promise<IContactMessage[]> {
  await connectDB();
  return ContactMessage.find({}).sort({ createdAt: -1 }).lean<IContactMessage[]>();
}
