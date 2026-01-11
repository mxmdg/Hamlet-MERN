const fs = require("fs");
const path = require("path");

const inFile = path.resolve(
  "d:/Maxi/Hamlet/bkp mongoDB/mongodb-database-tools-windows-x86_64-100.11.0/mongodb-database-tools-windows-x86_64-100.11.0/bin/dump 08012026/test/Precios.json"
);
const outFile = path.resolve(
  "d:/Maxi/Hamlet/Hamlet-MERN/tools/Precios.cleaned.json"
);

try {
  const raw = fs.readFileSync(inFile, "utf8").trim();
  // Join multiple top-level objects into a JSON array by inserting commas between `}\n{` boundaries
  const arrayText = "[\n" + raw.replace(/\}\s*\n\s*\{/g, "},\n{") + "\n]";

  // Try to parse then stringify to ensure valid JSON and pretty print
  try {
    const parsed = JSON.parse(arrayText);
    fs.writeFileSync(outFile, JSON.stringify(parsed, null, 2), "utf8");
    console.log("JSON corregido y formateado guardado en:", outFile);
  } catch (parseErr) {
    // Si no es parseable (por extensiones de Mongo), guardar la versión "array" para inspección manual
    fs.writeFileSync(outFile, arrayText, "utf8");
    console.warn(
      "No se pudo parsear completamente. Se creó el fichero con el array corregido sin formatear JSON standard:",
      outFile
    );
  }
} catch (err) {
  console.error("Error procesando archivos:", err.message);
  process.exit(1);
}
