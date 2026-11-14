"use server";

import { Resend } from "resend";
import { clientEmail, quoteSummary, studioEmail, type QuoteFields } from "@/lib/email/quote";

export type QuoteState =
  | { ok: true; message: string; summary: string }
  | { ok: false; message: string; values?: QuoteFields }
  | null;

const required = ["name", "email", "eventType", "eventDate", "country", "package"] as const;
const fields = [...required, "guests", "currency", "domain", "language", "design", "reference", "notes"] as const;

/**
 * Receives the quote form and emails it to the studio with Resend (reply-to = the client),
 * then sends the client a confirmation. Configure in .env.local, see .env.example.
 */
export async function submitQuote(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  // Hidden "website" field: people never see it, bots fill it in. Pretend it worked.
  if (formData.get("website")) return { ok: true, message: "Thank you!", summary: "" };

  // Only keep known fields, trimmed and length-capped.
  const data: QuoteFields = {};
  for (const key of fields) {
    const value = formData.get(key);
    data[key] = typeof value === "string" ? value.trim().slice(0, key === "notes" ? 3000 : key === "reference" ? 1000 : 200) : "";
  }

  for (const key of required) {
    if (!data[key]) return { ok: false, message: "Please fill in all required fields.", values: data };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { ok: false, message: "Please enter a valid email address.", values: data };

  const ok = { ok: true as const, message: "Thank you! We'll reply with a clear quote within one business day.", summary: quoteSummary(data) };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Entice Studio <onboarding@resend.dev>";

  const dev = process.env.NODE_ENV !== "production";

  if (!apiKey || !to) {
    const missing = [!apiKey && "RESEND_API_KEY", !to && "CONTACT_TO_EMAIL"].filter(Boolean).join(" and ");
    console.error(`[quote request] not sent: ${missing} is empty in .env.local`, data);
    return {
      ok: false,
      // in development, say exactly what's wrong; visitors on the live site get the friendly version
      message: dev
        ? `Not sent: ${missing} is empty in .env.local. (Only you see this message, while developing.)`
        : "Sorry, we couldn't send that right now. Please message us on WhatsApp instead.",
      values: data,
    };
  }

  const resend = new Resend(apiKey);

  const studio = studioEmail(data);
  const { error } = await resend.emails.send({
    from,
    to: to.split(",").map((s) => s.trim()),
    replyTo: data.email,
    subject: studio.subject,
    html: studio.html,
    text: studio.text,
  });
  if (error) {
    console.error("[quote request] studio email failed", error);
    return {
      ok: false,
      message: dev
        ? `Not sent. Resend said: ${error.message} (Only you see this message, while developing.)`
        : "Sorry, we couldn't send that right now. Please try again or message us on WhatsApp.",
      values: data,
    };
  }

  // Confirmation to the client. Resend's shared test sender (onboarding@resend.dev) can only
  // email your own account, so this only runs once you send from your verified domain.
  if (!from.includes("resend.dev")) {
    const client = clientEmail(data);
    const res = await resend.emails.send({
      from,
      to: data.email,
      replyTo: to.split(",")[0].trim(),
      subject: client.subject,
      html: client.html,
      text: client.text,
    });
    // The studio already has the request, so a failed confirmation isn't the client's problem.
    if (res.error) console.error("[quote request] confirmation email failed", res.error);
  }

  return ok;
}
