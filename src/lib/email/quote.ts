/** Email bodies for a quote request: one to the studio, one confirmation to the client. */

export type QuoteFields = Record<string, string>;

const labels: [key: string, label: string][] = [
  ["name", "Name"],
  ["email", "Email"],
  ["eventType", "Event type"],
  ["eventDate", "Date"],
  ["country", "Country / time zone"],
  ["guests", "Guest count"],
  ["package", "Package"],
  ["currency", "Currency shown"],
  ["domain", "Custom domain"],
  ["language", "Language(s)"],
  ["design", "Design"],
  ["reference", "Design reference / idea"],
  ["notes", "Notes"],
];

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const rows = (d: QuoteFields) => labels.filter(([k]) => d[k]?.trim());

/** Short plain-text summary, also used to pre-fill a WhatsApp message. */
export function quoteSummary(d: QuoteFields) {
  return rows(d)
    .filter(([k]) => k !== "email" && k !== "currency")
    .map(([k, label]) => `${label}: ${d[k].trim()}`)
    .join("\n");
}

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f6f2ea;font-family:Helvetica,Arial,sans-serif;color:#0e0e0e">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0e0e0e;padding:24px 32px;color:#f6f2ea;font-size:13px;letter-spacing:.2em;text-transform:uppercase">Entice Studio</td></tr>
<tr><td style="padding:32px"><h1 style="margin:0 0 20px;font-family:Georgia,serif;font-weight:normal;font-size:28px">${title}</h1>${body}</td></tr>
</table></td></tr></table></body></html>`;
}

function table(d: QuoteFields) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5">${rows(d)
    .map(
      ([k, label]) =>
        `<tr><td style="padding:8px 12px 8px 0;border-top:1px solid #eee;color:#777;width:38%;vertical-align:top">${label}</td><td style="padding:8px 0;border-top:1px solid #eee;white-space:pre-wrap">${escape(d[k].trim())}</td></tr>`,
    )
    .join("")}</table>`;
}

export function studioEmail(d: QuoteFields) {
  return {
    subject: `New quote request: ${d.eventType} on ${d.eventDate} (${d.name})`,
    html: layout(
      "New quote request",
      `<p style="margin:0 0 20px;color:#555">Reply to this email to answer ${escape(d.name)} directly.</p>${table(d)}`,
    ),
    text: `New quote request\n\n${rows(d)
      .map(([k, label]) => `${label}: ${d[k].trim()}`)
      .join("\n")}`,
  };
}

export function clientEmail(d: QuoteFields) {
  const first = d.name.trim().split(/\s+/)[0];
  return {
    subject: "We've received your request, Entice Studio",
    html: layout(
      `Thank you, ${escape(first)}.`,
      `<p style="margin:0 0 16px;color:#333;line-height:1.6">We've received your request and will reply with a clear quote within one business day. Here's what you sent us:</p>${table(d)}<p style="margin:24px 0 0;color:#555;line-height:1.6">Want to add something? Just reply to this email.</p>`,
    ),
    text: `Thank you, ${first}.\n\nWe've received your request and will reply with a clear quote within one business day.\n\n${quoteSummary(d)}\n\nWant to add something? Just reply to this email.`,
  };
}
