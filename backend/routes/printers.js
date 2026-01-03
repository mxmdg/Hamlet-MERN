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
  deletePrinter,
  QueryPrinter,
  getDeletedPrinters,
  updateStatus,
} = require("./controllers/printerControl");

routerPrinter.route("/").get(getPrinters).post(addPrinter);

routerPrinter.route("/trash").get(getDeletedPrinters);

routerPrinter.route("/simple/").get(getPrintersSimple);
routerPrinter.route("/simple/:id").get(getPrinterSimple);

routerPrinter
  .route("/:id")
  .put(updatePrinter)
  .get(getPrinter)
  .delete(updateStatus);

routerPrinter.route("/trash/:id").delete(updateStatus);

module.exports = routerPrinter;
