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
