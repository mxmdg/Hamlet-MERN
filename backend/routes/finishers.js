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
  .put(updateFinisher)
  .get(getFinisher)
  .delete(deleteFinisher);

module.exports = routerFinisher;
