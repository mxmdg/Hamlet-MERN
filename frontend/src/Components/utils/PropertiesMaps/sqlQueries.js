import { todayDate } from "../generalData/fechaDiccionario"

const hoy = todayDate().yyyymmdd
console.log(hoy)

export const MyQuery = `
SELECT 
    (STRING(ot.ot) + "-" + otp.descripcion) AS key,
    trcp00.cod_pre AS id_presupuesto,
    trcl00.rso_cli AS cliente,
    trve00.des_ven AS vendedor, -- Ahora sí accedemos a la columna de la tabla unida
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
    (SELECT STRING(des_tbt, " | ") FROM trlt00 WHERE trlt00.cod_pre = trcp00.cod_pre) AS procesos
FROM trcp00
INNER JOIN trcl00 ON trcp00.cod_cli = trcl00.cod_cli
INNER JOIN trve00 ON trcp00.cod_ven = trve00.cod_ven -- Unimos por el código de vendedor
INNER JOIN trtp00 ON trcp00.cod_tpp = trtp00.cod_tpp
INNER JOIN trlp00 ON trcp00.cod_pre = trlp00.cod_pre
INNER JOIN trtm00 ON trlp00.cod_pap = trtm00.cod_pap
WHERE trcp00.cod_pre = 6654000
`
export const queryOT = `
SELECT
    (STRING(ot.ot)+ot.fecha_emision) AS key,
    ot.ot AS nro_ot,
    ot.fecha AS fecha_emision,
    ot.estado AS estado_actual,
    sys_entidades.descripcion AS cliente_nombre,
    ot.observacion AS notas_produccion,
    ot.obs_adicional AS notas_logistica,
    ot.orden_compra AS oc_cliente,
    -- Traemos el vendedor con el sub-select que usa Papyrus
    (SELECT des_ven FROM trve00 WHERE trve00.cod_ven = ot.vendedor) AS vendedor,
    -- Traemos el email para avisos automáticos desde Hamlet
    (SELECT email FROM sys_domicilios WHERE entidad = ot.cliente AND tipo_domicilio = "PR") AS email_cliente
FROM ot
INNER JOIN sys_entidades ON ot.cliente = sys_entidades.entidad 
    AND ot.suc_cliente = sys_entidades.suc_entidad
WHERE ot.ot = 26730
  AND sys_entidades.tipo_entidad = "CL"
`
export const queryDetalleOT = (nroOt) => `
    SELECT 
        (STRING(ot.ot) + '-' + STRING(lp.num_tbj)) AS id, -- Key única: OT + Nro de Parte
        ot.ot AS nro_ot,
        ot.descripcion AS Nombre,
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
        -- Procesos en un solo string
        (SELECT STRING(des_tbt, ' | ') FROM trlt00 WHERE trlt00.cod_pre = lp.cod_pre AND trlt00.num_tbt = lp.num_tbj) AS procesos,
        -- Entregas: Aquí es donde se duplica, ojo
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

export const finalQuery = ` 
    SELECT 
    -- 1. IDENTIFICACION Y ESTADO
    (STRING (ot.ot)+ot.cod_pre) AS key,
    ot.ot AS nro_ot,
    ot.cod_pre AS presupuesto,
    ot.fecha AS fecha_ot,
    ot.fecha_Entrega AS ot_entregas,
    ot.estado AS estado_ot,
    ent.descripcion AS cliente,
    (SELECT des_ven FROM trve00 WHERE trve00.cod_ven = ot.vendedor) AS vendedor,
    ot.orden_compra,

    -- 2. ESPECIFICACIONES DE LA PARTE (PLIEGO)
    lp.num_tbj AS nro_parte,
    lp.des_tbj AS nombre_parte,
    tp.des_tpp AS tipo_producto,
    (cp.mil_pre * 1000) AS tirada_total,
    
    -- 3. PAPEL Y MAQUINA
    (SELECT des_pap FROM trtm00 WHERE cod_pap = lp.cod_pap) AS papel_nombre,
    lp.gra_med AS papel_gramaje,
    (SELECT des_maq FROM trmq00 WHERE cod_maq = lp.cod_maq) AS maquina_nombre,
    lp.la1_med AS papel_largo,
    lp.la2_med AS papel_ancho,

    -- 4. TINTAS DETALLADAS (FRENTE Y DORSO)
    lp.clf_tbj AS cant_colores_frente,
    (SELECT des_tin FROM trti00 WHERE lp.t1f_tbj = cod_tin) AS color_f1,
    (SELECT des_tin FROM trti00 WHERE lp.t2f_tbj = cod_tin) AS color_f2,
    (SELECT des_tin FROM trti00 WHERE lp.t3f_tbj = cod_tin) AS color_f3,
    (SELECT des_tin FROM trti00 WHERE lp.t4f_tbj = cod_tin) AS color_f4,
    
    lp.cld_tbj AS cant_colores_dorso,
    (SELECT des_tin FROM trti00 WHERE lp.t1d_tbj = cod_tin) AS color_d1,
    (SELECT des_tin FROM trti00 WHERE lp.t2d_tbj = cod_tin) AS color_d2,
    (SELECT des_tin FROM trti00 WHERE lp.t3d_tbj = cod_tin) AS color_d3,
    (SELECT des_tin FROM trti00 WHERE lp.t4d_tbj = cod_tin) AS color_d4,

    -- 5. OBSERVACIONES CRÍTICAS
    ot.observacion AS obs_produccion,
    ot.obs_adicional AS obs_logistica,

    -- 6. PROCESOS DE TERMINACION (RESUMIDOS)
    (SELECT STRING(des_tbt, ' | ') FROM trlt00 WHERE trlt00.cod_pre = lp.cod_pre) AS procesos_lista,

    -- 7. AGREGAMOS LOS CAMPOS CRUDOS DE ENTREGAS:
    ot_entregas.fecha AS entrega_fecha,
    ot_entregas.cantidad AS entrega_cantidad

FROM ot
-- Usamos alias 'ent', 'cp', 'lp', 'tp' para que sea más corto y claro
INNER JOIN sys_entidades ent ON (ot.cliente = ent.entidad AND ot.suc_cliente = ent.suc_entidad)
INNER JOIN trcp00 cp ON (ot.cod_pre = cp.cod_pre AND ot.ext_pre = cp.ext_pre)
INNER JOIN trlp00 lp ON (cp.cod_pre = lp.cod_pre AND cp.ext_pre = lp.ext_pre)
INNER JOIN trtp00 tp ON (cp.cod_tpp = tp.cod_tpp)

-- ACA ESTA EL ARREGLO:
LEFT JOIN ot_entregas ON (ot_entregas.ot = ot.ot)

WHERE ot.ot = 27703  -- El parámetro que pasamos desde Node.js
  AND ent.tipo_entidad = 'CL'
`

export const queryTrabajosTerceros = `SELECT * FROM ot_trabajos_terceros WHERE cod_pre > '644700' `

export const queryProcesos = ` SELECT op.producto, otp.descripcion, op.uni_tbj, op.num_tbj FROM otr_presup op INNER JOIN otr_productos otp ON op.producto = otp.producto WHERE op.cod_pre = 6447000 `

export const queryProximasEntregas = ` SELECT * FROM ot WHERE fecha >= '2026-03-10'`

export const queryEntrega = ` SELECT 
    
    -- 1. Datos de la Entrega (Desde la tabla de entregas)
    ote.fecha AS fecha_entrega_prog,
    ote.cantidad AS cant_a_entregar,
    
    -- 2. Datos de la Orden (Relacionando por ote.ot)
    ot.ot AS nro_ot,
    ot.estado AS estado_ot,
    ot.descripcion AS detalle_trabajo,
    
    -- 3. Datos del Cliente (Relacionando ot con sys_entidades)
    ent.descripcion AS cliente_nombre,
    
    -- 4. Datos del Vendedor (Relacionando ot con trve00)
    (SELECT des_ven FROM trve00 WHERE trve00.cod_ven = ot.vendedor) AS vendedor_nombre

FROM ot_entregas ote
-- Unimos con la tabla de OTs para saber qué estamos entregando
INNER JOIN ot ON ote.ot = ot.ot
-- Unimos con entidades para saber a quién le entregamos
INNER JOIN sys_entidades ent ON (ot.cliente = ent.entidad AND ot.suc_cliente = ent.suc_entidad)

WHERE ote.fecha >= '2026-03-10'
  AND ent.tipo_entidad = 'CL'
ORDER BY ote.fecha ASC `

export const queryProcesosPorFecha = ` 
SELECT 
    -- Generamos el ID único combinando OT, Producto y el número de parte
    (STRING(ot.ot) + '-' + STRING(otp.producto) + '-' + STRING(part.num_tbj)) AS _id, 
    otp.descripcion AS Proceso,
    ot.ot AS Orden,
    ot.estado AS Estado,
    ot.descripcion AS Trabajo,
    part.des_tbj AS Parte,
    part.duc_tbj AS Pags,
    ent.descripcion AS Cliente,
    ven.des_ven AS Vendedor, -- Aquí usamos el vendedor ya unido
    ote.fecha AS Entrega,
    SUM(ote.cantidad) AS Cantidad 
FROM ot_entregas ote
INNER JOIN ot ON ote.ot = ot.ot
INNER JOIN sys_entidades ent ON (ot.cliente = ent.entidad AND ot.suc_cliente = ent.suc_entidad)
INNER JOIN otr_presup op ON ot.cod_pre = op.cod_pre
INNER JOIN otr_productos otp ON op.producto = otp.producto
-- UNIÓN DEL VENDEDOR:
INNER JOIN trve00 ven ON ot.vendedor = ven.cod_ven
-- UNIÓN DE PARTES:
INNER JOIN trlp00 part ON (ot.cod_pre = part.cod_pre AND ot.ext_pre = part.ext_pre AND part.num_tbj = op.num_tbj)
WHERE ote.fecha BETWEEN '${hoy}' AND '2099-12-31'
  AND ent.tipo_entidad = 'CL'
GROUP BY 
    _id, 
    Proceso, 
    Orden,
    Estado, 
    Trabajo, 
    Parte,
    Pags, 
    Cliente,
    Vendedor, 
    Entrega, 
    otp.producto, 
    part.num_tbj
ORDER BY Entrega ASC`;