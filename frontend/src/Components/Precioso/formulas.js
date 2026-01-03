import { roundCents } from "../utils/generalData/numbersAndCurrencies";

export const productoPorUnidad = (Valor, Minimo, Entrada, cantidad) => {
  // Agregamos esta funcion porque hay algunos costos que tiene el minimo expresado en cantidad de unidades
  // y otros en valor monetario. Lo vamos a diferenciar si Valor / Entrada es mayor a 1, entonces el costo es por unidad
  // y si es menor a 1, el costo es por valor monetario.

  const unidadEntrada = parseFloat(Valor) / parseFloat(Entrada);

  let resultado =
    unidadEntrada >= 1
      ? (parseFloat(Entrada) + parseFloat(cantidad)) * parseFloat(Valor)
      : parseFloat(Entrada) + parseFloat(cantidad) * parseFloat(Valor);
  //console.log("Resultado x un: " + resultado);
  //console.log(Valor, Minimo, Entrada, cantidad);
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

export const cantidadDeOriginales = (valor, minimo, Entrada, cantidad) => {
  console.log(valor, minimo, Entrada, cantidad);
  let resultado =
    parseFloat(Entrada) + parseFloat(cantidad) * parseFloat(valor);
  resultado = resultado < parseFloat(minimo) ? parseFloat(minimo) : resultado;

  let valorUnitario = roundCents(resultado / cantidad);
  const papyrusExport = `(${Entrada} + (Cab_Cant_Paginas))`;
  return {
    Unitario: valorUnitario,
    Cantidad: cantidad,
    Total: roundCents(resultado),
    Papyrus: papyrusExport,
    Formula: "Originales",
  };
};

export const cantidadDePliegos = (valor, minimo, Entrada, cantidad) => {
  console.log(valor, minimo, Entrada, cantidad);
  let resultado =
    parseFloat(Entrada) + parseFloat(cantidad) * parseFloat(valor);
  resultado = resultado < parseFloat(minimo) ? parseFloat(minimo) : resultado;
  let valorUnitario = roundCents(resultado / cantidad);
  const papyrusExport = `(${Entrada} + (Cab_Cant_Pliegos))`;
  return {
    Unitario: valorUnitario,
    Cantidad: cantidad,
    Total: roundCents(resultado),
    Papyrus: papyrusExport,
    Formula: "Pliegos",
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

  const papyrusExport = `${Math.round(
    Entrada / valor
  )} + Pliegos * if ( Pliego_Largo >  Pliego_Ancho , if( Pliego_Largo > 520/10, Pliego_Largo * 115/100 , Pliego_Largo) , if( Pliego_Ancho > 520/10, Pliego_Ancho * 115/100 , Pliego_Ancho))`;

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

export const costoFijo = (valor) => {
  // Esta funcion es para los costos fijos, que no dependen de la cantidad de unidades
  // y se calcula como el valor del costo mas el minimo y la entrada.
  let resultado = parseFloat(valor);
  let valorUnitario = roundCents(resultado);
  const papyrusExport = `${valor}`;
  return {
    Unitario: valorUnitario,
    Cantidad: 1,
    Total: resultado,
    Papyrus: papyrusExport,
    Formula: "Fijo",
  };
};
