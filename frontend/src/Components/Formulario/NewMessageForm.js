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
    inputName: "From",
    type: "Text",
    help: "Ingrese su nombre",
    id: "id_001",
  },
  {
    inputName: "To",
    type: "Select",
    id: "id_002",
    help: "Seleccione el destinatario",
    options: usersList,
  },
  {
    inputName: "Subject",
    type: "Text",
    id: "id_003",
    help: "Ingrese el asunto del mensaje",
  },
  {
    inputName: "Message",
    type: "Text",
    multiline: true,
    required: true,
    id: "id_005",
  },
  {
    inputName: "CellPhone",
    type: "Text",
    id: "id_006",
  },
  {
    inputName: "Intrests",
    label: "Intereses",
    type: "checkbox",
    id: "id_006",
    options: ["Deportes", "Musica", "Cine", "Lectura", "Viajes"],
  },
];

export default NewMessageForm;
