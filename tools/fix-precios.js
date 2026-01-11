const fs = require("fs");
const path = require("path");

const infile = process.argv[2] || "Precios.json";
const outfile = process.argv[3] || "Precios.fixed.json";
let s = fs.readFileSync(infile, "utf8");

// remove any leading BOM / comments / text before first {
const first = s.indexOf("{");
if (first > 0) s = s.slice(first);

// collapse accidental double opening braces
s = s.replace(/\{\s*\{/g, "{");

// ensure objects are separated by commas: replace close->open without comma
s = s.replace(/\}\s*\n\s*\{/g, "},\n{");

// trim trailing commas before final closing brace(s)
s = s.replace(/,\s*}$/s, "}");

// wrap as array if not already
const trimmed = s.trim();
let out = trimmed.startsWith("[") ? s : `[${s}\n]`;

try {
  JSON.parse(out);
} catch (e) {
  console.error("JSON parse failed:", e.message);
  fs.writeFileSync(outfile, out, "utf8");
  console.error(
    "Wrote partial output to",
    outfile,
    "- inspect file and rerun if needed."
  );
  process.exit(1);
}

fs.writeFileSync(outfile, out, "utf8");
console.log("Fixed JSON written to", outfile);
