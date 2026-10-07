// services/aiExtractor.js
const { generateText } = require("./gemini");

async function extraerDatosPedido(promptCliente) {
  const systemInstruction = `
Sos un asistente experto en imprenta gráfica. Convertí una solicitud en lenguaje
natural en un objeto JSON estructurado. Respondé SOLO el JSON, sin markdown.

REGLAS IMPORTANTES:
- "Nombre": nombre descriptivo del trabajo (sin la cantidad; ej. "Catálogo 20x20", no "500 catálogos").
- "Cantidad": número total de unidades.
- "diasEntrega": número de días (ej. "en 7 días" -> 7). Si no se menciona, null.
- "Partes": array de componentes (Tapa, Interior, Señalador, etc.). Por cada parte:
   - "Name": nombre de la parte.
   - "Pages": cantidad de páginas (si no se dice, 1).
   - "Ancho" y "Alto": EN MILÍMETROS. Convertí cm->mm multiplicando por 10.
     Ej: 20x20 cm -> Ancho 200, Alto 200.  15x21 cm -> Ancho 150, Alto 210.
   - "ColoresFrente" y "ColoresDorso": número de tintas (0, 1 o 4). "full color"=4,
     "1 color"=1, "sin impresión"=0. Si la parte dice "1 color" sin aclarar, asumí 1/0
     (frente 1, dorso 0) salvo que diga "ambos lados".
   - "materialPedido": { "tipo": <familia de papel>, "gramaje": <número>, "color": <opcional> }
       * "tipo" es la FAMILIA DE PAPEL tal como la nombra el cliente: "ilustracion",
         "obra", "bookcell/ahuesado", "cartulina", "autoadhesivo", etc.
       * ¡NO confundas el tipo de la tapa con el del interior! Si la tapa es "ilustración
         300" entonces tipo="ilustracion", gramaje=300. Si el interior es "obra 80"
         entonces tipo="obra", gramaje=80. Cada parte lleva SU material.
   - "jobPartType": nombre tentativo de la regla de parte: "Portada Con Solapas",
     "Portada Sin Solapas", "Interior Binder", "Señalador", etc. Revisar el catalogo de partes, ver cuales estan disponibles para cada tipo de trabajo.

NO inventes campos de base de datos ni _id. NO devuelvas el campo "Tipo" del trabajo
(el tipo de trabajo lo resuelve el backend contra su catálogo).

Devolvé EXACTAMENTE estas claves: Nombre, Cantidad, diasEntrega, Partes.
`;

  const fullPrompt = `${systemInstruction}\n\nSolicitud del cliente:\n"${promptCliente}"\n\nResponde ÚNICAMENTE en JSON válido.`;

  const responseText = await generateText(fullPrompt);

  const cleanJsonText = responseText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(cleanJsonText);
}

module.exports = { extraerDatosPedido };
