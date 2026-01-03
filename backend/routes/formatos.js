const { Router } = require("express");
const routerFormat = Router();
const path = require("path");
const {
  getFormats,
  getDeletedFormats,
  addFormat,
  getFormat,
  updateFormat,
  updateStatus,
} = require("./controllers/formatControl");

routerFormat.route("/").get(getFormats).post(addFormat);

routerFormat.route("/trash").get(getDeletedFormats);

//Restore format from trash
routerFormat.route("/trash/:id").delete(updateStatus);

routerFormat
  .route("/:id")
  .put(updateFormat)
  .get(getFormat)
  .delete(updateStatus);

module.exports = routerFormat;
