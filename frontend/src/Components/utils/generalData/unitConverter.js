// utils/unitConverter.js

const factors = {
  length: { mm: 1, cm: 10, m: 1000, in: 25.4, pt: 0.3527, "": 1 },
  weight: { g: 1, kg: 1000, lb: 453.59, "": 1 },
  currency: { ARS: 1, USD: 1400 },
};

/**
 * Convierte de (Cualquier unidad o defaultUnit) -> A -> (Milímetros o Gramos)
 */
export const parseMeasure = (input, type = "length", defaultUnit = "") => {
  if (input === undefined || input === null || input === "") return "";
  if (typeof input === "number") return input; // Asume que ya está en base

  const cleanInput = input.toString().toLowerCase().replace(/\s/g, "");
  const operators = cleanInput.match(/[\+\-\*\/]/g);

  if (operators) {
    const parts = cleanInput.split(/([\+\-\*\/])/);
    let total = 0;
    let currentOp = "+";

    for (const part of parts) {
      if (/[\+\-\*\/]/.test(part)) {
        currentOp = part;
      } else {
        const val = processSingleTerm(part, type, defaultUnit);
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

  return processSingleTerm(cleanInput, type, defaultUnit);
};

const processSingleTerm = (term, type, defaultUnit) => {
  if (!term) return 0;

  const match = term.match(/^([\d.]+)([a-z]*)$/);
  if (!match) return parseFloat(term) || 0;

  const valor = parseFloat(match[1]);
  const unidad = match[2] || defaultUnit; // Si no tipeó unidad, usa la default

  const factor = factors[type]?.[unidad] || 1;
  return Math.round(100 * valor * factor) / 100;
};

/**
 * Convierte de (Milímetros o Gramos) -> A -> (Unidad de preferencia)
 */
export const formatMeasure = (
  valueInBaseUnit,
  type = "length",
  targetUnit = "",
) => {
  if (
    valueInBaseUnit === undefined ||
    valueInBaseUnit === null ||
    valueInBaseUnit === ""
  )
    return "";

  const valor = parseFloat(valueInBaseUnit);
  if (isNaN(valor)) return "";

  // Si la unidad objetivo es vacía o es la misma base, se devuelve tal cual
  if (
    !targetUnit ||
    (type === "length" && targetUnit === "mm") ||
    (type === "weight" && targetUnit === "g") ||
    (type === "currency" && targetUnit === "$")
  ) {
    return valor;
  }

  const factor = factors[type]?.[targetUnit] || 1;
  // Dividimos por el factor para volver hacia atrás (ej: 215.9 mm / 25.4 = 8.5 in)
  return Math.round((valor / factor) * 100) / 100;
};
