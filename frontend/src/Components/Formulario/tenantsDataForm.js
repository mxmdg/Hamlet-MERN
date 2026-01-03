let MoldeTenants = [
  {
    inputName: "key",
    type: "Text",
    required: true,
    id: "id_701",
    help: "Ingrese un identificador único para la imprenta, sin espacios ni caracteres especiales.",
  },
  {
    inputName: "name",
    type: "Text",
    required: true,
    id: "id_702",
    help: "Ingrese la razón social o nombre de la imprenta.",
  },
  {
    inputName: "Administrador",
    type: "Text",
    id: "id_703",
    help: "Nombre del administrador o contacto principal de la imprenta.",
    required: true,
  },
  {
    inputName: "email",
    type: "Mail",
    id: "id_704",
    help: "Correo electrónico del administrador de la imprenta.",
    required: true,
  },
  {
    inputName: "Contraseña",
    type: "Password",
    id: "id_705",
    help: "Contraseña para el acceso del administrador a la plataforma.",
    required: true,
  },
  {
    inputName: "Confirmar Contraseña",
    type: "Password",
    id: "id_706",
    help: "Reingrese la contraseña para confirmarla.",
    required: true,
  },
  {
    inputName: "Plan",
    type: "Select",
    default: "Trial",
    id: "id_707",
    options: [
      { value: "trial", text: "Trial" },
      { value: "basic", text: "Basic" },
      { value: "pro", text: "Pro" },
    ],
    required: true,
  },
  {
    inputName: "Herramientas Activadas",
    type: "checkbox",
    id: "id_708",
    options: [
      "Calculadora de lomo",
      "Numerador de páginas",
      "Generador de códigos de barra",
    ],
    help: "Seleccione las herramientas que estarán disponibles para esta imprenta.",
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
