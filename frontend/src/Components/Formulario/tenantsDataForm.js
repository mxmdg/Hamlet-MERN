let MoldeTenants = [
  {
    inputName: "key",
    label: "Identificador de Imprenta",
    type: "Text",
    required: true,
    id: "id_701",
    help: "Ingrese un identificador único para la imprenta, sin espacios ni caracteres especiales.",
  },
  {
    inputName: "name",
    label: "Nombre de Imprenta",
    type: "Text",
    required: true,
    id: "id_702",
    help: "Ingrese la razón social o nombre de la imprenta.",
  },
  {
    inputName: "userName",
    label: "Nombre de Administrador",
    type: "Text",
    id: "id_703",
    help: "Nombre del administrador o contacto principal de la imprenta.",
    required: true,
  },
  {
    inputName: "userLastname",
    label: "Apellido de Administrador",
    type: "Text",
    id: "id_704",
    help: "Apellido del administrador o contacto principal de la imprenta.",
    required: true,
  },
  {
    inputName: "email",
    label: "Correo Electrónico",
    type: "Mail",
    id: "id_705",
    help: "Correo electrónico del administrador de la imprenta.",
    required: true,
  },
  {
    inputName: "password",
    label: "Contraseña",
    type: "password",
    id: "id_706",
    help: "Ingrese la contraseña.",
    required: true,
  },
  {
    inputName: "passwordConfirm",
    label: "Confirmar Contraseña",
    type: "password",
    id: "id_707",
    help: "Confirme la contraseña ingresada.",
    required: true,
  },
];

export default MoldeTenants;

/*
'Proceso': {type: String, required: true},
'Valor': {type: Number, required: true},
'Minimo': {type: Number, required: true},
'Entrada': {type: Number, required: false},
'Formula': {type: String, required: true},
'Fecha': {type: Date, default: Date.now, required: false}
*/
