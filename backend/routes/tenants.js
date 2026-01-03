const { Router } = require("express");
const routerTenants = Router();
const path = require("path");

const {
  getTenants,
  addTenant,
  getTenant,
  updateTenant,
} = require("./controllers/tenantControl");

routerTenants.route("/").get(getTenants).post(addTenant);
routerTenants.route("/:id").put(updateTenant).get(getTenant);

module.exports = routerTenants;
