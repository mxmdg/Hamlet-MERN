import { roundCents } from "../utils/generalData/numbersAndCurrencies";

export const productoPorUnidad = (price, cantidad) => {
  const { Valor, Minimo, Entrada } = price;
  console.log(price, cantidad, Valor, Minimo, Entrada);
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
  cantidad,
  Entrada,
  largoPliego,
  breakPoint
) => {
  const currentValue =
    breakPoint && parseFloat(largoPliego) > breakPoint
      ? parseFloat(valor) * parseFloat(1.15)
      : parseFloat(valor);
  let resultado =
    parseFloat(Entrada) +
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
