let membershipsDataForm = [
  {
    inputName: "userEmail",
    label: "Email del usuario",
    type: "email",
    id: "id_001",
    help: "El email debe pertenecer a un usuario registrado",
  },
  {
    inputName: "role",
    type: "Select",
    id: "id_003",
    options: [
      { text: "Administrador", value: "admin" },
      { text: "Vendedor", value: "manager" },
      { text: "Operador", value: "operator" },
      { text: "Cliente", value: "customer" },
    ],
  },
  {
    inputName: "status",
    label: "Estado",
    type: "Select",
    id: "id_004",
    options: [
      { text: "Pendiente", value: "pendiente" },
      { text: "Activo", value: "activo" },
      { text: "Inactivo", value: "inactivo" },
      { text: "Revocado", value: "revocado" },
    ],
  },
];

export default membershipsDataForm;
