// services/catalogResolver.js
const { findClosestMaterial } = require("./findClosestMaterial");
const JobPartModel = require("../models/jobParts").esquema; // Ajustar a tu export de Mongoose

function norm(str) {
  return String(str || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Arma el MENÚ de materiales de la familia pedida, con sus _id reales, para
 * que la IA elija con criterio (ver aiAgent.seleccionarMaterialConCriterio).
 * Devuelve además un "piso" por cercanía numérica (materialDoc) como fallback.
 *
 * CAMBIOS vs versión anterior:
 *  - Devuelve `materialDoc` (documento del material elegido por cercanía), NO
 *    solo el _id. jobBuilder necesita el _id para partStock.
 *  - Devuelve `menu` con {_id, Nombre_Material, Gramaje, Color} para la IA.
 */
async function getMenuMateriales(materialPedido, catalogoMateriales) {
  console.log("[material] pedido:", materialPedido, "| catálogo recibido:", catalogoMateriales?.length);
  const res = findClosestMaterial(materialPedido, catalogoMateriales);
  console.log("[material] elegido:", res.material?.Nombre_Material, "| avisos:", res.avisos);

  const menu = (res.candidatos || []).map((c) => ({
    _id: String(c._id),
    Nombre_Material: c.Nombre_Material,
    Gramaje: c.Gramaje,
    Color: c.Color,
  }));

  return {
    opcionRecomendada: res.material ? String(res.material._id) : null, // _id del piso por cercanía
    materialDoc: res.material || null, // documento completo (tiene _id)
    menu, // lista con _id reales para la IA
    avisos: res.avisos || [],
  };
}

async function getMenuJobParts({ ancho, alto, paginas, gramaje, tipoTrabajo, nombreParte, tenantId }) {
  const query = { status: {$ne:"inactivo"} };
  if (tenantId) query.tenant = tenantId;

  const jobParts = await JobPartModel.find(query).lean();

  const anchoReq = Number(ancho) || 0;
  const altoReq = Number(alto) || 0;
  const paginasReq = Number(paginas) || 1;
  const gramajeReq = Number(gramaje) || 0;
  const tipoTrabajoReq = norm(tipoTrabajo);
  const nombreParteReq = norm(nombreParte);

  // Una parte puede entrar rotada: probamos ancho×alto y alto×ancho.
  const entraPorTamano = (jp) => {
    const dirA = anchoReq >= jp.minWidth && anchoReq <= jp.maxWidth && altoReq >= jp.minHeight && altoReq <= jp.maxHeight;
    const dirB = altoReq >= jp.minWidth && altoReq <= jp.maxWidth && anchoReq >= jp.minHeight && anchoReq <= jp.maxHeight;
    return dirA || dirB;
  };

  const candidatas = jobParts
    .filter((jp) => {
      if (typeof jp.minWidth !== "number") return false;
      const tamanoOk = entraPorTamano(jp);
      const paginasOk = paginasReq >= jp.minPages && paginasReq <= jp.maxPages;
      const gramajeOk = gramajeReq === 0 || (gramajeReq >= jp.minStockWeight && gramajeReq <= jp.maxStockWeight);
      return tamanoOk && paginasOk && gramajeOk;
    })
    .map((jp) => {
      let score = 0;
      const typeNorm = norm(jp.Type);
      if (nombreParteReq && (typeNorm.includes(nombreParteReq) || nombreParteReq.includes(typeNorm))) score += 50;
      if (Array.isArray(jp.jobTypesAllowed) && tipoTrabajoReq) {
        const matcheaTipo = jp.jobTypesAllowed.some((jt) => norm(jt).includes(tipoTrabajoReq) || tipoTrabajoReq.includes(norm(jt)));
        if (matcheaTipo) score += 30;
      }
      if (jp.Type !== "Especial") score += 10;
      return { _id: String(jp._id), doc: jp, score };
    })
    .sort((a, b) => b.score - a.score);

  return {
    docRecomendado: candidatas.length > 0 ? candidatas[0].doc : null,
    opcionRecomendada: candidatas.length > 0 ? candidatas[0]._id : null,
    candidatas,
  };
}

module.exports = { getMenuMateriales, getMenuJobParts };
