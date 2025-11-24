import { MongoClient } from "mongodb";

let cachedClient = null;

async function connectToDB() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();

  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const client = await connectToDB();
    const db = client.db("tuNombreDB");
    const collection = db.collection("contactos");

    // Datos enviados desde tu HTML
    const { nombre, email, mensaje } = req.body;

    await collection.insertOne({
      nombre,
      email,
      mensaje,
      fecha: new Date()
    });

    // Si quieres seguir enviando email por SendGrid, lo haces aquí
    // await sendEmail(nombre, email, mensaje)

    return res.status(200).json({ ok: true, message: "Datos guardados" });

  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
