const { Router } = require("express");
const routerJobPart = Router();
const path = require("path");
const jobPart = require("../models/jobParts");

const {
  getJobParts,
  addJobPart,
  getJobPart,
  updateJobPart,
  deleteJobPart,
  getDeletedJobParts,
  updateStatus,
} = require("./controllers/jobPartControl");

routerJobPart.route("/").get(getJobParts).post(addJobPart);
routerJobPart.route("/trash").get(getDeletedJobParts);

routerJobPart
  .route("/:id")
  .put(updateJobPart)
  .get(getJobPart)
  .delete(updateStatus);

routerJobPart.route("/trash/:id").delete(updateStatus);

module.exports = routerJobPart;
