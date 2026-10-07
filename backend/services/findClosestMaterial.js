// services/findClosestMaterial.js
"use strict";

/**
 * Normaliza cadenas de texto borrando acentos, mayúsculas y espacios extra
 */
function normalizeText(str) {
  return String(str || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Busca el mejor material disponible en la BD usando un sistema de scoring
 */
function findClosestMaterial(pedido, catalogoBD) {
  const avisos = [];

  if (!catalogoBD || catalogoBD.length === 0) {
    return {
      material: null,
      avisos: ["El catálogo de materiales activos está vacío."],
      candidatos: [],
    };
  }

  // Tomamos los datos del pedido (soportando 'familia' o 'tipo')
  const tipoPedido = normalizeText(pedido.familia || pedido.tipo);
  const gramajePedido = Number(pedido.gramaje);
  const colorPedido = normalizeText(pedido.color);

  // Evaluamos cada material de la BD y le asignamos un puntaje
  const evaluados = catalogoBD.map((mat) => {
    let score = 0;
    const tipoMat = normalizeText(mat.Nombre_Material || mat.Tipo);
    const colorMat = normalizeText(mat.Color);
    const gramajeMat = Number(mat.Gramaje);

    // 1. Similitud por Familia / Tipo (30 puntos si contiene la palabra)
    if (tipoPedido) {
      if (tipoMat.includes(tipoPedido) || tipoPedido.includes(tipoMat)) {
        score += 30;
      }
    }

    // 2. Similitud por Color (10 puntos)
    if (colorPedido && colorMat && (colorMat.includes(colorPedido) || colorPedido.includes(colorMat))) {
      score += 10;
    }

    // 3. Proximidad por Gramaje (Hasta 50 puntos según la diferencia)
    if (Number.isFinite(gramajePedido) && Number.isFinite(gramajeMat)) {
      const diff = Math.abs(gramajePedido - gramajeMat);
      // Cuanto más cerca del gramaje pedido, más cerca de 50 puntos
      const puntosGramaje = Math.max(0, 50 - diff);
      score += puntosGramaje;
    }

    return {
      material: mat,
      score,
      distanciaGramaje: Number.isFinite(gramajePedido) && Number.isFinite(gramajeMat) 
        ? Math.abs(gramajePedido - gramajeMat) 
        : null,
    };
  });

  // Ordenamos de mayor a menor puntaje
  evaluados.sort((a, b) => b.score - a.score);

  const ganador = evaluados[0];

  // Si ni siquiera sumó puntos por tipo/familia, devolvemos un aviso
  if (ganador.score === 0) {
    return {
      material: null,
      avisos: [`No se encontró ningún material similar a "${tipoPedido || 'desconocido'}".`],
      candidatos: evaluados.slice(0, 3).map((e) => e.material),
    };
  }

  // Generar avisos si el gramaje no es exacto
  if (ganador.distanciaGramaje && ganador.distanciaGramaje > 0) {
    avisos.push(
      `Pediste ${gramajePedido}g y el más parecido disponible es ${ganador.material.Gramaje}g (${ganador.material.Nombre_Material}).`
    );
  }

  return {
    material: ganador.material,
    avisos,
    candidatos: evaluados.slice(0, 4).map((e) => ({
      _id: e.material._id,
      Nombre_Material: e.material.Nombre_Material,
      Gramaje: e.material.Gramaje,
      Color: e.material.Color,
      score: e.score,
    })),
  };
}

module.exports = { findClosestMaterial };