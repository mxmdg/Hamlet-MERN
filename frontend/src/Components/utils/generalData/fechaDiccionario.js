// Convierte una fecha en formato "dd/mm/yyyy" a una cadena ISO 8601 (UTC).
export function convertirFecha(fecha) {
  const partes = fecha.split("/");
  const dia = partes[0];
  const mes = partes[1] - 1; // Los meses en JavaScript comienzan en 0
  const año = partes[2];
  const fechaUTC = new Date(Date.UTC(año, mes, dia));
  return fechaUTC.toISOString();
}

// Devuelve una cadena descriptiva para fechas relativas como "hace 1 día" o "en 1 día".
// Por ejemplo, "hace 1 día" se convierte en "Ayer", y "en 1 día" en "Mañana".
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

// Calcula el número de la semana del año para una fecha dada.
// Devuelve un array con el año y el número de la semana.
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

// Devuelve un objeto con diferentes formatos de una fecha:
// - `ddmmyy`: Fecha en formato "dd/mm/yyyy".
// - `mmyy`: Fecha en formato "mm/yyyy".
// - `ww`: Número de la semana del año.
export const getMyDate = (event) => {
  const dd = new Date(event).getUTCDate();
  const mm = new Date(event).getUTCMonth();
  const yy = new Date(event).getFullYear();
  const ww = getWeekNumber(new Date(event));

  const MiDate = `${dd}/${mm + 1}/${yy}`;
  const MiMont = `${mm + 1}/${yy}`.toString();

  return { ddmmyy: MiDate, mmyy: MiMont, ww };
};

// Formatea una fecha en formato "dd/mm/yyyy" según la configuración regional "es-ES".
export const handleDate = (date) => {
  const fecha = new Date(date);
  const options = { day: "numeric", month: "numeric", year: "numeric" };
  const formattedDate = fecha.toLocaleDateString("es-ES", options);
  return formattedDate;
};

// Procesa una fecha ISO y devuelve una cadena en formato "mm/yyyy".
export function procesarFechaISO(fechaISO) {
  const fecha = new Date(fechaISO);
  const ddmmyyhhmmss = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const mmyy = { month: "numeric", year: "numeric" };
  const fechaFormateada = fecha.toLocaleDateString("es-ES", mmyy);
  const horaFormateada = fecha.toLocaleTimeString("es-ES", ddmmyyhhmmss);
  return `${fechaFormateada}`;
}

// Calcula la cantidad de días entre dos fechas dadas.
// Devuelve un número entero que representa la diferencia en días.
export const calculateDaysBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  console.log(start, end);

  // Calcular la diferencia en milisegundos
  const diffTime = end - start;

  // Convertir la diferencia a días
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  console.log(diffDays);

  return diffDays;
};

/**
 * Extrae la fecha y la hora de una cadena en formato "D:20150812194038+03'00'" o "20150812194038+03'00'".
 * Devuelve un objeto con las propiedades `fecha` y `hora`.
 */
export function getDateAndTime(cadena) {
  
  try {
    const regex1 = /^D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
    const regex2 = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
    const match = cadena.match(regex1) || cadena.match(regex2);

     if (!match) {
        return ({dateAndTime: cadena});
      }

      
      const [_, year, month, day, hour, minute, second] = match;
      const date = `${day}/${month}/${year}`;
      const time = `${hour}:${minute}:${second}`;

      return { date, time, dateAndTime: `${date} ${time}` };
  } catch (error) {
    // Si ocurre un error, devuelve la cadena original
      return ({dateAndTime: cadena});
  }
 
}

export default diccionarioFechas;
