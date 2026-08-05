const axios = require("axios");
const tenants = require("../../models/tenants");

/*
 * ============================================================================
 *  CONTROLLER DE PAPYRUS — versión simplificada post-migración
 * ============================================================================
 *
 * Ya NO arma SQL ni conoce el registro de queries — eso ahora vive en el
 * bridge (papyrusQueries.js del lado del taller), que es quien realmente
 * decide qué se puede correr contra Papyrus.
 *
 * Este archivo solo:
 *   1. Resuelve la URL del bridge para el tenant.
 *   2. Reenvía { queryName, params } + el secreto compartido.
 *   3. Traduce errores de red/bridge a respuestas HTTP razonables.
 *
 * papyrusQueries.js YA NO EXISTE de este lado — se puede borrar. Si
 * necesitás dar feedback más rápido al frontend antes de pegarle al
 * bridge (por ejemplo, validar que queryName no venga vacío), es la
 * única validación liviana que queda acá.
 * ============================================================================
 */

const papyrusControl = {};

class PapyrusError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "PapyrusError";
    this.statusCode = statusCode;
  }
}

const getBridgeUrl = async (tenant) => {
  const doc = await tenants.esquema.findOne({ _id: tenant });
  const url = doc?.settings?.extensions?.papyrusExtractUrl;
  if (!url) {
    throw new Error(
      "Este tenant no tiene configurada la URL de Papyrus (settings.extensions.papyrusExtractUrl).",
    );
  }
  return url;
};

const executeQuery = async ({ tenant, userId, queryName, incomingParams = {} }) => {
  if (!queryName || typeof queryName !== "string") {
    throw new PapyrusError("Falta el nombre de la query.", 400);
  }

  const secret = process.env.PAPYRUS_BRIDGE_SECRET;
  if (!secret) {
    throw new PapyrusError(
      "PAPYRUS_BRIDGE_SECRET no está configurado en el backend de Hamlet.",
      500,
    );
  }

  const bridgeUrl = await getBridgeUrl(tenant);

  // El endpoint del bridge cambió de /extract a /query — actualizar la
  // URL guardada en el tenant si todavía apunta a la ruta vieja.
  const bridgeResponse = await axios.post(
    bridgeUrl,
    { queryName, params: incomingParams, tenant, userId },
    {
      headers: { "x-bridge-secret": secret },
      timeout: 25000, // un poco más que el timeout interno del bridge (20s)
    },
  );

  const rows = bridgeResponse.data;

  if (!Array.isArray(rows)) {
    throw new PapyrusError("Respuesta inesperada de Papyrus.", 502);
  }

  return rows;
};

papyrusControl.executeQuery = executeQuery;

papyrusControl.runQuery = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const userId = req.user?.userId;
    const { query: queryName, params: incomingParams } = req.body || {};
    const rows = await executeQuery({ tenant, userId, queryName, incomingParams });
    return res.json(rows);
  } catch (e) {
    if (e.response?.status === 403) {
      return res.status(502).json({
        message: "El bridge rechazó la conexión (secreto inválido o desactualizado).",
      });
    }
    if (e.code === "ECONNABORTED" || e.code === "ECONNREFUSED") {
      return res.status(502).json({
        message: "No se pudo conectar con Papyrus (el bridge del taller no responde).",
      });
    }
    if (e instanceof PapyrusError) {
      return res.status(e.statusCode).json({ message: e.message });
    }
    console.error("[papyrusControl.runQuery]", e.message);
    next(e);
  }
};

module.exports = papyrusControl;