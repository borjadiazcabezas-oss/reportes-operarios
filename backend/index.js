import express from "express";
import sendgrid from "@sendgrid/mail";

// Inicializar Express
const app = express();
app.use(express.json());

// Configurar SendGrid
sendgrid.setApiKey(process.env.SENDGRID_API_KEY || "");

// CORS permitir cualquier dominio (si lo quieres así)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

// Ruta API para enviar reportes
app.post("/api/sendReport", async (req, res) => {
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

    res.json({ success: true, message: "Correo enviado correctamente" });

  } catch (err) {
    console.error("Error enviando correo:", err);
    // Evitar filtrar secretos en la respuesta; envía mensaje genérico si quieres.
    res.status(500).json({ error: err.message || "Error interno" });
  }
});

export default app;
