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
      { text: "Ilustracion Mate", value: "Ilustracion Mate" },
      { text: "Ilustracion Brillo", value: "Ilustracion Brillo" },
      { text: "Autoadhesivo Ilustracion", value: "Autoadhesivo Ilustracion" },
      { text: "Autoadhesivo obra", value: "Autoadhesivo obra" },
      { text: "Opp blanco", value: "Opp blanco" },
      { text: "Opp transparente", value: "Opp transparente" },
      { text: "Cartulina", value: "Cartulina" },
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
    help: "Ingrese la longitud del lado paralelo a la fibra en milimetros",
  },
  {
    inputName: "Precio_x_Kilo",
    label: "Costo (por kilogramos)",
    type: "Number",
    id: "id_009",
  },
  {
    inputName: "Color",
    type: "texto",
    id: "id_010",
  },
];

export default PrintersDataForm;
