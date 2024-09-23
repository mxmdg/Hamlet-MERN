const dict = [
  { label: "Pedido", id: "name" },
  { label: "Tipo", id: "product" },
  { label: "Cantidad", id: "quantity" },
  { label: "Cliente", id: "customer" },
  { label: "Representante", id: "owner" },
  { label: "Emision", id: "from" },
  { label: "Entrega", id: "to" },
  //{ label: "Terminacon", id: "Finishing" },
];

// Recibe [{label: "Texto a mostrar", id: "propiedad del objeto en la base de datos"}]
export const setHeaders = (labels) => {
  const arr = [];
  labels.map((e) => {
    const obj = {
      id: e.id,
      numeric: false,
      disablePadding: false,
      label: e.label,
    };
    arr.push(obj);
  });
  return arr;
};

export const headers = setHeaders(dict);
