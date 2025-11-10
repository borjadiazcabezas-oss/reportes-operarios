// api/sendReport.js
import fetch from "node-fetch"; // Vercel incluye fetch, pero se deja por compatibilidad si hace falta
import sgMailPkg from "@sendgrid/mail";

const sgMail = sgMailPkg;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST allowed" });
    return;
  }

  try {
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@tudominio.com";
    if (!SENDGRID_API_KEY) {
      res.status(500).json({ error: "SendGrid API key not configured" });
      return;
    }
    sgMail.setApiKey(SENDGRID_API_KEY);

    const { subject, recipient, html, text } = req.body;
    if (!recipient || !subject || (!html && !text)) {
      res.status(400).json({ error: "Missing fields: recipient / subject / html|text" });
      return;
    }

    const msg = {
      to: recipient,
      from: FROM_EMAIL,
      subject,
      text: text || undefined,
      html: html || undefined,
    };

    await sgMail.send(msg);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("sendReport error:", err);
    const message = err?.response?.body || err.message || String(err);
    res.status(500).json({ error: message });
  }
}
