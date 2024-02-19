let UsersDataForm = [
  {
    inputName: "Name",
    type: "Text",
    id: "id_001",
  },
  {
    inputName: "LastName",
    type: "Text",
    id: "id_002",
  },
  {
    inputName: "Role",
    type: "Select",
    id: "id_003",
    options: [
      { text: "Administrador", value: "Admin" },
      { text: "Vendedor", value: "Manager" },
      { text: "Operador", value: "Operator" },
      { text: "Cliente", value: "Customer" },
    ],
  },
  {
    inputName: "E-mail",
    type: "email",
    id: "id_005",
  },
  {
    inputName: "Password",
    type: "password",
    id: "id_006",
  },
];

export default UsersDataForm;
