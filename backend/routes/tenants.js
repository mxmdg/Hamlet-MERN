const { Router } = require("express");
const routerTenants = Router();
const path = require("path");

const {
  getTenants,
  getTenant,
  getSettings,
  addTenant,
  updateTenant,
  updateSettings,
} = require("./controllers/tenantControl");

const { register } = require("./controllers/onboardingControl");

routerTenants.route("/").get(getTenants).post(register);
routerTenants.route("/settings/:id").get(getSettings).put(updateSettings);
routerTenants.route("/:id").put(updateTenant).get(getTenant);

module.exports = routerTenants;
