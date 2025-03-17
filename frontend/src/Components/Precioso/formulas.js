import { roundCents } from "../utils/generalData/numbersAndCurrencies";

export const productoPorUnidad = (Valor, Minimo, Entrada, cantidad) => {
  let resultado =
    parseFloat(Entrada) + parseFloat(cantidad) * parseFloat(Valor);
  console.log("Resultado: " + resultado);
  resultado = resultado < parseFloat(Minimo) ? parseFloat(Minimo) : resultado;
  let valorUnitario = roundCents(resultado / cantidad);
  const papyrusExport = `(${Entrada} + (Cab_Cant_Millar * 1000))`;
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
  Entrada,
  cantidad,
  largoPliego,
  breakPoint
) => {
  const currentValue =
    breakPoint[0] && parseFloat(largoPliego) > breakPoint[0]
      ? parseFloat(valor) * parseFloat(1.15)
      : parseFloat(valor);
  let resultado =
    parseFloat(Entrada) +
    parseFloat(largoPliego) * parseFloat(cantidad) * parseFloat(currentValue);
  resultado = resultado < parseFloat(minimo) ? parseFloat(minimo) : resultado;
  let valorUnitario = roundCents(resultado / cantidad);
  const papyrusExport = `${valor} * (${cantidad} * ((${largoPliego}>${breakPoint[0]})?${largoPliego} * 1.15)) * ${largoPliego}`;
  return {
    Unitario: valorUnitario,
    Cantidad: cantidad,
    Total: resultado,
    Papyrus: papyrusExport,
  };
};
