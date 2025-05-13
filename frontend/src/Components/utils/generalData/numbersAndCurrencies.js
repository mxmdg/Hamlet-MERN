export const roundCents = (value) => {
  return Math.round(value * 100) / 100;
};

export const roundInteger = (value) => {
  return Math.round(value);
};

export const percentBefore = (p1) => {
  const pr1 = 100 - p1;
  const res = (p1 * 100) / pr1;
  console.log(pr1, res);
  return roundCents(res);
};

export const spanishFormat = (value) => {
  const res = value.toFixed(2); // Ensure two decimal places
  return `${
    res
      .replace(/\./g, ",") // Replace decimal point with a comma
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      .replace(",00", "") // Remove cents if they are zero
  }`; // Add dots as thousands separator
};

export const currencyFormat = (value) => {
  const res = spanishFormat(value);
  return `$ ${res}`; // Add dots as thousands separator
};

export const currencyCotization = async (code = "usd") => {
  try {
    const response = await fetch(
      `https://api.bcra.gob.ar/estadisticascambiarias/v1.0/Cotizaciones/${code}`
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("Error fetching currency data:", error);
    return error;
  }
};

export const currencyCotizationPerDate = async (code = "usd", date) => {
  try {
    const response = await fetch(
      `https://api.bcra.gob.ar/estadisticascambiarias/v1.0/Cotizaciones/${code}?fechaDesde=${date}fechaHasta=${date}`
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching currency data:", error);
    return null;
  }
};
