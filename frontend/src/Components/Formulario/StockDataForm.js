import { getPrivateElements } from "../customHooks/FetchDataHook";
const costsList = [];
const costos = async () => {
  try {
    const res = await getPrivateElements("Precios");
    res.map((item) => {
      if (item.Categoria === "stock") {
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

let PrintersDataForm = [
  {
    label: "Datos del Material",
    type: "Divider",
    id: "stockData_div",
    size: 12,
    align: "center",
    orientation: "horizontal",
  },
  {
    inputName: "Nombre_Material",
    label: "Nombre",
    size: { sm: 12, md: 3 },
    type: "Text",
    id: "id_001",
  },
  {
    inputName: "Marca",
    type: "Select",
    id: "id_002",
    size: { sm: 12, md: 3 },
    options: [
      { text: "Boreal", value: "Boreal" },
      { text: "Chambrill", value: "Chambrill" },
      { text: "Digiart", value: "Digiart" },
      { text: "Ledesma", value: "Ledesma" },
      { text: "Suzanno", value: "Suzanno" },
      { text: "Fasson", value: "Fasson" },
      { text: "Colacril", value: "Colacril" },
      { text: "Otros", value: "Otros" },
    ],
  },
  {
    inputName: "Tipo",
    type: "Select",
    id: "id_004",
    size: { sm: 12, md: 3 },
    options: [
      { text: "Obra", value: "Obra" },
      { text: "Bookcell", value: "Bookcell" },
      { text: "Nat (Reciclado)", value: "Nat" },
      { text: "Ilustracion Mate", value: "Ilustracion Mate" },
      { text: "Ilustracion Brillo", value: "Ilustracion Brillo" },
      { text: "Autoadhesivo Ilustracion", value: "Autoadhesivo Ilustracion" },
      { text: "Autoadhesivo obra", value: "Autoadhesivo obra" },
      { text: "Opp blanco", value: "Opp blanco" },
      { text: "Opp transparente", value: "Opp transparente" },
      { text: "Cartulina", value: "Cartulina" },
      { text: "Comercial", value: "Comercial" },
      { text: "Cartón", value: "Cartón" },
      { text: "Planchas CTP", value: "Planchas CTP" },
      { text: "Otros", value: "Otros" },
    ],
  },
  {
    inputName: "Gramaje",
    type: "SmartMeasure",
    subtype: "weight",
    id: "id_003",
    size: { sm: 12, md: 3 },
  },
  {
    label: "Especificacines del Material",
    type: "Divider",
    id: "stockSpecs_div",
    size: 12,
    align: "center",
    orientation: "horizontal",
  },
  {
    inputName: "Presentacion",
    type: "Select",
    id: "stockPresentacion",
    options: [
      { text: "Bobina", value: "bobina" },
      { text: "Resma", value: "resma" },
    ],
    defaultValue: "resma",
    size: { sm: 12, md: 4 },
  },
  {
    inputName: "Ancho_Resma",
    label: "Ancho del material",
    type: "SmartMeasure",
    subtype: "length",
    size: { sm: 12, md: 4 },
    id: "id_005",
  },
  {
    inputName: "Alto_Resma",
    label: "Largo / Desarrollo",
    type: "SmartMeasure",
    subtype: "length",
    size: { sm: 12, md: 4 },
    id: "id_006",
  },
  {
    inputName: "Espesor_Resma",
    label: "Mano / Calibre (500 hojas)",
    type: "SmartMeasure",
    subtype: "length",
    size: { sm: 12, md: 3 },
    id: "id_007",
  },
  {
    inputName: "Fibra",
    type: "Number",
    size: { sm: 12, md: 3 },
    id: "id_008",
    required: true,
    help: "Ingrese la longitud del lado paralelo a la fibra en milimetros",
  },
  {
    inputName: "Precio_x_Kilo",
    label: "Precio por kilo",
    type: "Select",
    id: "id_009",
    options: costsList,
    required: true,
    size: { sm: 12, md: 3 },
    help: "Seleccione la formula de costos segun el tipo de material",
  },
  {
    inputName: "Color",
    type: "texto",
    size: { sm: 12, md: 3 },
    id: "id_010",
  },
];

export default PrintersDataForm;
