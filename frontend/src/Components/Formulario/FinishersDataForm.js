import { getPrivateElements } from "../customHooks/FetchDataHook";
const costsList = [];
const costos = async () => {
  try {
    const res = await getPrivateElements("Precios");
    console.log(res);
    res.map((item) => {
      costsList.push({
        text: `${item.Proceso} ($ ${item.Valor}.-)`,
        value: item._id,
        id: item._id,
      });
    });
    return res;
  } catch (error) {
    return error.message;
  }
};

costos();

console.log(costsList);

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
    type: "String",
    id: "id_010",
    required: true,
  },
];

export default FinishersDataForm;
