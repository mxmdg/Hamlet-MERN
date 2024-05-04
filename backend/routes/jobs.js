const { Router } = require("express");
const routerJob = Router();
const fsExtra = require("fs-extra");
const path = require("path");
const {
  getJobs,
  addJob,
  getJob,
  getUrgentJobs,
  updateJob,
  deleteJob,
  getAllParts,
  getOwnerJobs,
  getCompanyJobs,
  getCompleteJobs,
} = require("./controllers/jobControl");

routerJob.route("/").get(getJobs).post(addJob);

routerJob.route("/urg").get(getUrgentJobs);
routerJob.route("/complete").get(getCompleteJobs);
routerJob.route("/owner/:id").get(getOwnerJobs);
routerJob.route("/company/:id").get(getCompanyJobs);
routerJob.route("/partes").get(getAllParts);

routerJob.route("/urg/:id").put(updateJob).get(getJob).delete(deleteJob);
routerJob.route("/:id").put(updateJob).get(getJob).delete(deleteJob);

routerJob.route("/partId").get(getAllParts);

module.exports = routerJob;
