
export const JobProperties = [
  {
    value: "Nombre",
    label: "Nombre",
    queryType: "string",
    queryLabel: "Nombre",
  },
  {
    value: "Cantidad",
    label: "Cantidad",
    queryType: "number",
    queryLabel: "Cantidad",
  },
  {
    value: "Tipo.name",
    label: "Tipo de Trabajo",
    queryType: "id",
    queryLabel: "Tipo.name",
  },
  {
    value: "Partes.jobParts._id",
    label: "Tipo de Parte",
    queryType: "id",
    queryLabel: "jobParts.Type",
  },
  {
    value: "Partes",
    label: "Cantidad de Partes",
    queryType: "number",
    queryLabel: "Partes",
  },
  {
    value: "Partes.Name",
    label: "Nombre de Parte",
    queryType: "string",
  },
  {
    value: "Partes.Pages",
    label: "Paginas",
    queryType: "number",
    queryLabel: "Partes Pages",
  },
  {
    value: "Partes.Ancho",
    label: "Ancho",
    queryType: "number",
    queryLabel: "Ancho",
  },
  {
    value: "Partes.Alto",
    label: "Alto",
    queryType: "number",
    queryLabel: "Alto",
  },
  {
    value: "Partes.Formato",
    label: "Formato",
    queryType: "string",
    queryLabel: "Formato",
  },
  {
    value: "Partes.partStock",
    label: "Material de Parte",
    queryType: "id",
    queryLabel:
      "stock.Tipo stock.Gramaje sotck.Marca (stock.Alto_Resma x stock.Alto_Resma)",
  },
  {
    value: "Partes.Finishing",
    label: "Acabado de las partes",
    queryType: "id",
    queryLabel: "finishings.Proceso finishings.Modelo",
  },
  {
    value: "Finishing",
    label: "Acabado del producto",
    queryType: "id",
    queryLabel: "finishings.Proceso finishings.Modelo",
  },
  {
    value: "Owner",
    label: "Representante",
    queryType: "id",
    queryLabel: "users.Name users.LastName",
  },
  {
    value: "Company",
    label: "Cliente",
    queryType: "id",
    queryLabel: "companies.Nombre",
  },
];

export const QuotationProperties = [
  {
    value: "name",
    label: "Nombre",
    queryType: "string",
    queryLabel: "Nombre",
  },
  {
    value: "fecha",
    label: "Fecha",
    queryType: "date",
    queryLabel: "fecha",
  },
  {
    value: "status",
    label: "Estado",
    queryType: "select",
    queryLabel: "status",
    options: ["Pendiente", "Aprobada", "Rechazada"],
  },
  {
    value: "Entrega",
    label: "Fecha de entrega",
    queryType: "date",
    queryLabel: "fechaEntrega",
  },
  {
    value: "jobId.Owner",
    label: "Representante",
    queryType: "id",
    queryLabel: "owner",
  },
  {
    value: "quantity",
    label: "Cantidad",
    queryType: "number",
    queryLabel: "Cantidad",
  },
  {
    value: "index",
    label: "Cotización Número",
    queryType: "number",
    queryLabel: "Indice",
  },
  {
    value: "customerId",
    label: "Cliente",
    queryType: "id",
    queryLabel: "companies.Nombre",
  },
  {
    value: "jobType",
    label: "Tipo de Trabajo",
    queryType: "id",
    queryLabel: "jobType",
  },
  {
    value: "cost",
    label: "Costo",
    queryType: "number",
    queryLabel: "Costo",
  },
  {
    value: "gain",
    label: "Ganancia",
    queryType: "number",
    queryLabel: "Ganancia",
  },
  {
    value: "comission",
    label: "Comisión",
    queryType: "number",
    queryLabel: "Comisión",
  },
  {
    value: "taxes",
    label: "Impuestos",
    queryType: "number",
    queryLabel: "Impuestos",
  },
  {
    value: "total",
    label: "Total",
    queryType: "number",
    queryLabel: "Total",
  },
];
