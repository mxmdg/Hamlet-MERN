import JobTypes from "../Jobs/JobTypes";
import { productoPorUnidad, pliegoPorLongitud } from "../Precioso/formulas";

let FormulaTestForm = [
  {
    inputName: "Formula",
    label: "Formula",
    type: "Select",
    options: [
      {
        text: "Producto por unidad",
        value: "productoPorUnidad",
      },
      {
        text: "Centimetros lineales",
        value: "pliegoPorLongitud",
      },
    ],
    id: "id_401",
  },
  {
    inputName: "Valor",
    label: "Valor del proceso",
    type: "Number",
    step: 0.0001,
    id: "id_401",
    required: true,
  },
  {
    inputName: "Minimo",
    type: "Number",
    id: "id_402",
    required: true,
  },
  {
    inputName: "Entrada",
    type: "Number",
    id: "id_403",
    required: true,
  },
  {
    inputName: "Longitud",
    label: "Largo en mm",
    type: "Number",
    id: "id_404",
    required: false,
  },
  {
    inputName: "firstBreakpoint",
    label: "Breakpoint 1",
    type: "number",
    step: 1,
    id: "id_405",
    required: false,
  },
  {
    inputName: "secondBreakpoint",
    label: "Breakpoint 2",
    type: "number",
    step: 1,
    id: "id_406",
    required: false,
  },
  {
    inputName: "minRange",
    label: "Cantidad minima",
    type: "number",
    step: 1,
    id: "id_407",
    required: true,
  },
  {
    inputName: "maxRange",
    label: "Cantidad maxima",
    type: "number",
    step: 1,
    id: "id_408",
    required: true,
  },
  {
    inputName: "stepRange",
    label: "Pasos",
    type: "number",
    id: "id_409",
    required: true,
  },
];

export default FormulaTestForm;
