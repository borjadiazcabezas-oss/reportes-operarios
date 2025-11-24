import fs from "fs";
import { execSync } from "child_process";
import path from "path";

// --- CONFIGURACIÓN ---
const NEW_REPO_NAME = "reportes-dashboard";
const FIREBASE_CONFIG = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMAIN.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_BUCKET.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// --- PASO 1: Crear carpeta nueva ---
const newDir = path.join(process.cwd(), NEW_REPO_NAME);
if (!fs.existsSync(newDir)) fs.mkdirSync(newDir);

// --- PASO 2: Copiar todo el proyecto actual ---
const oldDir = process.cwd();
const copyRecursiveSync = (src, dest) => {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};
copyRecursiveSync(oldDir, newDir);

// --- PASO 3: Crear dashboard.html ---
const dashboardHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard de Actividades</title>
<style>
body { font-family: Arial, sans-serif; margin: 20px; }
h2 { text-align: center; }
ul { list-style: none; padding: 0; }
li { margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
</style>
</head>
<body>
<h2>Dashboard de Actividades en Tiempo Real</h2>
<ul id="historyList"></ul>

<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = ${JSON.stringify(FIREBASE_CONFIG)};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const q = query(collection(db, "usuarios"), orderBy("timestamp_created", "desc"));
onSnapshot(q, snapshot => {
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  snapshot.forEach(doc => {
    const d = doc.data();
    const li = document.createElement("li");
    li.innerHTML = \`
      <strong>\${d.activityType}</strong><br>
      Operario: \${d.operarioNombre} (\${d.operarioId})<br>
      Inicio: \${d.startTime ? d.startTime.toDate().toLocaleString() : "-"}<br>
      Fin: \${d.endTime ? d.endTime.toDate().toLocaleString() : "-"}<br>
      Comentario inicio: \${d.startComment || "-"}<br>
      Comentario fin: \${d.endComment || "-"}
    \`;
    list.appendChild(li);
  });
});
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(newDir, "dashboard.html"), dashboardHtml);

// --- PASO 4: Inicializar Git y crear primer commit ---
execSync("git init", { cwd: newDir });
execSync("git add .", { cwd: newDir });
execSync('git commit -m "Inicial: Dashboard agregado"', { cwd: newDir });

console.log("\n✅ Proyecto listo en:", newDir);
console.log("Ahora crea un repo vacío en GitHub y haz:");
console.log(`cd ${NEW_REPO_NAME}`);
console.log(`git remote add origin https://github.com/TU_USUARIO/${NEW_REPO_NAME}.git`);
console.log("git push -u origin main");
