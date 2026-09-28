const {
  parsePeriodo,
  generarReporteMensual,
} = require("../../services/reports/monthlyReport");

const reportsControl = {};

// Reporte mensual: el mes pedido contra el anterior y el mismo mes del año pasado
// GET /Hamlet/reports/monthly/2026-09
reportsControl.getMonthlyReport = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    if (!tenant) {
      return res.status(400).json({ message: "Falta el header x-tenant" });
    }

    const periodo = parsePeriodo(req.params.periodo);
    if (!periodo) {
      return res
        .status(400)
        .json({ message: "Período inválido, usar el formato AAAA-MM" });
    }

    const reporte = await generarReporteMensual(
      tenant,
      periodo.anio,
      periodo.mes,
    );
    res.json(reporte);
  } catch (error) {
    next(error);
  }
};

module.exports = reportsControl;
