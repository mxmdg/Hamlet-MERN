import JobTypes from "../Jobs/JobTypes";

let MoldeJobParts = [
  {
    inputName: "Type",
    label: "Tipo de parte",
    type: "Text",
    id: "id_401",
  },
  {
    inputName: "minWidth",
    label: "Ancho Minimo",
    type: "number",
    step: 1,
    id: "id_402",
  },
  {
    inputName: "maxWidth",
    label: "Ancho Maximo",
    type: "number",
    step: 1,
    id: "id_403",
  },
  {
    inputName: "minHeight",
    label: "Alto Minimo",
    type: "number",
    step: 1,
    id: "id_404",
  },
  {
    inputName: "maxHeight",
    label: "Alto Maximo",
    type: "number",
    step: 1,
    id: "id_405",
  },
  {
    inputName: "minPages",
    label: "Cantidad minima de paginas",
    type: "number",
    step: 1,
    id: "id_406",
  },
  {
    inputName: "maxPages",
    label: "Cantidad maxim de paginas",
    type: "number",
    step: 1,
    id: "id_407",
  },
  {
    inputName: "PrintModAllowed",
    label: "Modo de impresion permitido",
    type: "Select",
    id: "id_408",
    options: [
      { text: "Simplex", value: "Simplex" },
      { text: "Duplex", value: "Duplex" },
    ],
  },
  {
    inputName: "minStockWeight",
    label: "Gramaje minimo",
    type: "number",
    id: "id_409",
  },
  {
    inputName: "maxStockWeight",
    label: "Gramaje maximo",
    type: "number",
    id: "id_410",
  },
  {
    inputName: "jobTypesAllowed",
    label: "Tipos de trabajos asociados",
    type: "checkbox",
    id: "id_411",
    options: JobTypes.map((jt) => jt.name),
  },
];

export default MoldeJobParts;
