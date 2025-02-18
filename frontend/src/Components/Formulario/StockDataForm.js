import { getPrivateElements } from "../customHooks/FetchDataHook";
const costsList = [];
const costos = async () => {
  try {
    const res = await getPrivateElements("Precios");
    console.log(res);
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
    inputName: "Nombre_Material",
    label: "Nombre",
    type: "Text",
    id: "id_001",
  },
  {
    inputName: "Marca",
    type: "Select",
    id: "id_002",
    options: [
      { text: "Boreal", value: "Boreal" },
      { text: "Chambrill", value: "Chambrill" },
      { text: "Digiart", value: "Digiart" },
      { text: "Ledesma", value: "Ledesma" },
      { text: "Suzanno", value: "Suzanno" },
      { text: "Fasson", value: "Fasson" },
      { text: "Colacril", value: "Colacril" },
    ],
  },
  {
    inputName: "Gramaje",
    type: "Number",
    id: "id_003",
  },
  {
    inputName: "Tipo",
    type: "Select",
    id: "id_004",
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
    ],
  },
  {
    inputName: "Ancho_Resma",
    label: "Ancho de la resma",
    type: "Number",
    id: "id_005",
  },
  {
    inputName: "Alto_Resma",
    label: "Alto de la resma",
    type: "Number",
    id: "id_006",
  },
  {
    inputName: "Espesor_Resma",
    label: "Espesor de la resma",
    type: "Number",
    id: "id_007",
  },
  {
    inputName: "Fibra",
    type: "Number",
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
    help: "Seleccione la formula de costos segun el tipo de material",
  },
  {
    inputName: "Color",
    type: "texto",
    id: "id_010",
  },
];

export default PrintersDataForm;
