import { getPrivateElements } from "../customHooks/FetchDataHook";
const usersList = [];
const users = async () => {
  try {
    const res = await getPrivateElements("users");
    //console.log(res);
    res.map((item) => {
      usersList.push({
        text: item.Name + " " + item.LastName,
        value: item._id,
      });
    });
    return res;
  } catch (error) {
    return error.message;
  }
};

users();

let NewMessageForm = [
  {
    inputName: "Product",
    type: "Text",
    help: "Producto",
    id: "id_001",
  },
  {
    inputName: "Cocinero",
    type: "Select",
    id: "id_002",
    help: "Seleccione el cocinero",
    options: usersList,
  },
  {
    inputName: "Receta",
    type: "Text",
    multiline: true,
    id: "id_003",
    help: "Receta",
  },
  {
    inputName: "Temperatura Horno",
    type: "Number",
    multiline: true,
    required: true,
    id: "id_005",
  },
  {
    inputName: "Tiempo Coccion",
    type: "Time",
    id: "id_006",
  },
  {
    inputName: "Ingredientes",
    label: "Ingredientes",
    type: "checkbox",
    id: "id_006",
    options: [
      "Harina",
      "Sal",
      "Levadura",
      "Dulce de Leche",
      "Dulce de Membrillo",
      "Pastelera",
      "Leche",
    ],
  },
];

export default NewMessageForm;
