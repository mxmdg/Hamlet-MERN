// services/tenantSettings.service.js
const Tenant = require("../models/tenants");
const { flattenNestedItems } = require("../routes/controllers/tenantControl");

async function getTenantSettings(tenantId) {
  const tenant = await Tenant.esquema.findById(tenantId).lean();

  if (!tenant || !tenant.settings) {
    throw new Error("Tenant sin settings");
  }

  const level1 = flattenNestedItems(tenant.settings);
  const level2 = flattenNestedItems(level1);

  return level2;
}

module.exports = { getTenantSettings };
