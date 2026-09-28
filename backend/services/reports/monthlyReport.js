const quotations = require("../../models/quotations");
const Users = require("../../models/usersSchema");

/*
 * Reporte mensual de cotizaciones.
 * Compara un mes contra el mes anterior y contra el mismo mes del año pasado.
 *
 * Reglas de esta primera versión:
 * - Cuenta todas las cotizaciones del período, sin filtrar por estado
 *   y sin sacar duplicados.
 * - Neto = total - taxes (así no se mezcla IVA de venta con IVA trasladado).
 */

// Argentina es UTC-3 fijo (no hay horario de verano).
// Devuelve la medianoche argentina del día 1 del mes, expresada en UTC.
// Date.UTC acomoda meses fuera de rango: (2026, -1) es diciembre 2025.
const inicioDeMes = (anio, mes) => new Date(Date.UTC(anio, mes, 1, 3));

// Rango [desde, hasta) de un mes. mes: 0 = enero
const rangoDeMes = (anio, mes) => ({
  desde: inicioDeMes(anio, mes),
  hasta: inicioDeMes(anio, mes + 1),
});

// "2026-09" -> { anio: 2026, mes: 8 }. Devuelve null si el formato no es válido.
const parsePeriodo = (periodo) => {
  const match = /^(\d{4})-(\d{2})$/.exec(periodo || "");
  if (!match) return null;

  const anio = Number(match[1]);
  const mes = Number(match[2]) - 1;
  if (mes < 0 || mes > 11) return null;

  return { anio, mes };
};

// Algunos valores vienen guardados como string ("45"): se convierten antes de sumar
const num = (valor) => Number(valor) || 0;

const redondear = (valor) => Math.round(valor * 100) / 100;

const netoDe = (q) => num(q.total) - num(q.taxes);

// Variación % de actual respecto de base. null si base es 0 (no hay contra qué comparar)
const variacion = (actual, base) =>
  base ? redondear(((actual - base) / base) * 100) : null;

const vendedorDe = (q) => ({
  id: q.owner?._id ? String(q.owner._id) : "sin-vendedor",
  nombre: q.owner
    ? `${q.owner.Name || ""} ${q.owner.LastName || ""}`.trim() || "Sin vendedor"
    : "Sin vendedor",
});

const tipoDe = (q) => ({
  id: q.jobType || "sin-tipo",
  nombre: q.jobType || "Sin tipo",
});

// Agrupa las cotizaciones según obtenerGrupo y acumula cantidad y neto.
// Se agrupa por id (no por nombre) para no mezclar dos vendedores con el mismo nombre.
const agrupar = (cotizaciones, obtenerGrupo) => {
  const grupos = {};

  cotizaciones.forEach((q) => {
    const { id, nombre } = obtenerGrupo(q);
    if (!grupos[id]) grupos[id] = { nombre, cantidad: 0, neto: 0 };
    grupos[id].cantidad += 1;
    grupos[id].neto += netoDe(q);
  });

  // De mayor a menor neto
  return Object.values(grupos)
    .map((g) => ({ ...g, neto: redondear(g.neto) }))
    .sort((a, b) => b.neto - a.neto);
};

const calcularMetricas = (cotizaciones, rango) => ({
  desde: rango.desde,
  hasta: rango.hasta,
  cantidad: cotizaciones.length,
  neto: redondear(cotizaciones.reduce((suma, q) => suma + netoDe(q), 0)),
  porVendedor: agrupar(cotizaciones, vendedorDe),
  porTipo: agrupar(cotizaciones, tipoDe),
});

// Solo los campos que usa el reporte: sin impositionData, la respuesta pesa poco
const traerCotizaciones = (tenant, rango) =>
  quotations.esquema
    .find({ tenant, fecha: { $gte: rango.desde, $lt: rango.hasta } })
    .select("total taxes owner jobType")
    .populate({ path: "owner", model: Users.esquema, select: "Name LastName" })
    .lean();

const generarReporteMensual = async (tenant, anio, mes) => {
  const rangos = {
    actual: rangoDeMes(anio, mes),
    mesAnterior: rangoDeMes(anio, mes - 1),
    anioAnterior: rangoDeMes(anio - 1, mes),
  };

  const [actual, mesAnterior, anioAnterior] = await Promise.all([
    traerCotizaciones(tenant, rangos.actual),
    traerCotizaciones(tenant, rangos.mesAnterior),
    traerCotizaciones(tenant, rangos.anioAnterior),
  ]);

  const reporte = {
    periodo: `${anio}-${String(mes + 1).padStart(2, "0")}`,
    actual: calcularMetricas(actual, rangos.actual),
    mesAnterior: calcularMetricas(mesAnterior, rangos.mesAnterior),
    anioAnterior: calcularMetricas(anioAnterior, rangos.anioAnterior),
  };

  reporte.variacion = {
    mesAnterior: {
      cantidad: variacion(reporte.actual.cantidad, reporte.mesAnterior.cantidad),
      neto: variacion(reporte.actual.neto, reporte.mesAnterior.neto),
    },
    anioAnterior: {
      cantidad: variacion(reporte.actual.cantidad, reporte.anioAnterior.cantidad),
      neto: variacion(reporte.actual.neto, reporte.anioAnterior.neto),
    },
  };

  return reporte;
};

module.exports = { parsePeriodo, generarReporteMensual };
