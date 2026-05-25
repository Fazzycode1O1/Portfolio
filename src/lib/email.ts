/**
 * Transactional email via Resend.
 *
 * Centralized so route/service layers don't import the SDK directly. If the
 * Resend API key (or destination email) isn't configured, `sendContactNotification`
 * is a no-op — the contact form still works (DB write succeeds), the developer
 * just won't get a notification. This keeps local dev working without secrets.
 */

import "server-only";
import { Resend } from "resend";
import { serverEnv } from "@/lib/env";

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

let cached: Resend | null = null;
function getClient(): Resend | null {
  if (cached) return cached;
  const env = serverEnv();
  if (!env.RESEND_API_KEY) return null;
  cached = new Resend(env.RESEND_API_KEY);
  return cached;
}

/** Plain-text body — Resend renders both text+html where supplied. */
function plain(p: ContactPayload): string {
  return [
    `New message from ${p.name} <${p.email}>`,
    `Subject: ${p.subject}`,
    "",
    p.message,
    "",
    "—",
    "Sent via the portfolio contact form.",
  ].join("\n");
}

function html(p: ContactPayload): string {
  // Inline styles only — most email clients strip <style> tags.
  const esc = (s: string) =>
    s.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
    );
  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0a0a0a;color:#f2f2ee;font-family:system-ui,-apple-system,sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px">
      <p style="font:11px ui-monospace,monospace;letter-spacing:0.32em;text-transform:uppercase;color:#71717a;margin:0 0 16px">
        Portfolio · New Message
      </p>
      <h1 style="font-size:22px;font-weight:600;margin:0 0 24px;color:#f2f2ee">${esc(p.subject)}</h1>
      <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tr>
          <td style="padding:8px 0;color:#71717a;font:12px ui-monospace,monospace;text-transform:uppercase;letter-spacing:0.2em">From</td>
          <td style="padding:8px 0;color:#f2f2ee;font-size:14px">${esc(p.name)} &lt;<a href="mailto:${esc(p.email)}" style="color:#6b8fa8;text-decoration:none">${esc(p.email)}</a>&gt;</td>
        </tr>
      </table>
      <div style="border-top:1px solid #262626;padding-top:24px;font-size:15px;line-height:1.6;white-space:pre-wrap;color:#a8a8a2">${esc(p.message)}</div>
      <p style="margin-top:32px;color:#71717a;font:11px ui-monospace,monospace;letter-spacing:0.2em;text-transform:uppercase">— Sent via the portfolio contact form</p>
    </div>
  </body>
</html>`.trim();
}

/**
 * Fire-and-forget notification to the configured inbox. Failures are logged
 * but never thrown — a downed email provider must not break the contact API.
 */
export async function sendContactNotification(p: ContactPayload): Promise<void> {
  const env = serverEnv();
  const client = getClient();
  const to = env.CONTACT_TO_EMAIL;
  if (!client || !to) {
    // Soft-fail: log once so the developer notices configuration is missing.
    console.warn("[email] Resend not configured — skipping contact notification");
    return;
  }
  // Resend requires a verified sender. CONTACT_FROM_EMAIL must be on a domain
  // you've verified in Resend, OR you can use Resend's onboarding sender
  // `onboarding@resend.dev` (only delivers to the account owner — fine for dev).
  const from = env.CONTACT_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>";

  try {
    const res = await client.emails.send({
      from,
      to,
      replyTo: p.email,
      subject: `New message · ${p.subject}`,
      text: plain(p),
      html: html(p),
    });
    if ("error" in res && res.error) {
      console.error("[email] Resend returned error:", res.error);
    }
  } catch (err) {
    console.error("[email] Failed to send contact notification:", err);
  }
}
