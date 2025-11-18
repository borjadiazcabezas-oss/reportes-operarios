import express from "express";
import { MongoClient, ServerApiVersion } from 'mongodb'; // Importa el driver de MongoDB

// Inicializar Express
const app = express();
app.use(express.json());

// --- CONFIGURACIÓN DE MONGODB ---
// Obtiene la URI de conexión desde las variables de entorno de Vercel (MONGODB_URI)
const uri = process.env.MONGODB_URI; 

// Si la URI no está configurada, el servidor no puede arrancar.
if (!uri) {
  console.error("FATAL ERROR: MONGODB_URI no está configurada en las variables de entorno de Vercel.");
  // No salimos del proceso porque Vercel espera una aplicación para exportar, 
  // pero el handler fallará.
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// --------------------------------

// CORS para permitir solicitudes desde cualquier dominio (crucial para Vercel)
app.use((req, res, next) => {
  // Configuración explícita para el manejo del 405/CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // Manejar OPTIONS preflight requests (solicitud previa de CORS)
  if (req.method === "OPTIONS") {
    // Código 204 No Content para la solicitud OPTIONS
    return res.status(204).end(); 
  }
  next();
});

// Ruta API para guardar reportes en la base de datos
app.post("/api/sendReport", async (req, res) => {
  // El cuerpo de la solicitud debe contener los datos del reporte (subject, html, text)
  if (!req.body || Object.keys(req.body).length === 0) {
     return res.status(400).json({ success: false, error: "No se recibieron datos de reporte." });
  }

  // Estructura el documento a guardar
  const reportData = {
    ...req.body,
    timestamp: new Date() // Añadir fecha de inserción
  };

  try {
    // 1. Conectar a MongoDB
    await client.connect();
    
    // 2. Seleccionar base de datos y colección
    const database = client.db("ReportesOperariosDB"); // Usa el nombre de tu BD
    const collection = database.collection("Registros"); 

    // 3. Insertar el documento
    const result = await collection.insertOne(reportData);

    // Éxito: devolver respuesta JSON
    res.json({ 
        success: true, 
        message: "Reporte guardado correctamente en la base de datos.",
        insertedId: result.insertedId
    });

  } catch (error) {
    console.error("Error al guardar reporte en MongoDB:", error);
    // Error: devolver un JSON para evitar el "Unexpected end of JSON input" en el frontend
    res.status(500).json({ 
        success: false,
        error: "Error interno del servidor al guardar el reporte.", 
        details: error.message 
    });
  } finally {
    // 4. Cerrar la conexión
    await client.close(); 
  }
});

// Exportar la app para que Vercel pueda usarla como función Serverless
export default app;