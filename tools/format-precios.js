const fs = require("fs");
const path = require("path");

const inFile = path.resolve(
  "d:/Maxi/Hamlet/bkp mongoDB/mongodb-database-tools-windows-x86_64-100.11.0/mongodb-database-tools-windows-x86_64-100.11.0/bin/dump 08012026/test/Precios.json"
);
const outFile = path.resolve(
  "d:/Maxi/Hamlet/Hamlet-MERN/tools/Precios.formatted.json"
);

try {
  const raw = fs.readFileSync(inFile, "utf8").trim();
  // Insert commas between adjacent top-level objects and wrap into an array
  const arrayText = "[\n" + raw.replace(/\}\s*\n\s*\{/g, "},\n{") + "\n]";

  try {
    // Try to parse and pretty-print (works for valid JSON with Mongo extended types as objects)
    const parsed = JSON.parse(arrayText);
    fs.writeFileSync(outFile, JSON.stringify(parsed, null, 2), "utf8");
    console.log("Archivo formateado creado en:", outFile);
  } catch (parseErr) {
    // Si no se puede parsear, guardar la versión "array" (más legible que el original)
    fs.writeFileSync(outFile, arrayText, "utf8");
    console.warn(
      "No fue posible parsear JSON. Se creó el archivo con el array corregido en:",
      outFile
    );
  }
} catch (err) {
  console.error("Error procesando el archivo:", err.message);
  process.exit(1);
}
