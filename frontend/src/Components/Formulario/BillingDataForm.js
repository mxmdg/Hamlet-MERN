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



let BillingDataForm = [
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
  },{
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
    type: "SmartMeasure",
    id: "id_010",
    required: true,
    help: "Consulte el manual de la impresora para corroborar la cantidad de impresiones.",
  },
  {
    inputName: "ColorPrints",
    label: "Impresiones Color",
    type: "SmartMeasure",
    id: "id_010",
    required: true,
    help: "Consulte el manual de la impresora para corroborar la cantidad de impresiones.",
  },
  {
    inputName: "BlackPrints",
    label: "Impresiones blanco y negro",
    type: "SmartMeasure",
    id: "id_010",
    required: true,
    help: "Consulte el manual de la impresora para corroborar la cantidad de impresiones.",
  },
  {
    inputName: "LargePrints",
    label: "Impresiones grandes",
    type: "SmartMeasure",
    id: "id_010",
    required: true,
    help: "Consulte el manual de la impresora para corroborar la cantidad de impresiones.",
  },
  {
    inputName: "SmallPrints",
    label: "Impresiones chicas",
    type: "SmartMeasure",
    id: "id_010",
    required: true,
    help: "Consulte el manual de la impresora para corroborar la cantidad de impresiones.",
  },
];

export default BillingDataForm;
