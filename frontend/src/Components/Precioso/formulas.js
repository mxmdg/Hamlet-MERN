import { roundCents } from "../utils/generalData/numbersAndCurrencies";

export const productoPorUnidad = (Valor, Minimo, Entrada, cantidad) => {
  // Agregamos esta funcion porque hay algunos costos que tiene el minimo expresado en cantidad de unidades
  // y otros en valor monetario. Lo vamos a diferenciar si Valor / Entrada es mayor a 1, entonces el costo es por unidad
  // y si es menor a 1, el costo es por valor monetario.

  const unidadEntrada = parseFloat(Valor) / parseFloat(Entrada);


  let resultado =
    unidadEntrada >= 1 ? (parseFloat(Entrada) + parseFloat(cantidad) )* parseFloat(Valor) : parseFloat(Entrada) + parseFloat(cantidad) * parseFloat(Valor);
  console.log("Resultado x un: " + resultado);
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
  console.log("Resultado x cm: " + resultado);
  resultado = resultado < parseFloat(minimo) ? parseFloat(minimo) : resultado;
  let valorUnitario = roundCents(resultado / cantidad);
  const papyrusExport = `${valor} * (${cantidad} * ((${largoPliego}>${
    breakPoint / 10 ? breakPoint[0] / 10 : "0"
  })?${largoPliego} * 1.15)) * ${largoPliego}`;

  console.log({
    Unitario: valorUnitario,
    Cantidad: cantidad,
    Total: roundCents(resultado),
    Papyrus: papyrusExport,
    Formula: "Centimetros",
  });
  return {
    Unitario: valorUnitario,
    Cantidad: cantidad,
    Total: roundCents(resultado),
    Papyrus: papyrusExport,
    Formula: "Centimetros",
  };
};
