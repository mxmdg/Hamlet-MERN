const { Router } = require("express");
const routerTenants = Router();
const path = require("path");

const {
  getTenants,
  getTenant,
  addTenant,
  updateTenant,
  hardDeleteTenant,
  definitiveDelete,
} = require("./controllers/tenantControl");

const { register } = require("./controllers/onboardingControl");

routerTenants.route("/").get(getTenants).post(register);

routerTenants
  .route("/:id")
  .put(updateTenant)
  .get(getTenant)
  .delete(hardDeleteTenant);

routerTenants.route("/destroy/:id").delete(definitiveDelete);

module.exports = routerTenants;
