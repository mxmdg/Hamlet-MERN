const { Router } = require("express");
const routerCompanies = Router();
const path = require("path");
const {
  getCompanies,
  addCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  getDeletedCompanies,
  updateStatus,
} = require("./controllers/empresasControl");
routerCompanies.route("/trash").get(getDeletedCompanies);

routerCompanies.route("/").get(getCompanies).post(addCompany);

routerCompanies
  .route("/:id")
  .put(updateCompany)
  .get(getCompany)
  .delete(updateStatus);

routerCompanies.route("/trash/:id").delete(updateStatus);

module.exports = routerCompanies;
