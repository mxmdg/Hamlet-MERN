/* Estas rutas se mudaron a extensions/papyrus */

const axios = require("axios");

// La URL del bridge vive DENTRO del Tenant, en:
//   settings.extensions.papyrusExtractUrl
// (confirmado en models/tenants.js)
const tenants = require("../../models/tenants");

const papyrusControl = {};

/* -------------------------------------------------------------------------- */
/* Helper 1: obtener la URL del bridge para el tenant actual                   */
/* -------------------------------------------------------------------------- */
/*
 * El x-tenant header es el _id del tenant (mismo criterio que el resto
 * de tus controllers). Leemos el Tenant y sacamos la URL del bridge de
 * settings.extensions.papyrusExtractUrl.
 */
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
/* Helper 2: la query, ahora del lado del servidor                            */
/* -------------------------------------------------------------------------- */
/*
 * Es EXACTAMENTE tu queryDetalleOT, movida desde sqlQueries.js.
 * No cambiamos su contenido en este paso: solo la mudamos de lugar.
 * El número de OT se interpola acá, en el server, no en el browser.
 */
const buildQueryDetalleOT = (nroOt) => `
    SELECT 
        (STRING(ot.ot) + '-' + STRING(lp.num_tbj)) AS id,
        ot.ot AS nro_ot,
        ot.descripcion AS Nombre,
        ot.observacion AS Observacion,
        ot.cod_pre AS presupuesto,
        ot.fecha AS Fecha,
        ot.estado AS estado_ot,
        ent.descripcion AS Company,
        ven.des_ven AS Owner,
        ot.orden_compra,
        lp.num_tbj AS nro_parte,
        lp.des_tbj AS nombre_parte,
        lp.duc_tbj AS Paginas,
        lp.me1_uni AS Ancho,
        lp.me2_uni AS Alto,
        tp.des_tpp AS tipo_producto,
        (cp.mil_pre * 1000) AS Cantidad,
        pap.des_pap AS papel_nombre,
        lp.gra_med AS papel_gramaje,
        lp.la1_med AS papel_largo,
        lp.la2_med AS papel_ancho,
        lp.clf_tbj AS colores_frente,
        lp.cld_tbj AS colores_dorso,
        (SELECT LIST(des_tbt, ' | ') FROM trlt00 WHERE trlt00.cod_pre = lp.cod_pre AND trlt00.num_tbt = lp.num_tbj) AS procesos,
        ote.fecha AS entrega_fecha,
        ote.cantidad AS entrega_cantidad
    FROM ot
    INNER JOIN sys_entidades ent ON (ot.cliente = ent.entidad AND ot.suc_cliente = ent.suc_entidad)
    INNER JOIN trcp00 cp ON (ot.cod_pre = cp.cod_pre AND ot.ext_pre = cp.ext_pre)
    INNER JOIN trlp00 lp ON (cp.cod_pre = lp.cod_pre AND cp.ext_pre = lp.ext_pre)
    INNER JOIN trtp00 tp ON (cp.cod_tpp = tp.cod_tpp)
    LEFT JOIN trtm00 pap ON (lp.cod_pap = pap.cod_pap)
    LEFT JOIN trve00 ven ON (ot.vendedor = ven.cod_ven)
    LEFT JOIN ot_entregas ote ON (ot.ot = ote.ot)
    WHERE ot.ot = '${nroOt}'
      AND ent.tipo_entidad = 'CL'
`;

/* -------------------------------------------------------------------------- */
/* Endpoint: traer el detalle de una OT desde Papyrus                          */
/* -------------------------------------------------------------------------- */
/*
 * Antes: el frontend armaba el SQL y se lo mandaba al bridge directo.
 * Ahora: el frontend manda solo { ot: 27703 }. El backend arma el SQL
 * (que nunca sale de acá), le pega al bridge, y devuelve las filas.
 */
papyrusControl.getJobDetail = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");

    // 1. Validar la entrada. Solo aceptamos un número de OT.
    //    Esto es una defensa clave: al forzar que ot sea un entero,
    //    nadie puede colar SQL a través de este parámetro.
    const rawOt = req.body?.ot ?? req.params?.ot;
    const otNumber = parseInt(String(rawOt).split("-")[0], 10);

    if (!Number.isInteger(otNumber) || otNumber <= 0) {
      return res.status(400).json({ message: "Número de OT inválido." });
    }

    // 2. Resolver a qué bridge hablarle según el tenant.
    const bridgeUrl = await getBridgeUrl(tenant);

    // 3. Armar el SQL acá, en el server. El browser nunca lo ve.
    const sql = buildQueryDetalleOT(otNumber);

    // 4. Hablarle al bridge (mismo contrato que usaba el frontend:
    //    POST con { sql } en el body).
    const bridgeResponse = await axios.post(
      bridgeUrl,
      { sql },
      { timeout: 15000 }
    );

    const rows = bridgeResponse.data;

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: "OT no encontrada en Papyrus." });
    }

    // 5. Devolver las filas crudas, igual que las recibía el frontend.
    //    La transformación a "Job de Hamlet" la sigue haciendo React
    //    por ahora; no la movemos en este paso.
    res.json(rows);
  } catch (e) {
    // Si el bridge está caído, damos un error claro en vez de romper feo.
    if (e.code === "ECONNABORTED" || e.code === "ECONNREFUSED") {
      return res.status(502).json({
        message:
          "No se pudo conectar con Papyrus (el bridge del taller no responde).",
      });
    }
    console.error("[papyrusControl.getJobDetail]", e.message);
    next(e);
  }
};

/* -------------------------------------------------------------------------- */
/* Endpoint: traer Clientes desde Papyrus                          */
/* -------------------------------------------------------------------------- */
/*
 * Antes: Buscabamos clientes en la base de datos de Hamlet.
 * Ahora: Agregamos una busqueda de clientes en Papyrus.
 */

papyrusControl.getCustomers = async (req, res, next) => {
   try {
    const tenant = req.header("x-tenant");

    // 1. No hay entrada, vamos a traer todos los clientes.
    const getCustomersData = 'Select cod_cli, rso_cli, dir_cli , loc_cli, te1_cli, email  from trcl00 ';

    // 2. Resolver a qué bridge hablarle según el tenant.
    const bridgeUrl = await getBridgeUrl(tenant);

    // 3. Hablarle al bridge (mismo contrato que usaba el frontend:
    //    POST con { sql } en el body).
    const bridgeResponse = await axios.post(
      getCustomersData,
      { sql },
      { timeout: 15000 }
    );

    const customers = bridgeResponse.data;

    return customers
} catch (e) {
  // Si el bridge está caído, damos un error claro en vez de romper feo.
    if (e.code === "ECONNABORTED" || e.code === "ECONNREFUSED") {
      return res.status(502).json({
        message:
          "No se pudo conectar con Papyrus (el bridge del taller no responde).",
      });
    }
    console.error("[papyrusControl.getJobDetail]", e.message);
    next(e);
}
};

module.exports = papyrusControl;
