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

export function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}

export const getMyDate = (event) => {
  const dd = new Date(event).getUTCDate();
  const mm = new Date(event).getUTCMonth();
  const yy = new Date(event).getFullYear();
  const ww = getWeekNumber(new Date(event));

  const MiDate = `${dd}/${mm + 1}/${yy}`;
  const MiMont = `${mm + 1}/${yy}`.toString();

  return { ddmmyy: MiDate, mmyy: MiMont, ww };
};

export const handleDate = (date) => {
  const fecha = new Date(date);
  const options = { day: "numeric", month: "numeric", year: "numeric" };
  const formattedDate = fecha.toLocaleDateString("es-ES", options);
  return formattedDate;
};

export function procesarFechaISO(fechaISO) {
  const fecha = new Date(fechaISO);
  const opciones = { day: "numeric", month: "numeric", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
  const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
  const horaFormateada = fecha.toLocaleTimeString("es-ES", opciones);
  return `${fechaFormateada}`;
}


export default diccionarioFechas;
