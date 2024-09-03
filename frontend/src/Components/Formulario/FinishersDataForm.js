import JobTypes from "../Jobs/JobTypes";
import { getPrivateElements } from "../customHooks/FetchDataHook";
const costsList = [];
const partsList = [];
let isError = false;
const costos = async () => {
  try {
    const res = await getPrivateElements("Precios");
    const parts = await getPrivateElements("JobParts");
    console.log(res, parts);
    parts.map((pt) =>
      partsList.push({ text: pt.Type, value: pt._id, id: pt._id })
    );
    res.map((item) => {
      if (item.Categoria === "finishing") {
        costsList.push({
          text: `${item.Proceso} ($ ${item.Valor}.-)`,
          value: item._id,
          id: item._id,
        });
      }
    });
    return { precios: res, partes: parts };
  } catch (error) {
    isError = true;
    return error.message;
  }
};

costos();

console.log(costsList);
console.log(partsList);

let FinishersDataForm = [
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
    inputName: "Proceso",
    type: "Text",
    id: "id_003",
    required: true,
  },
  {
    inputName: "X_Minimo",
    label: "Largo Minimo",
    type: "Number",
    id: "id_004",
    required: true,
  },
  {
    inputName: "X_Maximo",
    label: "Largo Maximo",
    type: "Number",
    id: "id_005",
    required: true,
  },
  {
    inputName: "Y_Minimo",
    label: "Ancho Minimo",
    type: "Number",
    id: "id_006",
    required: true,
  },
  {
    inputName: "Y_Maximo",
    label: "Ancho Maximo",
    type: "Number",
    id: "id_007",
    required: true,
  },
  {
    inputName: "Velocidad",
    type: "Number",
    id: "id_008",
    required: true,
  },
  {
    inputName: "Costo",
    type: "Select",
    id: "id_009",
    options: costsList,
    required: true,
  },
  {
    inputName: "Unidad",
    label: "Unidad de medida",
    type: "Select",
    id: "id_010",
    options: [
      { text: "Unidades", value: "un" },
      { text: "Longitud", value: "cm" },
      { text: "Peso", value: "kg" },
      { text: "Superficie", value: "m2" },
    ],
    required: true,
  },
  {
    inputName: "jobTypesAllowed",
    label: "Tipos de trabajos asociados",
    type: "checkbox",
    id: "id_012",
    options: JobTypes.map((jt) => jt.name),
  },
  {
    inputName: "jobPartsAllowed",
    label: "Tipos de Partes asociados",
    type: "checkbox",
    id: "id_011",
    options: partsList.map((pt) => pt),
  },
];

export default FinishersDataForm;
