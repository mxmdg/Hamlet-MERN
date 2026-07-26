/*
 * ============================================================================
 *  REGISTRO DE QUERIES DE PAPYRUS
 * ============================================================================
 *
 * Este es el ÚNICO archivo que crece cuando agregás una consulta a Papyrus.
 * No hace falta tocar el controller ni el router.
 *
 * Cada query es una entrada con:
 *   - sql:    función que recibe los params YA VALIDADOS y devuelve el SQL.
 *   - params: (opcional) declaración de qué parámetros espera y cómo validarlos.
 *
 * SEGURIDAD (lo importante):
 *   El frontend nunca manda SQL. Manda un NOMBRE de query y, si hace falta,
 *   params simples ({ ot: 27703 }). El controller valida cada param con el
 *   validador declarado acá, que FUERZA EL TIPO. Recién con los params
 *   saneados se arma el SQL. Aunque alguien mande { ot: "1; DROP TABLE ot" },
 *   el validador lo rechaza o lo reduce a un número antes de tocar el SQL.
 *
 * CÓMO AGREGAR UNA QUERY NUEVA:
 *   1. Copiá una entrada parecida.
 *   2. Poné el SQL en sql().
 *   3. Si tiene params, declaralos con su validador.
 *   Ya está disponible como { query: "tuNombre" }.
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/* Validadores reutilizables                                                   */
/* -------------------------------------------------------------------------- */
/*
 * Cada validador recibe el valor crudo del frontend y devuelve el valor
 * SANEADO y seguro para interpolar. Si el valor no sirve, lanza Error.
 * El controller captura ese Error y responde 400 (no 500).
 */
const validators = {
  // Entero positivo. Para OT, cod_pre, cod_cli numéricos, etc.
  // "27650-DIG-7" -> 27650 (toma lo de antes del primer guión).
  integer: (raw, name) => {
    const n = parseInt(String(raw).split("-")[0], 10);
    if (!Number.isInteger(n) || n <= 0) {
      throw new Error(`El parámetro "${name}" debe ser un número válido.`);
    }
    return n;
  },

  // Fecha en formato YYYY-MM-DD. Rechaza cualquier otra cosa.
  dateISO: (raw, name) => {
    const s = String(raw);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      throw new Error(`El parámetro "${name}" debe tener formato YYYY-MM-DD.`);
    }
    const d = new Date(s);
    if (isNaN(d.getTime())) {
      throw new Error(`El parámetro "${name}" no es una fecha válida.`);
    }
    return s;
  },
};

/* -------------------------------------------------------------------------- */
/* El registro                                                                 */
/* -------------------------------------------------------------------------- */
const queries = {

  /* ======================= POR OT (entero) ================================= */

  // Detalle completo de una OT (la que usa PapyrusCopy). Multi-parte.
  detalleOT: {
    params: { ot: { validate: validators.integer } },
    sql: ({ ot }) => `
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
      WHERE ot.ot = '${ot}'
        AND ent.tipo_entidad = 'CL'
    `,
  },

  // Cabecera de una OT (datos generales + email cliente).
  cabeceraOT: {
    params: { ot: { validate: validators.integer } },
    sql: ({ ot }) => `
      SELECT
        (STRING(ot.ot) + ot.fecha_emision) AS key,
        ot.ot AS nro_ot,
        ot.fecha AS fecha_emision,
        ot.estado AS estado_actual,
        sys_entidades.descripcion AS cliente_nombre,
        ot.observacion AS notas_produccion,
        ot.obs_adicional AS notas_logistica,
        ot.orden_compra AS oc_cliente,
        (SELECT des_ven FROM trve00 WHERE trve00.cod_ven = ot.vendedor) AS vendedor,
        (SELECT email FROM sys_domicilios WHERE entidad = ot.cliente AND tipo_domicilio = 'PR') AS email_cliente
      FROM ot
      INNER JOIN sys_entidades ON (ot.cliente = sys_entidades.entidad AND ot.suc_cliente = sys_entidades.suc_entidad)
      WHERE ot.ot = ${ot}
        AND sys_entidades.tipo_entidad = 'CL'
    `,
  },

  // Vista consolidada de una OT por parte/pliego (la "finalQuery").
  otConsolidada: {
    params: { ot: { validate: validators.integer } },
    sql: ({ ot }) => `
      SELECT
        (STRING(ot.ot) + '-' + STRING(lp.num_tbj)) AS key,
        ot.ot AS nro_ot,
        ot.cod_pre AS presupuesto,
        ot.fecha AS fecha_ot,
        ot.estado AS estado_ot,
        ent.descripcion AS cliente,
        (SELECT FIRST des_ven FROM trve00 WHERE trve00.cod_ven = ot.vendedor) AS vendedor,
        ot.orden_compra,
        lp.num_tbj AS nro_parte,
        lp.des_tbj AS nombre_parte,
        tp.des_tpp AS tipo_producto,
        (cp.mil_pre * 1000) AS tirada_total,
        (SELECT FIRST des_pap FROM trtm00 WHERE cod_pap = lp.cod_pap) AS papel_nombre,
        lp.gra_med AS papel_gramaje,
        (SELECT FIRST des_maq FROM trmq00 WHERE cod_maq = lp.cod_maq) AS maquina_nombre,
        lp.la1_med AS papel_largo,
        lp.la2_med AS papel_ancho,
        lp.clf_tbj AS cant_colores_frente,
        (SELECT FIRST des_tin FROM trti00 WHERE lp.t1f_tbj = cod_tin) AS color_f1,
        (SELECT FIRST des_tin FROM trti00 WHERE lp.t2f_tbj = cod_tin) AS color_f2,
        lp.cld_tbj AS cant_colores_dorso,
        (SELECT FIRST des_tin FROM trti00 WHERE lp.t1d_tbj = cod_tin) AS color_d1,
        (SELECT FIRST des_tin FROM trti00 WHERE lp.t2d_tbj = cod_tin) AS color_d2,
        ot.observacion AS obs_produccion,
        ot.obs_adicional AS obs_logistica,
        (SELECT LIST(des_tbt, ' | ') FROM trlt00 WHERE trlt00.cod_pre = lp.cod_pre AND trlt00.num_tbj = lp.num_tbj) AS procesos_lista,
        (SELECT LIST(STRING(fecha, ': ', cantidad), ' // ') FROM ot_entregas WHERE ot_entregas.ot = ot.ot) AS historial_entregas
      FROM ot
      INNER JOIN sys_entidades ent ON (ot.cliente = ent.entidad AND ot.suc_cliente = ent.suc_entidad)
      INNER JOIN trcp00 cp ON (ot.cod_pre = cp.cod_pre AND ot.ext_pre = cp.ext_pre)
      INNER JOIN trlp00 lp ON (cp.cod_pre = lp.cod_pre AND cp.ext_pre = lp.ext_pre)
      INNER JOIN trtp00 tp ON (cp.cod_tpp = tp.cod_tpp)
      WHERE ot.ot = ${ot}
        AND ent.tipo_entidad = 'CL'
    `,
  },

  /* ======================= POR PRESUPUESTO (entero) ======================== */

  // Detalle de un presupuesto (la "MyQuery").
  detallePresupuesto: {
    params: { codPre: { validate: validators.integer } },
    sql: ({ codPre }) => `
      SELECT
        (STRING(ot.ot) + '-' + otp.descripcion) AS key,
        trcp00.cod_pre AS id_presupuesto,
        trcl00.rso_cli AS cliente,
        trve00.des_ven AS vendedor,
        trtp00.des_tpp AS producto,
        (trcp00.mil_pre * 1000) AS tirada_total,
        trtm00.des_pap AS papel_nombre,
        trlp00.gra_med AS papel_gramaje,
        trcp00.fo1_pre AS ancho_abierto,
        trcp00.fo2_pre AS alto_abierto,
        trcp00.fc1_pre AS ancho_cerrado,
        trcp00.fc2_pre AS alto_cerrado,
        trlp00.clf_tbj AS tintas_frente,
        trlp00.cld_tbj AS tintas_dorso,
        trlp00.pdc_tbj AS papel_cliente,
        trlp00.duc_tbj AS paginas,
        (SELECT STRING(des_tbt, ' | ') FROM trlt00 WHERE trlt00.cod_pre = trcp00.cod_pre) AS procesos
      FROM trcp00
      INNER JOIN trcl00 ON trcp00.cod_cli = trcl00.cod_cli
      INNER JOIN trve00 ON trcp00.cod_ven = trve00.cod_ven
      INNER JOIN trtp00 ON trcp00.cod_tpp = trtp00.cod_tpp
      INNER JOIN trlp00 ON trcp00.cod_pre = trlp00.cod_pre
      INNER JOIN trtm00 ON trlp00.cod_pap = trtm00.cod_pap
      WHERE trcp00.cod_pre = ${codPre}
    `,
  },

  // Procesos de un presupuesto.
  procesosPresupuesto: {
    params: { codPre: { validate: validators.integer } },
    sql: ({ codPre }) => `
      SELECT op.producto, otp.descripcion, op.uni_tbj, op.num_tbj
      FROM otr_presup op
      INNER JOIN otr_productos otp ON op.producto = otp.producto
      WHERE op.cod_pre = ${codPre}
    `,
  },

  // Trabajos de terceros por encima de un cod_pre.
  trabajosTerceros: {
    params: { codPre: { validate: validators.integer } },
    sql: ({ codPre }) => `
      SELECT * FROM ot_trabajos_terceros WHERE cod_pre > '${codPre}'
    `,
  },

  /* ======================= POR FECHA (YYYY-MM-DD) ========================== */

  // Próximas OTs desde una fecha.
  proximasEntregas: {
    params: { desde: { validate: validators.dateISO } },
    sql: ({ desde }) => `
      SELECT * FROM ot WHERE fecha >= '${desde}'
    `,
  },

  // Entregas programadas desde una fecha, con cliente y vendedor.
  entregasDesde: {
    params: { desde: { validate: validators.dateISO } },
    sql: ({ desde }) => `
      SELECT
        ote.fecha AS fecha_entrega_prog,
        ote.cantidad AS cant_a_entregar,
        ot.ot AS nro_ot,
        ot.estado AS estado_ot,
        ot.descripcion AS detalle_trabajo,
        ent.descripcion AS cliente_nombre,
        (SELECT des_ven FROM trve00 WHERE trve00.cod_ven = ot.vendedor) AS vendedor_nombre
      FROM ot_entregas ote
      INNER JOIN ot ON ote.ot = ot.ot
      INNER JOIN sys_entidades ent ON (ot.cliente = ent.entidad AND ot.suc_cliente = ent.suc_entidad)
      WHERE ote.fecha >= '${desde}'
        AND ent.tipo_entidad = 'CL'
      ORDER BY ote.fecha ASC
    `,
  },

  // Procesos por fecha (desde 'desde' hasta 2099-12-31). La grilla principal.
  procesosPorFecha: {
    params: { desde: { validate: validators.dateISO } },
    sql: ({ desde }) => `
      SELECT
        (STRING(ot.ot) + '-' + STRING(otp.producto) + '-' + STRING(part.num_tbj)) AS _id,
        otp.descripcion AS Proceso,
        ot.ot AS Orden,
        ot.estado AS Estado,
        ot.descripcion AS Trabajo,
        part.des_tbj AS Parte,
        part.duc_tbj AS Pags,
        ent.descripcion AS Cliente,
        ven.des_ven AS Vendedor,
        ote.fecha AS Entrega,
        SUM(ote.cantidad) AS Cantidad
      FROM ot_entregas ote
      INNER JOIN ot ON ote.ot = ot.ot
      INNER JOIN sys_entidades ent ON (ot.cliente = ent.entidad AND ot.suc_cliente = ent.suc_entidad)
      INNER JOIN trcp00 presup ON (ot.cod_pre = presup.cod_pre AND ot.ext_pre = presup.ext_pre)
      INNER JOIN otr_presup op ON (presup.cod_pre = op.cod_pre AND presup.ext_pre = op.ext_pre)
      INNER JOIN otr_productos otp ON (op.producto = otp.producto)
      INNER JOIN trve00 ven ON (ot.vendedor = ven.cod_ven)
      INNER JOIN trlp00 part ON (presup.cod_pre = part.cod_pre AND presup.ext_pre = part.ext_pre AND part.num_tbj = op.num_tbj)
      WHERE ote.fecha BETWEEN '${desde}' AND '2099-12-31'
        AND ent.tipo_entidad = 'CL'
        AND presup.cod_con = 'OK'
      GROUP BY
        _id, Proceso, Orden, Estado, Trabajo, Parte, Pags,
        Cliente, Vendedor, Entrega, otp.producto, part.num_tbj
      ORDER BY Orden DESC
    `,
  },

  /* ======================= CLIENTES ======================================== */

  // Todos los clientes (para listados).
  clientes: {
    sql: () => `
      SELECT cod_cli, rso_cli, dir_cli, loc_cli, te1_cli, email FROM trcl00
    `,
  },

  // Un cliente por código.
  cliente: {
    params: { codCli: { validate: validators.integer } },
    sql: ({ codCli }) => `
      SELECT cod_cli, rso_cli, dir_cli, loc_cli, te1_cli, email
      FROM trcl00
      WHERE cod_cli = '${codCli}'
    `,
  },

};

module.exports = { queries, validators };
