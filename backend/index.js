import express from "express";
import sendgrid from "@sendgrid/mail";

// Inicializar Express
const app = express();
app.use(express.json());

// Configurar SendGrid (Asegúrate de que SENDGRID_API_KEY esté configurada en Vercel)
sendgrid.setApiKey(process.env.SENDGRID_API_KEY || "");

// CORS permitir cualquier dominio
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // Manejar OPTIONS preflight requests
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

// Ruta API para enviar reportes
app.post("/api/sendReport", async (req, res) => {
  try {
    const { subject, html, text } = req.body;

    if (!subject || !html) {
      return res.status(400).json({ error: "Faltan datos (subject o html)" });
    }

    await sendgrid.send({
      to: "borjadiazcabezas@gmail.com", // ← TU correo final
      from: "borjadiazcabezas@gmail.com", // remitente verificado en SendGrid
      subject,
      html,
      text: text || "Reporte enviado automáticamente"
    });

    res.json({ success: true, message: "Reporte enviado correctamente." });

  } catch (error) {
    console.error("Error al enviar email:", error);
    res.status(500).json({ error: "Error en el servidor al enviar el correo." });
  }
});

// Nota: No es necesario que esta app escuche un puerto en Vercel.

// Exportar la app para Vercel
export default app;