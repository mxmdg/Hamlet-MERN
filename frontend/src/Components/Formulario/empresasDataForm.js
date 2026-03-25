import provinciasArgentinas from "../utils/generalData/provinciasArgentinas";

let MoldeEmpresas = [
  {
    label: "Datos del cliente",
    type: "Divider",
    id: "customerData_div",
    size: 12,
    align: "center",
    orientation: "horizontal",
  },
  {
    inputName: "Nombre",
    type: "Text",
    id: "id_701",
  },
  {
    inputName: "email",
    label: "Correo electronico",
    type: "email",
    id: "id_702",
  },
  {
    inputName: "Telefono",
    type: "Text",
    id: "id_708",
  },
  {
    label: "Direccion",
    type: "Divider",
    id: "address_div",
    size: 12,
    align: "center",
    orientation: "horizontal",
  },
  {
    inputName: "Calle",
    type: "Text",
    id: "id_703",
  },
  {
    inputName: "Ciudad",
    type: "Text",
    id: "id_704",
  },
  {
    inputName: "Codigo_Postal",
    label: "C.P.",
    type: "Text",
    id: "id_705",
  },
  {
    inputName: "Provincia",
    type: "Select",
    id: "id_706",
    options: provinciasArgentinas,
  },
  {
    inputName: "Pais",
    type: "Text",
    default: "Argentina",
    id: "id_707",
  },
];

export default MoldeEmpresas;

/*
'Proceso': {type: String, required: true},
'Valor': {type: Number, required: true},
'Minimo': {type: Number, required: true},
'Entrada': {type: Number, required: false},
'Formula': {type: String, required: true},
'Fecha': {type: Date, default: Date.now, required: false}
*/
