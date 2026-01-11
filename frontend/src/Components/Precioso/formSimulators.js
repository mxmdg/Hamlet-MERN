import { roundCents } from "../utils/generalData/numbersAndCurrencies";

export const Encuadernacion = (valor, minimo, cantidad, entrada) => {
  let resultado = Math.max(
    minimo,
    valor * (parseFloat(entrada) + parseFloat(cantidad))
  );

  let valorUnitario = roundCents(resultado / cantidad);
  return {
    Unitario: valorUnitario,
    Cantidad: cantidad,
    Total: roundCents(resultado),
  };
};

export const Laminado = (
  entrada,
  valor,
  minimo,
  cantidad,
  largoPliego,
  duplex
) => {
  let resultado =
    valor *
    (Math.round(entrada / valor) +
      cantidad *
        (parseFloat(largoPliego) > 520
          ? (parseFloat(largoPliego) / 10) * 1.15
          : parseFloat(largoPliego) / 10));
  resultado =
    resultado < parseFloat(minimo) ? parseFloat(minimo) : roundCents(resultado);

  let valorUnitario = roundCents(resultado / cantidad);
  return { Unitario: valorUnitario, Cantidad: cantidad, Total: resultado };
};

export const Nuvera = (valor, minimo, cantidad, entrada, largoPliego) => {
  let resultado =
    parseFloat(entrada) +
    (parseFloat(cantidad) / (parseFloat(largoPliego) > 355 ? 1 : 1.6)) *
      parseFloat(valor);
  resultado = resultado < minimo ? minimo : resultado;

  let valorUnitario = roundCents(resultado / cantidad);
  return { Unitario: valorUnitario, Cantidad: cantidad, Total: resultado };
};

export const iGenBN = (valor, minimo, cantidad, entrada, largoPliego) => {
  let resultado =
    parseFloat(entrada) +
    (parseFloat(cantidad) / (parseFloat(largoPliego) > 488 ? 1 : 1.25)) *
      parseFloat(valor);
  resultado =
    resultado < parseFloat(minimo) ? parseFloat(minimo) : roundCents(resultado);

  let valorUnitario = roundCents(resultado / cantidad);
  return { Unitario: valorUnitario, Cantidad: cantidad, Total: resultado };
};

export const iGenColor = (valor, minimo, cantidad, entrada, largoPliego) => {
  let resultado =
    parseFloat(entrada) +
    (parseFloat(cantidad) / (parseFloat(largoPliego) > 488 ? 1 : 1.4)) *
      parseFloat(valor);

  resultado = resultado < minimo ? minimo : roundCents(resultado);

  let valorUnitario = roundCents(resultado / cantidad);
  return { Unitario: valorUnitario, Cantidad: cantidad, Total: resultado };
};
