export function convertirFecha(fecha) {
  const partes = fecha.split("/");
  const dia = partes[0];
  const mes = partes[1] - 1; // Los meses en JavaScript comienzan en 0
  const año = partes[2];
  const fechaUTC = new Date(Date.UTC(año, mes, dia));
  return fechaUTC.toISOString();
}

const diccionarioFechas = (cadena) => {
  switch (cadena) {
    case "en 1 día":
      return "Mañana";
      break;
    case "hace 1 día":
      return "Ayer";
      break;
    default:
      if (
        cadena.includes("hora") ||
        cadena.includes("minuto") ||
        cadena.includes("segundo")
      ) {
        return "Hoy";
      } else {
        return cadena;
      }
      break;
  }
};

export default diccionarioFechas;
