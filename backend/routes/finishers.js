const { Router } = require("express");
const routerFinisher = Router();
const fsExtra = require("fs-extra");
const path = require("path");

const {
  getFinishers,
  addFinisher,
  getFinisher,
  updateFinisher,
  deleteFinisher,
} = require("./controllers/finishersControl");

routerFinisher.route("/").get(getFinishers).post(addFinisher);

routerFinisher
  .route("/:id")
  .get(getFinisher)
  .put(updateFinisher)
  .delete(deleteFinisher);

module.exports = routerFinisher;
