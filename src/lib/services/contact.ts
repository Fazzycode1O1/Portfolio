/**
 * Contact service — business logic for the contact form and admin inbox.
 *
 * Routes call into these functions so HTTP/auth concerns stay in the route
 * layer and DB concerns stay here.
 */

import { connectDB } from "@/lib/db";
import { ContactMessage, type IContactMessage } from "@/models/ContactMessage";
import { sendContactNotification } from "@/lib/email";

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

  // Notification email — fire-and-forget. We don't await the result inside the
  // request handler, but we DO catch errors here so an unhandled rejection
  // can't crash the Node process. The email helper itself also catches
  // internally, so this is belt-and-braces.
  void sendContactNotification({
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
  }).catch((err) => {
    console.error("[contact] notification dispatch failed:", err);
  });

  return { id: String(doc._id) };
}

export async function listContactMessages(): Promise<IContactMessage[]> {
  await connectDB();
  return ContactMessage.find({}).sort({ createdAt: -1 }).lean<IContactMessage[]>();
}
