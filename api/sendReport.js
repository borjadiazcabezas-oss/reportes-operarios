import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY || "");

export default async function handler(req, res) {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  console.log("sendReport invoked");

  try {
    const { subject, html, text, recipient } = req.body;

    if (!subject || !html) {
      return res.status(400).json({ error: "Faltan datos (subject o html)" });
    }

    await sendgrid.send({
      to: recipient || "borjadiazcabezas@gmail.com",
      from: process.env.SENDGRID_FROM || "borjadiazcabezas@gmail.com",
      subject,
      html,
      text: text || "Reporte enviado automáticamente"
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Error enviando correo:", err);
    return res.status(500).json({ error: err.message });
  }
}
