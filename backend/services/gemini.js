// services/gemini.js
const { GoogleGenAI } = require("@google/genai");

// Inicializa detectando process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

// IMPORTANTE: confirmá el nombre EXACTO del modelo en Google AI Studio.
// "gemini-3.5-flash-lite" NO existe. Modelos válidos actuales de la familia Flash:
//   "gemini-2.0-flash"  |  "gemini-1.5-flash"
// Dejá el nombre en una env var para no tocar código si cambia.
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

async function generateText(prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });
  return response.text;
}

module.exports = { generateText, MODEL };
