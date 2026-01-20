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
  hardDeleteTenant,
  definitiveDelete,
} = require("./controllers/tenantControl");

const { register } = require("./controllers/onboardingControl");

routerTenants.route("/").get(getTenants).post(register);
routerTenants.route("/settings/:id").get(getSettings).put(updateSettings);
routerTenants
  .route("/:id")
  .put(updateTenant)
  .get(getTenant)
  .delete(hardDeleteTenant);

routerTenants.route("/destroy/:id").delete(definitiveDelete);

module.exports = routerTenants;
