import { roundCents } from "../utils/generalData/numbersAndCurrencies";

export const productoPorUnidad = (Valor, Minimo, Entrada, cantidad) => {
  let resultado =
    parseFloat(Entrada) + parseFloat(cantidad) * parseFloat(Valor);
  console.log("Resultado: " + resultado);
  console.log(Valor, Minimo, Entrada, cantidad);
  resultado = resultado < parseFloat(Minimo) ? parseFloat(Minimo) : resultado;
  let valorUnitario = roundCents(resultado / cantidad);
  const papyrusExport = `(${Entrada} + (Cab_Cant_Millar * 1000))`;
  return {
    Unitario: valorUnitario,
    Cantidad: cantidad,
    Total: resultado,
    Papyrus: papyrusExport,
    Formula: "Unidad",
  };
};

export const pliegoPorLongitud = (
  valor,
  minimo,
  Entrada,
  cantidad,
  largoPliego,
  breakPoint
) => {
  console.log(valor, minimo, Entrada, cantidad, largoPliego);
  largoPliego = largoPliego / 10; // Convertir a centimetros
  const currentValue =
    breakPoint && parseFloat(largoPliego) > breakPoint[0] / 10
      ? parseFloat(valor) * parseFloat(1.15)
      : parseFloat(valor);
  let resultado =
    parseFloat(Entrada) +
    parseFloat(largoPliego) * parseFloat(cantidad) * parseFloat(currentValue);
  resultado = resultado < parseFloat(minimo) ? parseFloat(minimo) : resultado;
  let valorUnitario = roundCents(resultado / cantidad);
  const papyrusExport = `${valor} * (${cantidad} * ((${largoPliego}>${
    breakPoint ? breakPoint[0] : "0"
  })?${largoPliego} * 1.15)) * ${largoPliego}`;
  return {
    Unitario: valorUnitario,
    Cantidad: cantidad,
    Total: roundCents(resultado),
    Papyrus: papyrusExport,
    Formula: "Centimetros",
  };
};
