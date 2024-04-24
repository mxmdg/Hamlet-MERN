import { getPrivateElements } from "../customHooks/FetchDataHook";
const costsList = [];
const costos = async () => {
  try {
    const res = await getPrivateElements("Precios");
    console.log(res);
    res.map((item) => {
      costsList.push({
        text: `${item.Proceso} (${item.valor})`,
        value: item._id,
        id: item._id,
      });
    });
    return res;
  } catch (error) {
    return error.message;
  }
};

costos();

let PrintersDataForm = [
  {
    inputName: "Modelo",
    type: "Text",
    id: "id_001",
    required: true,
    help: "Consulte el manual de la impresora para verificar el modelo",
  },
  {
    inputName: "Fabricante",
    type: "Text",
    id: "id_002",
    required: true,
    help: "Ingrese el nombre del fabricante de la impresora",
  },
  {
    inputName: "Colores",
    label: "Tintas",
    type: "Select",
    id: "id_003",
    options: [
      { text: "CMYK", value: 4 },
      { text: "B&N", value: 1 },
      { text: "CMYK + Speciales", value: 6 },
    ],
    required: true,
    help: "Seleccione las tintas con las que cuenta su impresora",
  },
  {
    inputName: "X_Minimo",
    label: "Largo Minimo",
    type: "Number",
    id: "id_004",
    required: true,
    help: "Consulte el manual de la impresora para verificar el largo minimo que admite su equipo.",
  },
  {
    inputName: "X_Maximo",
    label: "Largo Maximo",
    type: "Number",
    id: "id_005",
    required: true,
    help: "Consulte el manual de la impresora para verificar el largo maximo que admite su equipo.",
  },
  {
    inputName: "Y_Minimo",
    label: "Ancho Minimo",
    type: "Number",
    id: "id_006",
    required: true,
    help: "Consulte el manual de la impresora para verificar el ancho minimo que admite su equipo.",
  },
  {
    inputName: "Y_Maximo",
    label: "Ancho Maximo",
    type: "Number",
    id: "id_007",
    required: true,
    help: "Consulte el manual de la impresora para verificar el ancho maximo que admite su equipo.",
  },
  {
    inputName: "Paginas_por_minuto",
    label: "Paginas por minuto",
    type: "Number",
    id: "id_008",
    required: true,
    help: "Consulte el manual de la impresora para corroborar la cantidad de paginas por minuto que puede imprimir.",
  },
  {
    inputName: "Costo",
    label: "Precio por impresion",
    type: "Select",
    id: "id_009",
    options: costsList,
    required: true,
    help: "Seleccione la formula de costos mas apropiada para su impresora",
  },
];

export default PrintersDataForm;
