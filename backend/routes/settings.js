const { Router } = require("express");
const routerSettings = Router();
const path = require("path");

const {
  getSettings,
  updateTenant,
  updateSettings,
} = require("./controllers/tenantControl");

const { register } = require("./controllers/onboardingControl");

routerSettings.route("/:id").get(getSettings).put(updateSettings);

routerSettings.route("/").get(getSettings)



module.exports = routerSettings;
