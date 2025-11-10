// generate_reports.js
const fs = require('fs');
const path = require('path');

const basePath = __dirname;
const baseFile = path.join(basePath, 'reporte_base.html');
if (!fs.existsSync(baseFile)) {
  console.error('No encuentro reporte_base.html en', basePath);
  process.exit(1);
}
const base = fs.readFileSync(baseFile,'utf8');

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
  { name: "Francisco Javier Herrera", code: "251", file: "reporte_franciscojh_251.html" },
  { name: "Jose Miguel Benitez", code: "252", file: "reporte_josemiguel_252.html" }
];

operarios.forEach(op => {
  let out = base.replace(/OPERATOR_NAME/g, escapeHtml(op.name)).replace(/OPERATOR_CODE/g, escapeHtml(op.code));
  const outPath = path.join(basePath, op.file);
  fs.writeFileSync(outPath, out, 'utf8');
  console.log('Generated', op.file);
});

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
