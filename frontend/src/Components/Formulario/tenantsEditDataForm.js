let EditTenants = [
  {
    label: "Datos de la Empresa",
    type: "Divider",
    id: "companyData_div",
    size: 12,
    align: "center",
    orientation: "horizontal",
  },
  {
    inputName: "key",
    label: "Identificador de Imprenta",
    type: "Text",
    size: { sm: 12, md: 4 },
    required: true,
    id: "id_701",
    help: "Ingrese un identificador único para la imprenta, sin espacios ni caracteres especiales.",
  },
  {
    inputName: "name",
    label: "Nombre de Imprenta",
    size: { sm: 12, md: 8 },
    type: "Text",
    required: true,
    id: "id_702",
    help: "Ingrese la razón social o nombre de la imprenta.",
  },
    {
        inputName: "status",
        label: "Estado de la Imprenta",
        type: "Select",
        size: { sm: 12, md: 6 },
        required: true,
        id: "id_703",
        help: "Seleccione el estado actual de la imprenta.",
        options: [
            { value: "activo", text: "Activa" },
            { value: "inactivo", text: "Inactiva" },
            { value: "pendiente", text: "Pendiente" },
        ],
    },
    {
        inputName: "plan",
        label: "Plan de la Imprenta",
        type: "Select",
        size: { sm: 12, md: 6 },
        required: true,
        id: "id_704",
        help: "Seleccione el plan actual de la imprenta.",
        options: [
            { value: "trial", text: "Trial" },
            { value: "basic", text: "Básico" },
            { value: "pro", text: "Profesional" }
        ],
    },
];

export default EditTenants;