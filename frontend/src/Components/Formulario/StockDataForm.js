let PrintersDataForm = [
  {
    inputName: "Nombre_Material",
    type: "Text",
    id: "id_001",
  },
  {
    inputName: "Marca",
    type: "Text",
    id: "id_002",
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
    ],
  },
  {
    inputName: "Ancho_Resma",
    type: "Number",
    id: "id_005",
  },
  {
    inputName: "Alto_Resma",
    type: "Number",
    id: "id_006",
  },
  {
    inputName: "Espesor_Resma",
    type: "Number",
    id: "id_007",
  },
  {
    inputName: "Fibra",
    type: "Number",
    id: "id_008",
  },
  {
    inputName: "Precio_x_Kilo",
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
