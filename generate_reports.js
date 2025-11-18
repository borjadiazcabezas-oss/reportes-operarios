// generate_reports.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURACIÓN DE RUTAS ---
const __filename = fileURLToPath(import.meta.url);
const basePath = path.dirname(__filename);
const baseFile = path.join(basePath, 'reporte_base.html');

if (!fs.existsSync(baseFile)) {
  console.error('ERROR: No encuentro reporte_base.html en', basePath);
  process.exit(1);
}

const baseContent = fs.readFileSync(baseFile, 'utf8');
// -----------------------------

const operarios = [
  { name: "Eloy Quiñones", code: "40", file: "reporte_eloy_40.html" },
  { name: "Antonio Montes", code: "120", file: "reporte_antonio_120.html" },
  { name: "Carlos Javier Rivera", code: "158", file: "reporte_carlos_158.html" },
  { name: "Humberto Mariscal", code: "177", file: "reporte_humberto_177.html" },
  { name: "Jonatan Escarraman", code: "178", file: "reporte_jonatan_178.html" },
  { name: "Jose Gregorio Sarti", code: "196", file: "reporte_joseg_196.html" },
  { name: "Francisco Quiñones", code: "199", file: "reporte_franciscoq_199.html" },
  { name: "Juan Jose Sarti", code: "203", file: "reporte_juanjose_203.html" },
  { name: "Juan Carlos Ugueto", code: "204", file: "reporte_juancarlos_204.html" },
  { name: "Francisco Garcia", code: "229", file: "reporte_franciscog_229.html" },
  { name: "Francisco Romero", code: "239", file: "reporte_franciscor_239.html" },
  { name: "Antonio Ramos", code: "243", file: "reporte_antonior_243.html" },
  { name: "Juan Manuel Baez", code: "244", file: "reporte_juanmanuel_244.html" },
  { name: "Josue Cortes", code: "246", file: "reporte_josue_246.html" },
  { name: "Angel Luis Torres", code: "250", file: "reporte_angel_250.html" },
  { name: "Francisco Javier Herrera", code: "251", file: "reporte_franciscoj_251.html" },
  { name: "José Pérez", code: "252", file: "reporte_josep_252.html" }
];

// --- LÓGICA DE GENERACIÓN ---
let count = 0;

// placeholders que hay en la plantilla
const spanPlaceholder = '<span id="operator-name"></span>';

// Regex para reemplazar las constantes JS dentro del <script>
// - busca: const OPERATOR_NAME = "....";
// - busca: const OPERATOR_CODE = "....";
const reOperatorName = /const\s+OPERATOR_NAME\s*=\s*["'`][\s\S]*?["'`]\s*;/;
const reOperatorCode = /const\s+OPERATOR_CODE\s*=\s*["'`][\s\S]*?["'`]\s*;/;

operarios.forEach(operario => {
  // 1) Reemplazo del span visible
  let newContent = baseContent.replace(
    spanPlaceholder,
    `<span id="operator-name">${operario.name} (${operario.code})</span>`
  );

  // 2) Reemplazo seguro de las constantes JS dentro del script
  // Usamos JSON.stringify para asegurar que se respeten comillas / tildes / etc.
  const safeName = JSON.stringify(operario.name);   // incluye comillas
  const safeCode = JSON.stringify(operario.code);   // incluye comillas

  if (reOperatorName.test(newContent)) {
    newContent = newContent.replace(reOperatorName, `const OPERATOR_NAME = ${safeName};`);
  } else {
    console.warn(`⚠️ Advertencia: no encontré la constante OPERATOR_NAME en la plantilla para ${operario.file}`);
  }

  if (reOperatorCode.test(newContent)) {
    newContent = newContent.replace(reOperatorCode, `const OPERATOR_CODE = ${safeCode};`);
  } else {
    console.warn(`⚠️ Advertencia: no encontré la constante OPERATOR_CODE en la plantilla para ${operario.file}`);
  }

  // 3) Guarda el archivo
  const outputPath = path.join(basePath, operario.file);
  fs.writeFileSync(outputPath, newContent, 'utf8');
  console.log(`✔ Generado: ${operario.file}`);
  count++;
});

console.log(`\n✅ ¡Proceso completado! Se generaron ${count} reportes distintos.`);
