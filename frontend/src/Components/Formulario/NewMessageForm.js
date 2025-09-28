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

let preferencesForm = [
  {
    inputName: "colorTheme",
    label: "Tema de color",
    type: "Select",
    id: "id_001",
    required: true,
    defaultValue: localStorage.getItem("appTheme") || "light",
    placeHolder: "Seleccione un tema",
    options: [
      { text: "Claro", value: "light" },
      { text: "Oscuro", value: "dark" },
    ],
    help: "Seleccione el color de tema preferido",
  },
];

export default preferencesForm;
