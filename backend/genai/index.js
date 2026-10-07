import { GoogleGenAI } from '@google/genai';

// Se inicializa detectando la variable GEMINI_API_KEY en el entorno
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function pedirRespuesta() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'Explicame en dos oraciones qué es Express.js',
  });

  console.log(response.text);
}