// services/aiAgent.js
const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({});
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash"; // "gemini-3.5-flash-lite" NO existe

/**
 * La IA elige el material MÁS ADECUADO del menú, con criterio de imprentero.
 * Devuelve { selected_id, razonamiento }. El selected_id SIEMPRE debe validarse
 * contra el menú en el que llama (jobBuilder ya lo hace).
 */
async function seleccionarMaterialConCriterio({ producto, pedidoCliente, menuMateriales }) {
  const systemInstruction = `
Sos un imprentero experto cargando un trabajo en el sistema Hamlet.
Elegí el _id del material MÁS ADECUADO de la lista 'menuMateriales'.

REGLAS:
1. DEBES elegir un '_id' que exista EXACTAMENTE en 'menuMateriales'. Nunca inventes uno.
2. Si el gramaje pedido no existe, aplicá criterio según el producto:
   - Postales, Tarjetas, Tapas, Solapas: preferí SUBIR rigidez (gramaje superior más cercano).
   - Revistas, Interiores, Folletos, Acaballados: preferí BAJAR (mejor plegado).
3. Respetá el color si el cliente lo pidió (ej. ahuesado/crema para interiores de libro).
`;

  const prompt = `
Producto: ${producto}
Pedido del cliente: ${JSON.stringify(pedidoCliente)}
Opciones disponibles (elegí un _id de esta lista):
${JSON.stringify(menuMateriales, null, 2)}
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          selected_id: { type: Type.STRING, description: "El _id exacto elegido del menú" },
          razonamiento: { type: Type.STRING, description: "Justificación técnica breve" },
        },
        required: ["selected_id", "razonamiento"],
      },
    },
  });

  return JSON.parse(response.text);
}

module.exports = { seleccionarMaterialConCriterio };
