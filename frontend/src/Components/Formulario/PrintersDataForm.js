import { getPrivateElements } from "../customHooks/FetchDataHook";
const costsList = [];
const costos = async () => {
  try {
    const res = await getPrivateElements("Precios");
    res.map((item) => {
      if (item.Categoria === "print") {
        costsList.push({
          text: `${item.Proceso} ($ ${item.Valor}.-)`,
          value: item._id,
          id: item._id,
        });
      }
    });
    return res;
  } catch (error) {
    return error.message;
  }
};

costos();

let fabricantesImpresoras = [
  { text: "HP", value: "HP" },
  { text: "Canon", value: "Canon" },
  { text: "Sharp", value: "Sharp" },
  { text: "Konica Minolta", value: "Konica Minolta" },
  { text: "Xerox", value: "Xerox" },
  { text: "Epson", value: "Epson" },
  { text: "Brother", value: "Brother" },
  { text: "Lexmark", value: "Lexmark" },
  { text: "Panasonic", value: "Panasonic" },
  { text: "Samsung", value: "Samsung" },
  { text: "Toshiba", value: "Toshiba" },
  { text: "Ricoh", value: "Ricoh" },
  { text: "Oki", value: "Oki" },
  { text: "Kyocera", value: "Kyocera" },
  { text: "Dell", value: "Dell" },
  { text: "Fuji", value: "Fuji" },
  { text: "Otros", value: "Otros" },
];

let PrintersDataForm = [
  {
    label: "Datos del equipo",
    type: "Divider",
    id: "printerData_div",
    size: 12,
    align: "center",
    orientation: "horizontal",
  },
  {
    inputName: "Modelo",
    type: "Text",
    id: "id_001",
    required: true,
    help: "Consulte el manual de la impresora para verificar el modelo",
  },
  {
    inputName: "SerialNumber",
    label: "Numero de serie",
    type: "Text",
    id: "id_0012",
    required: true,
    help: "Consulte el manual de la impresora para verificar el numero de serie",
  },
  {
    inputName: "Fabricante",
    label: "Marca",
    type: "Select",
    id: "id_002",
    size: { xs: 12, sm: 6, md: 3 },
    required: true,
    help: "Ingrese el nombre del fabricante de la impresora",
    options: fabricantesImpresoras,
  },
  {
    inputName: "Tipo",
    label: "Tipo de impresora",
    type: "Select",
    size: { xs: 12, sm: 6, md: 3 },
    options: [
      { text: "Laser", value: "laser" },
      { text: "Inyección de tinta", value: "inkjet" },
      { text: "Offset", value: "offset" },
      { text: "Ploter", value: "ploter" },
    ],
  },
  {
    inputName: "Colores",
    label: "Tintas",
    type: "Select",
    id: "id_003",
    size: { xs: 12, sm: 6, md: 6 },
    options: [
      { text: "CMYK", value: 4 },
      { text: "B&N", value: 1 },
      { text: "CMYK + Speciales", value: 6 },
    ],
    required: true,
    help: "Seleccione las tintas con las que cuenta su impresora",
  },
  {
    label: "Caracteristicas",
    type: "Divider",
    id: "printerSettings_div",
    size: 12,
    align: "center",
    orientation: "horizontal",
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
    label: "Informacion de facturacion",
    type: "Divider",
    id: "printerBillings_div",
    size: 12,
    align: "center",
    orientation: "horizontal",
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

  {
    inputName: "TotalPrints",
    label: "Impresiones totales",
    type: "Number",
    id: "id_010",
    required: true,
    help: "Consulte el manual de la impresora para corroborar la cantidad de impresiones.",
  },
  {
    inputName: "ColorPrints",
    label: "Impresiones Color",
    type: "Number",
    id: "id_010",
    required: true,
    help: "Consulte el manual de la impresora para corroborar la cantidad de impresiones.",
  },
  {
    inputName: "BlackPrints",
    label: "Impresiones blanco y negro",
    type: "Number",
    id: "id_010",
    required: true,
    help: "Consulte el manual de la impresora para corroborar la cantidad de impresiones.",
  },
  {
    inputName: "LargePrints",
    label: "Impresiones grandes",
    type: "Number",
    id: "id_010",
    required: true,
    help: "Consulte el manual de la impresora para corroborar la cantidad de impresiones.",
  },
  {
    inputName: "SmallPrints",
    label: "Impresiones chicas",
    type: "Number",
    id: "id_010",
    required: true,
    help: "Consulte el manual de la impresora para corroborar la cantidad de impresiones.",
  },
];

export default PrintersDataForm;
