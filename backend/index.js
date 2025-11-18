import express from "express";
import { MongoClient, ServerApiVersion } from 'mongodb'; // Importamos el driver de MongoDB

// Inicializar Express
const app = express();
app.use(express.json());

// --- CONFIGURACIÓN DE MONGODB ---
const uri = process.env.MONGODB_URI; // Obtiene la URI de Vercel
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// --------------------------------

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

// Ruta API para guardar reportes
app.post("/api/sendReport", async (req, res) => {
  // Nota: req.body contendrá { subject, html, text } enviado por el frontend.
  // Es mejor modificar el frontend para enviar un JSON estructurado,
  // pero por ahora guardaremos el HTML completo.
  if (!req.body || Object.keys(req.body).length === 0) {
     return res.status(400).json({ error: "No se recibieron datos de reporte." });
  }

  // Estructura el documento a guardar
  const reportData = {
    ...req.body,
    timestamp: new Date() // Añadir fecha de inserción
  };

  try {
    await client.connect();
    const database = client.db("ReportesOperariosDB"); // Puedes cambiar el nombre de la BD
    const collection = database.collection("Registros"); // Nombre de la colección

    const result = await collection.insertOne(reportData);

    res.json({ 
        success: true, 
        message: "Reporte guardado correctamente en la base de datos.",
        insertedId: result.insertedId
    });

  } catch (error) {
    console.error("Error al guardar reporte en MongoDB:", error);
    // En el caso de fallo, devolvemos un JSON para que el frontend no dé SyntaxError
    res.status(500).json({ error: "Error en el servidor al guardar el reporte.", details: error.message });
  } finally {
    await client.close(); // Cierra la conexión después de la operación
  }
});

export default app;