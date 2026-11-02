const { Router } = require("express");
const routerFinisher = Router();
const fsExtra = require("fs-extra");
const path = require("path");

const {
  getFinishers,
  getDeletedFinishers,
  addFinisher,
  getFinisher,
  getFinihsersByJobPartsAllowed,
  updateFinisher,
  updateStatus,
} = require("./controllers/finishersControl");

routerFinisher.route("/").get(getFinishers).post(addFinisher);

routerFinisher.route("/jobPart/:partType").get(getFinihsersByJobPartsAllowed);

routerFinisher.route("/trash").get(getDeletedFinishers);

//Restore format from trash
routerFinisher.route("/trash/:id").delete(updateStatus);

routerFinisher
  .route("/:id")
  .get(getFinisher)
  .put(updateFinisher)
  .delete(updateStatus);

module.exports = routerFinisher;
