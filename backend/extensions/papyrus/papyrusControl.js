const axios = require("axios");
const tenants = require("../../models/tenants");
const { queries } = require("./papyrusQueries");

/*
 * ============================================================================
 *  CONTROLLER DE PAPYRUS (la maquinaria)
 * ============================================================================
 *
 * Este archivo casi nunca se toca. No sabe nada de ninguna query en
 * particular: toma el NOMBRE que mandó el frontend, busca la entrada en el
 * registro (papyrusQueries.js), valida los params con los validadores que
 * esa entrada declara, arma el SQL y se lo manda al bridge.
 *
 * Agregar una query nueva = agregar una entrada en papyrusQueries.js.
 * Acá no hay que tocar nada.
 * ============================================================================
 */

const papyrusControl = {};

/* -------------------------------------------------------------------------- */
/* Helper: URL del bridge para el tenant actual                                */
/* -------------------------------------------------------------------------- */
// El x-tenant header es el _id del tenant. La URL vive en el Tenant, en
// settings.extensions.papyrusExtractUrl (ver models/tenants.js).
const getBridgeUrl = async (tenant) => {
  const doc = await tenants.esquema.findOne({ _id: tenant });
  const url = doc?.settings?.extensions?.papyrusExtractUrl;
  if (!url) {
    throw new Error(
      "Este tenant no tiene configurada la URL de Papyrus (settings.extensions.papyrusExtractUrl)."
    );
  }
  return url;
};

/* -------------------------------------------------------------------------- */
/* Helper: validar y sanear los params de una query                            */
/* -------------------------------------------------------------------------- */
/*
 * Recorre los params que la query DECLARA, corre el validador de cada uno
 * contra lo que mandó el frontend, y devuelve un objeto con los valores
 * saneados. Si falta un param o no valida, lanza Error (el handler lo
 * convierte en 400).
 *
 * Solo se procesan los params declarados: cualquier cosa extra que mande
 * el frontend se ignora. No hay forma de inyectar params no previstos.
 */
const validateParams = (queryDef, incoming = {}) => {
  const clean = {};
  const declared = queryDef.params || {};

  for (const [name, rule] of Object.entries(declared)) {
    const rawValue = incoming[name];
    if (rawValue === undefined || rawValue === null || rawValue === "") {
      throw new Error(`Falta el parámetro requerido "${name}".`);
    }
    // El validador sanea y devuelve el valor seguro (o lanza Error).
    clean[name] = rule.validate(rawValue, name);
  }

  return clean;
};

/* -------------------------------------------------------------------------- */
/* Endpoint único: ejecutar una query con nombre                               */
/* -------------------------------------------------------------------------- */
/*
 * El frontend manda:
 *   { query: "detalleOT", params: { ot: 27703 } }
 *   { query: "clientes" }                        // sin params
 *
 * Nunca manda SQL.
 */
papyrusControl.runQuery = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const { query: queryName, params: incomingParams } = req.body || {};

    // 1. La query pedida tiene que existir en el registro (whitelist).
    //    Si el nombre no está, se rechaza. Esto es la "whitelist de queries":
    //    solo se pueden correr consultas conocidas.
    if (!queryName || !queries[queryName]) {
      return res.status(400).json({
        message: `Query no reconocida: "${queryName}".`,
      });
    }

    const queryDef = queries[queryName];

    // 2. Validar y sanear los params declarados por esa query.
    //    Acá se corta cualquier intento de inyección: los valores se
    //    fuerzan a su tipo antes de tocar el SQL.
    let cleanParams;
    try {
      cleanParams = validateParams(queryDef, incomingParams);
    } catch (validationError) {
      return res.status(400).json({ message: validationError.message });
    }

    // 3. Armar el SQL con los params ya saneados. El browser nunca ve esto.
    const sql = queryDef.sql(cleanParams);

    // 4. Resolver el bridge del tenant y mandarle la consulta.
    const bridgeUrl = await getBridgeUrl(tenant);
    const bridgeResponse = await axios.post(
      bridgeUrl,
      { sql },
      { timeout: 15000 }
    );

    const rows = bridgeResponse.data;

    if (!Array.isArray(rows)) {
      // El bridge devolvió algo raro (no un array de filas).
      return res.status(502).json({
        message: "Respuesta inesperada de Papyrus.",
      });
    }

    // 5. Devolver las filas crudas. La transformación a objetos de Hamlet
    //    la hace el frontend (por ahora).
    res.json(rows);
  } catch (e) {
    if (e.code === "ECONNABORTED" || e.code === "ECONNREFUSED") {
      return res.status(502).json({
        message:
          "No se pudo conectar con Papyrus (el bridge del taller no responde).",
      });
    }
    console.error("[papyrusControl.runQuery]", e.message);
    next(e);
  }
};

module.exports = papyrusControl;
