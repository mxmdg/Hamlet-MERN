// utils/unitConverter.js

export const parseMeasure = (input, type = "length") => {
  if (input === undefined || input === null || input === "") return "";
  if (typeof input === "number") return input;

  // 1. Limpieza inicial
  const cleanInput = input.toString().toLowerCase().replace(/\s/g, "");

  // 2. Soporte para Operaciones Matemáticas (+, -, *, /)
  // Buscamos si el string tiene operadores
  const operators = cleanInput.match(/[\+\-\*\/]/g);

  if (operators) {
    // Dividimos por los operadores pero manteniendo los delimitadores para saber qué operación hacer
    // Usamos una regex que separa y mantiene el operador: "50+10" -> ["50", "+", "10"]
    const parts = cleanInput.split(/([\+\-\*\/])/);

    let total = 0;
    let currentOp = "+";

    for (const part of parts) {
      if (/[\+\-\*\/]/.test(part)) {
        currentOp = part;
      } else {
        // Procesamos la parte como una medida individual (por si tiene unidades)
        const val = processSingleTerm(part, type);

        switch (currentOp) {
          case "+":
            total += val;
            break;
          case "-":
            total -= val;
            break;
          case "*":
            total *= val;
            break;
          case "/":
            total /= val !== 0 ? val : 1;
            break;
        }
      }
    }
    return total;
  }

  // 3. Si no hay operadores, procesamos como un término único
  return processSingleTerm(cleanInput, type);
};

/**
 * Función auxiliar para procesar un solo término con su unidad
 * Ej: "10cm" -> 100
 */
const processSingleTerm = (term, type) => {
  if (!term) return 0;

  const match = term.match(/^([\d.]+)([a-z]*)$/);
  if (!match) return parseFloat(term) || 0;

  const valor = parseFloat(match[1]);
  const unidad = match[2];

  const factors = {
    length: {
      mm: 1,
      cm: 10,
      m: 1000,
      in: 25.4,
      pt: 0.3527,
      "": 1,
    },
    weight: {
      g: 1,
      kg: 1000,
      lb: 453.59,
      "": 1,
    },
  };

  const factor = factors[type]?.[unidad] || 1;
  return Math.round(100 * valor * factor) / 100; // Redondeamos a 2 decimales
};
