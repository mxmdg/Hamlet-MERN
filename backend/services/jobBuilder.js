// services/jobBuilder.js
const { getMenuMateriales, getMenuJobParts } = require("./catalogResolver");
const { seleccionarMaterialConCriterio } = require("./aiAgent");

function orientation(x, y) {
  const formato = `${x} x ${y}`;
  let orientacion = "Cuadrado";
  if (x > y) orientacion = "Apaisado";
  else if (y > x) orientacion = "Vertical";
  return { orientacion, formato };
}

async function buildJobDocument({
  extractedData,
  catalogoMateriales,
  companyObjectId,
  ownerObjectId,
  tenantObjectId,
}) {
  const avisosTotales = [];
  const partesEnsambladas = [];

  for (const parteIA of extractedData.Partes) {
    // 1. Armar el MENÚ de materiales de la familia pedida (con _id reales)
    const matRes = await getMenuMateriales(parteIA.materialPedido, catalogoMateriales);
    if (matRes.avisos?.length) avisosTotales.push(...matRes.avisos);

    // 2. Elegir el material: la IA aplica criterio de imprentero sobre el menú.
    //    Si el menú está vacío o la IA falla, caemos al "piso" por cercanía.
    let materialIdElegido = matRes.opcionRecomendada; // fallback por cercanía
    if (matRes.menu && matRes.menu.length > 0) {
      try {
        const sel = await seleccionarMaterialConCriterio({
          producto: `${extractedData.Nombre} - parte ${parteIA.Name}`,
          pedidoCliente: parteIA.materialPedido,
          menuMateriales: matRes.menu,
        });
        // VALIDACIÓN anti-alucinación: el _id elegido DEBE estar en el menú.
        const idsValidos = new Set(matRes.menu.map((m) => String(m._id)));
        if (sel && sel.selected_id && idsValidos.has(String(sel.selected_id))) {
          materialIdElegido = String(sel.selected_id);
        } else {
          avisosTotales.push(
            `La IA eligió un material fuera del menú para "${parteIA.Name}"; se usó el más cercano por gramaje.`
          );
        }
      } catch (e) {
        avisosTotales.push(`No se pudo aplicar criterio de IA al material de "${parteIA.Name}"; se usó el más cercano. (${e.message})`);
      }
    }
    if (!materialIdElegido) {
      avisosTotales.push(`No se encontró material para "${parteIA.Name}". Falta cargarlo o revisar la familia pedida.`);
    }

    // 3. Elegir la regla JobPart (por tamaño/páginas/gramaje). tipoTrabajo real,
    //    NO el nombre del trabajo.
    const jpRes = await getMenuJobParts({
      ancho: parteIA.Ancho,
      alto: parteIA.Alto,
      paginas: parteIA.Pages,
      gramaje: parteIA.materialPedido?.gramaje,
      tipoTrabajo: (extractedData.Tipo && extractedData.Tipo[0] && extractedData.Tipo[0].name) || parteIA.jobPartType,
      nombreParte: parteIA.jobPartType || parteIA.Name,
      tenantId: tenantObjectId,
    });

    // El jobPart va EMBEBIDO como objeto completo, CON su _id real.
    const jp = jpRes.docRecomendado;
    if (!jp) {
      avisosTotales.push(`No se encontró un tipo de parte (jobPart) válido para "${parteIA.Name}" con esas medidas/páginas.`);
    }
    const jobPartEmbeddeado = jp
      ? [
          {
            _id: jp._id,
            jobTypes: jp.jobTypesAllowed || [],
            maxStockWeight: jp.maxStockWeight,
            minStockWeight: jp.minStockWeight,
            Type: jp.Type,
            pageRange: [],
          },
        ]
      : []; // sin jobPart válido -> queda vacío y avisado (no inventamos uno)

    const { orientacion, formato } = orientation(parteIA.Ancho, parteIA.Alto);

    // 4. Estructura exacta de cada Parte en Mongo
    partesEnsambladas.push({
      jobParts: jobPartEmbeddeado,
      Name: parteIA.Name,
      Pages: parteIA.Pages,
      Ancho: parteIA.Ancho,
      Alto: parteIA.Alto,
      ColoresFrente: parteIA.ColoresFrente ?? 0,
      ColoresDorso: parteIA.ColoresDorso ?? 0, // 0 es válido; no convertir a null
      partStock: materialIdElegido || null, // _id del material (ObjectId), NO el doc
      Finishing: [], // TODO: resolver finishers permitidos para esta parte
      RunList: "",
      Orientacion: orientacion,
      Formato: formato,
      ...(tenantObjectId && { tenant: tenantObjectId }),
    });
  }

  // Fecha de entrega (requerida). Si no vino, tentativa a X días.
  const fechaEntrega = new Date();
  fechaEntrega.setDate(fechaEntrega.getDate() + (Number(extractedData.diasEntrega) || 7));

  const jobPayload = {
    Nombre: extractedData.Nombre,
    Tipo: extractedData.Tipo, // OJO: hoy la IA lo inventa. Ver nota al pie.
    Cantidad: extractedData.Cantidad,
    Entrega: fechaEntrega.toISOString(),
    Fecha: new Date().toISOString(),
    Partes: partesEnsambladas,
    Owner: ownerObjectId,
    Company: companyObjectId,
    Finishing: [],
    status: "activo",
    ...(tenantObjectId && { tenant: tenantObjectId }),
  };

  return { jobPayload, avisos: avisosTotales };
}

module.exports = { buildJobDocument };
