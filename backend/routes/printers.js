const { Router } = require("express");
const routerPrinter = Router();
const fsExtra = require("fs-extra");
const path = require("path");

const {
  getPrinters,
  addPrinter,
  getPrinter,
  getPrinterSimple,
  getPrintersSimple,
  updatePrinter,
  updatePrinterNoBilling,
  updateBilling,
  deletePrinter,
  QueryPrinter,
  getDeletedPrinters,
  updateStatus,
} = require("./controllers/printerControl");

routerPrinter.route("/").get(getPrinters).post(addPrinter);

routerPrinter.route("/trash").get(getDeletedPrinters);

routerPrinter.route("/simple/").get(getPrintersSimple);
routerPrinter.route("/simple/:id").get(getPrinterSimple);

routerPrinter.route("/billing/:id").put(updatePrinter).get(getPrinter);

routerPrinter.route("/billingCorrect/:id").put(updateBilling).get(getPrinter);


routerPrinter.route("/trash/:id").delete(updateStatus);

routerPrinter
  .route("/:id")
  .put(updatePrinterNoBilling)
  .get(getPrinter)
  .delete(updateStatus);


module.exports = routerPrinter;
