import { databaseURL } from "../../Config/config";

export const roundCents = (value) => {
  return Math.round(value * 100) / 100;
};

export const roundInteger = (value) => {
  return Math.round(value);
};

export const percentBefore = (p1) => {
  const pr1 = 100 - p1;
  const res = (p1 * 100) / pr1;
  return roundCents(res);
};

export const spanishFormat = (value) => {
  try {
    const res = value.toFixed(2); // Ensure two decimal places
    return `${
      res
        .replace(/\./g, ",") // Replace decimal point with a comma
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        .replace(",00", "") // Remove cents if they are zero
    }`; // Add dots as thousands separator
  } catch (error) {
    return value;
  }
};

export const currencyFormat = (value) => {
  const res = spanishFormat(value);
  return `$ ${res}`; // Add dots as thousands separator
};

export const currencyCotization = async (code = "usd") => {
  try {
    const response = await fetch(`${databaseURL}apibcra`, code);

    if (!response.ok) {
      // Es mejor lanzar el error para que el 'catch' lo atrape
      throw new Error(`Error en el servidor: ${response.status}`);
    }
    const data = await response.json();
    //console.log(data);
    return data;
  } catch (error) {
    //console.log(error);
    return error;
  }
};

export const currencyCotizationPerDate = async (code = "usd", date) => {
  try {
    const response = await fetch(`${databaseURL}apibcra-date`, {
      body: JSON.stringify({ code: code, date: date }), // Enviamos el código (ej: "usd")
    });

    const data = await response.json();
    //console.log(data);
    return data;
  } catch (error) {
    //console.log(error);
    return error;
  }
};
