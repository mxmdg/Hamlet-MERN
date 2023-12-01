export const Encuadernacion = (valor, minimo, cantidad) => {
  let resultado = valor * (minimo + cantidad);

  console.log(`${valor} * (${minimo} + ${cantidad}) `);
  console.log(`Resultado: ${resultado}`);

  let valorUnitario = resultado / cantidad;
  return { Unitario: valorUnitario, Cantidad: cantidad, Total: resultado };
};

export const Laminado = (valor, minimo, cantidad, largoPliego, duplex) => {
  let resultado =
    valor *
    (cantidad *
      (largoPliego > 520 ? (largoPliego / 10) * 1.15 : largoPliego / 10));
  resultado = resultado < minimo ? minimo : resultado;

  console.log(
    `${valor} * (${cantidad} * ((${largoPliego}>520)?${largoPliego} * 1.15)) * ${largoPliego}`
  );
  console.log(`Resultado: ${resultado}`);

  let valorUnitario = resultado / cantidad;
  return { Unitario: valorUnitario, Cantidad: cantidad, Total: resultado };
};

export const Nuvera = (valor, minimo, cantidad, entrada, largoPliego) => {
  let resultado = entrada + (cantidad / (largoPliego > 355 ? 1 : 1.6)) * valor;
  resultado = resultado < minimo ? minimo : resultado;

  console.log(
    `${entrada} + (${cantidad}*((${largoPliego}>355)?1:(1.6))) * ${valor}`
  );
  console.log(`Resultado: ${resultado}`);

  let valorUnitario = resultado / cantidad;
  return { Unitario: valorUnitario, Cantidad: cantidad, Total: resultado };
};

export const iGenBN = (valor, minimo, cantidad, entrada, largoPliego) => {
  let resultado = entrada + cantidad * (largoPliego > 488 ? 1 : 1.25) * valor;
  resultado = resultado < minimo ? minimo : resultado;

  console.log(
    `${entrada} + (${cantidad}*((${largoPliego}>488)?1:(1.25))) * ${valor}`
  );
  console.log(`Resultado: ${resultado}`);

  let valorUnitario = resultado / cantidad;
  return { Unitario: valorUnitario, Cantidad: cantidad, Total: resultado };
};

export const iGenColor = (valor, minimo, cantidad, entrada, largoPliego) => {
  let resultado = entrada + cantidad * (largoPliego < 488 ? 1 : 1.25) * valor;

  resultado = resultado < minimo ? minimo : resultado;

  console.log(
    `${entrada} + (${cantidad}*((${largoPliego}>488)?1:(1.25))) * ${valor}`
  );
  console.log(`Resultado: ${resultado}`);

  let valorUnitario = resultado / cantidad;
  return { Unitario: valorUnitario, Cantidad: cantidad, Total: resultado };
};
