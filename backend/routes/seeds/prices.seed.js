const pricesSeed = [
  {
    Categoria: "print",
    Proceso: "Impresion Blanco y Negro",
    Valor: 10,
    Minimo: 1500,
    Entrada: 1000,
    status: "activo",
  },
  {
    Categoria: "print",
    Proceso: "Impresion Color",
    Valor: 100,
    Minimo: 2000,
    Entrada: 1500,
    status: "activo",
  },
  {
    Categoria: "stock",
    Proceso: "Papel Obra",
    Valor: 2500,
    Minimo: 0,
    Entrada: 0,
    status: "activo",
  },
  {
    Categoria: "stock",
    Proceso: "Papel Ilustracion",
    Valor: 3500,
    Minimo: 0,
    Entrada: 0,
    status: "activo",
  },
  {
    Categoria: "finishing",
    Proceso: "Corte",
    Valor: 10,
    Minimo: 50,
    Entrada: 0,
    status: "activo",
  },
];

module.exports = pricesSeed;
