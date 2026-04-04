let MoldePrecios = [
  {
    inputName: "Categoria",
    type: "Select",
    required: true,
    id: "id_400",
    options: [
      { value: "prepress", text: "Pre-Impresion" },
      { value: "print", text: "Impresion" },
      { value: "finishing", text: "Terminación" },
      { value: "stock", text: "Material" },
      { value: "supplies", text: "Insumos" },
      { value: "humanResources", text: "Recursos Humanos" },
    ],
  },

  {
    inputName: "Proceso",
    label: "Descripcion",
    type: "Text",
    id: "id_401",
    required: true,
  },
  {
    inputName: "Valor",
    type: "SmartMeasure",
    step: 0.0001,
    id: "id_402",
    required: true,
  },
  {
    inputName: "Minimo",
    type: "SmartMeasure",
    id: "id_403",
    required: true,
  },
  {
    inputName: "Entrada",
    type: "SmartMeasure",
    id: "id_404",
    required: true,
  },
];

export default MoldePrecios;

/*
'Proceso': {type: String, required: true},
'Valor': {type: Number, required: true},
'Minimo': {type: Number, required: true},
'Entrada': {type: Number, required: false},
'Formula': {type: String, required: true},
'Fecha': {type: Date, default: Date.now, required: false}
*/
