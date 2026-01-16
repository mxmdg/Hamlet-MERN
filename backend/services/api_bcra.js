const getCotization = async (req, res, next) => {
  try {
    // 1. Obtenemos el código (ej: 'usd') desde el body o params
    const { code } = req.body;

    // 2. Hacemos la petición (usamos un nombre distinto a 'res', como 'apiRes')
    const apiRes = await fetch(
      `https://api.bcra.gob.ar/estadisticascambiarias/v1.0/Cotizaciones/${code}`
    );

    // 3. ¡Importante! Convertimos la respuesta a JSON
    const data = await apiRes.json();

    // 4. Enviamos los datos reales al frontend
    return res.json(data);
  } catch (error) {
    // Si hay error (ej: el BCRA está caído), pasa al manejador de errores
    next(error);
  }
};

const getCotizationPerDate = async (req, res, next) => {
  try {
    // 1. Obtenemos el código (ej: 'usd') desde el body o params
    const { code, date } = req.body;

    // 2. Hacemos la petición (usamos un nombre distinto a 'res', como 'apiRes')
    const apiRes = await fetch(
      `https://api.bcra.gob.ar/estadisticascambiarias/v1.0/Cotizaciones/${code}?fechaDesde=${date}&fechaHasta=${date}`
    );

    // 3. ¡Importante! Convertimos la respuesta a JSON
    const data = await apiRes.json();

    // 4. Enviamos los datos reales al frontend
    return res.json(data);
  } catch (error) {
    // Si hay error (ej: el BCRA está caído), pasa al manejador de errores
    next(error);
  }
};

module.exports = { getCotization, getCotizationPerDate };
