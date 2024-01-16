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
  getJobsParts,
} = require("./controllers/jobControl");

routerJob.route("/").get(getJobs).post(addJob);

routerJob.route("/urg").get(getUrgentJobs);

routerJob.route("/urg/:id").put(updateJob).get(getJob).delete(deleteJob);
routerJob.route("/:id").put(updateJob).get(getJob).delete(deleteJob);

routerJob.route("/:id&/partId");

module.exports = routerJob;
