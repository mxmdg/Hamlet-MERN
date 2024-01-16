import JobTypes from "../Jobs/JobTypes";

let MoldeJobParts = [
  {
    inputName: "Type",
    type: "Text",
    id: "id_401",
  },
  {
    inputName: "minWidth",
    type: "number",
    step: 1,
    id: "id_402",
  },
  {
    inputName: "maxWidth",
    type: "number",
    step: 1,
    id: "id_403",
  },
  {
    inputName: "minHeight",
    type: "number",
    step: 1,
    id: "id_404",
  },
  {
    inputName: "maxHeight",
    type: "number",
    step: 1,
    id: "id_405",
  },
  {
    inputName: "minPages",
    type: "number",
    step: 1,
    id: "id_406",
  },
  {
    inputName: "maxPages",
    type: "number",
    step: 1,
    id: "id_407",
  },
  {
    inputName: "PrintModAllowed",
    type: "Select",
    id: "id_408",
    options: [
      { text: "Simplex", value: "Simplex" },
      { text: "Duplex", value: "Duplex" },
    ],
  },
  {
    inputName: "minStockWeight",
    type: "number",
    id: "id_409",
  },
  {
    inputName: "maxStockWeight",
    type: "number",
    id: "id_410",
  },
  {
    inputName: "jobTypesAllowed",
    type: "checkbox",
    id: "id_411",
    options: JobTypes.map((jt) => jt.name),
  },
];

export default MoldeJobParts;
