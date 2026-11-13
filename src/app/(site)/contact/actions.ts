"use server";

export type QuoteState = { ok: boolean; message: string } | null;

const required = ["name", "email", "eventType", "eventDate", "country", "guests", "package"] as const;

/**
 * Receives the quote form. For now it validates and logs on the server.
 * TODO: send the enquiry to your inbox (e.g. Resend / Postmark) or a CRM sheet.
 */
export async function submitQuote(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  const data = Object.fromEntries(formData.entries()) as Record<string, string>;

  for (const key of required) {
    if (!data[key]?.toString().trim()) return { ok: false, message: "Please fill in all required fields." };
  }
  if (!/^\S+@\S+\.\S+$/.test(data.email)) return { ok: false, message: "Please enter a valid email address." };

  console.log("[quote request]", { ...data, receivedAt: new Date().toISOString() });

  return { ok: true, message: "Thank you! We'll reply with a clear quote within one business day." };
}
