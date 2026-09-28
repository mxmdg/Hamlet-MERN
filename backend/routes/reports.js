const { Router } = require("express");
const routerReports = Router();
const { getMonthlyReport } = require("./controllers/reportsControl");

// Los permisos se definen en routes/index.js (/Hamlet/reports: solo admin)
routerReports.route("/monthly/:periodo").get(getMonthlyReport);

module.exports = routerReports;
