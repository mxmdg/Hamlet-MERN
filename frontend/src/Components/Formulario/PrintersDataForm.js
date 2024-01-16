let PrintersDataForm = [
  {
    inputName: "Modelo",
    type: "Text",
    id: "id_001",
    required: true,
  },
  {
    inputName: "Fabricante",
    type: "Text",
    id: "id_002",
    required: true,
  },
  {
    inputName: "Colores",
    type: "Select",
    id: "id_003",
    options: [
      { text: "CMYK", value: 4 },
      { text: "B&N", value: 1 },
      { text: "CMYK + Speciales", value: 6 },
    ],
    required: true,
  },
  {
    inputName: "X_Minimo",
    type: "Number",
    id: "id_004",
    required: true,
  },
  {
    inputName: "X_Maximo",
    type: "Number",
    id: "id_005",
    required: true,
  },
  {
    inputName: "Y_Minimo",
    type: "Number",
    id: "id_006",
    required: true,
  },
  {
    inputName: "Y_Maximo",
    type: "Number",
    id: "id_007",
    required: true,
  },
  {
    inputName: "Paginas_por_minuto",
    type: "Number",
    id: "id_008",
    required: true,
  },
  {
    inputName: "Costo_impresion",
    type: "Number",
    id: "id_009",
    required: true,
  },
];

export default PrintersDataForm;
