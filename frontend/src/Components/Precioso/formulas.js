import { roundCents } from "./formSimulators";

export const productoPorUnidad = (price, cantidad) => {
  const { valor, minimo, entrada } = price;
  let resultado =
    parseFloat(entrada) + parseFloat(cantidad) * parseFloat(valor);
  resultado = resultado < parseFloat(minimo) ? parseFloat(minimo) : resultado;
  let valorUnitario = roundCents(resultado / cantidad);
  const papyrusExport = `(${entrada} + (Cab_Cant_Millar * 1000))`;
  return {
    Unitario: valorUnitario,
    Cantidad: cantidad,
    Total: resultado,
    Papyrus: papyrusExport,
  };
};

export const pliegoPorLongitud = (
  valor,
  minimo,
  cantidad,
  entrada,
  largoPliego,
  breakPoint
) => {
  const currentValue =
    breakPoint && parseFloat(largoPliego) > breakPoint
      ? parseFloat(valor) * parseFloat(1.15)
      : parseFloat(valor);
  let resultado =
    parseFloat(entrada) +
    parseFloat(largoPliego) * parseFloat(cantidad) * parseFloat(currentValue);
  resultado = resultado < parseFloat(minimo) ? parseFloat(minimo) : resultado;
  let valorUnitario = roundCents(resultado / cantidad);
  const papyrusExport = `${valor} * (${cantidad} * ((${largoPliego}>${breakPoint})?${largoPliego} * 1.15)) * ${largoPliego}`;
  return {
    Unitario: valorUnitario,
    Cantidad: cantidad,
    Total: resultado,
    Papyrus: papyrusExport,
  };
};
