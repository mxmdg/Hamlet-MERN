const tenant = require("../../models/tenants");
const Membership = require("../../models/memberships");
const Printer = require("../../models/printers");
const Material = require("../../models/materiales");
const Formato = require("../../models/formatos");
const Price = require("../../models/prices");
const JobPart = require("../../models/jobParts");
const Job = require("../../models/Jobs");
const Quotation = require("../../models/quotations");
const Empresa = require("../../models/empresas");
const Finisher = require("../../models/finishers");

const flattenNestedItems = (elements) => {
  const flattened = {};

  for (const key in elements) {
    if (typeof elements[key] === "object" && elements[key] !== null) {
      for (const subKey in elements[key]) {
        flattened[`${key}.${subKey}`] = elements[key][subKey];
      }
    } else {
      flattened[key] = elements[key];
    }
  }
  return flattened;
};

const tenantsControl = {};

tenantsControl.addTenant = async (req, res, next) => {
  try {
    const { key, name, status = "activo", plan = "trial" } = req.body;

    // Normalizar key
    const keyNormalized = key.trim().toLowerCase();

    // Crear tenant
    const newTenant = new tenant.esquema({
      key: keyNormalized,
      name,
      status,
      plan,
    });

    console.log(newTenant);

    await newTenant.save();

    // Crear membership admin para el usuario actual
    await Membership.create({
      userId: req.user.userId,
      tenantId: newTenant._id,
      role: "admin",
      status: "activo",
    });

    console.log("Membership admin creado para el nuevo tenant");

    res.status(201).json({
      message: `Tenant ${newTenant.name} creado correctamente`,
      tenant: newTenant,
    });
  } catch (e) {
    // key duplicada
    if (e.code === 11000) {
      return res.status(400).json({
        message: "Ya existe una imprenta con ese identificador",
      });
    }
    console.log(e);
    next(e);
  }
};

tenantsControl.getTenants = async (req, res, next) => {
  try {
    const tenants = await tenant.esquema.find().select("-__v");
    res.json(tenants);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

tenantsControl.getTenant = async (req, res, next) => {
  try {
    const tenantData = await tenant.esquema.findById(req.params.id);
    res.json(tenantData);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

tenantsControl.getSettings = async (req, res, next) => {
  try {
    const tenantData = await tenant.esquema.findById(req.params.id);
    const settingsFlattened = flattenNestedItems(tenantData.settings);
    const flattenLevel2 = flattenNestedItems(settingsFlattened);

    res.json(flattenLevel2);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

tenantsControl.updateTenant = async (req, res, next) => {
  try {
    const { status, plan, name } = req.body;

    const update = {};

    if (status) update.status = status;
    if (plan) update.plan = plan;
    if (name) update.name = name;

    const updatedTenant = await tenant.esquema.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!updatedTenant) {
      return res.status(404).json({ message: "Tenant no encontrado" });
    }

    res.json({
      message: `Tenant ${updatedTenant.name} actualizado`,
      tenant: updatedTenant,
    });
  } catch (e) {
    next(e);
  }
};

tenantsControl.updateSettings = async (req, res, next) => {
  try {
    const tenantId = req.header("x-tenant");
    const settingsUpdate = req.body;

    const updatedTenant = await tenant.esquema.findByIdAndUpdate(
      tenantId,
      { $set: { settings: settingsUpdate } },
      { new: true, runValidators: true }
    );

    if (!updatedTenant) {
      return res.status(404).json({ message: "Tenant no encontrado" });
    }

    res.json({
      message: `Configuración del tenant ${updatedTenant.name} actualizada`,
      settings: updatedTenant.settings,
    });
  } catch (e) {
    next(e);
  }
};

tenantsControl.hardDeleteTenant = async (req, res, next) => {
  try {
    const tenantId = req.params.id;

    // Verificar que no haya elementos relacionados al tenant
    const [
      printers,
      materials,
      formatos,
      prices,
      jobParts,
      jobs,
      quotations,
      empresas,
      finishers,
    ] = await Promise.all([
      Printer.esquema.countDocuments({ tenant: tenantId }),
      Material.esquema.countDocuments({ tenant: tenantId }),
      Formato.esquema.countDocuments({ tenant: tenantId }),
      Price.esquema.countDocuments({ tenant: tenantId }),
      JobPart.esquema.countDocuments({ tenant: tenantId }),
      Job.esquema.countDocuments({ tenant: tenantId }),
      Quotation.esquema.countDocuments({ tenant: tenantId }),
      Empresa.esquema.countDocuments({ tenant: tenantId }),
      Finisher.esquema.countDocuments({ tenant: tenantId }),
    ]);

    const totalElements =
      printers +
      materials +
      formatos +
      prices +
      jobParts +
      jobs +
      quotations +
      empresas +
      finishers;

    if (totalElements > 0) {
      return res.status(400).json({
        message:
          "No se puede eliminar el tenant porque contiene elementos relacionados",
        details: {
          printers,
          materials,
          formatos,
          prices,
          jobParts,
          jobs,
          quotations,
          empresas,
          finishers,
        },
      });
    }

    const deletedTenant = await tenant.esquema.findByIdAndDelete(tenantId);

    res.json({
      message: `${deletedTenant.name} eliminado correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

tenantsControl.definitiveDelete = async (req, res, next) => {
  try {
    const tenantId = req.params.id;

    // Obtener datos del tenant antes de eliminarlo
    const deletedTenant = await tenant.esquema.findById(tenantId);

    if (!deletedTenant) {
      return res.status(404).json({ message: "Tenant no encontrado" });
    }

    // Eliminar todos los elementos relacionados con el tenant en paralelo
    const deletionResults = await Promise.allSettled([
      Printer.esquema.deleteMany({ tenant: tenantId }),
      Material.esquema.deleteMany({ tenant: tenantId }),
      Formato.esquema.deleteMany({ tenant: tenantId }),
      Price.esquema.deleteMany({ tenant: tenantId }),
      JobPart.esquema.deleteMany({ tenant: tenantId }),
      Job.esquema.deleteMany({ tenant: tenantId }),
      Quotation.esquema.deleteMany({ tenant: tenantId }),
      Empresa.esquema.deleteMany({ tenant: tenantId }),
      Finisher.esquema.deleteMany({ tenant: tenantId }),
    ]);

    // Eliminar el tenant
    await tenant.esquema.findByIdAndDelete(tenantId);

    // Contar cuántos elementos fueron eliminados
    const deletedCounts = {
      printers:
        deletionResults[0].status === "fulfilled"
          ? deletionResults[0].value.deletedCount
          : 0,
      materials:
        deletionResults[1].status === "fulfilled"
          ? deletionResults[1].value.deletedCount
          : 0,
      formatos:
        deletionResults[2].status === "fulfilled"
          ? deletionResults[2].value.deletedCount
          : 0,
      prices:
        deletionResults[3].status === "fulfilled"
          ? deletionResults[3].value.deletedCount
          : 0,
      jobParts:
        deletionResults[4].status === "fulfilled"
          ? deletionResults[4].value.deletedCount
          : 0,
      jobs:
        deletionResults[5].status === "fulfilled"
          ? deletionResults[5].value.deletedCount
          : 0,
      quotations:
        deletionResults[6].status === "fulfilled"
          ? deletionResults[6].value.deletedCount
          : 0,
      empresas:
        deletionResults[7].status === "fulfilled"
          ? deletionResults[7].value.deletedCount
          : 0,
      finishers:
        deletionResults[8].status === "fulfilled"
          ? deletionResults[8].value.deletedCount
          : 0,
    };

    res.json({
      message: `Tenant "${deletedTenant.name}" y todos sus elementos relacionados han sido eliminados`,
      deletedTenant: deletedTenant.name,
      deletedElements: deletedCounts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  ...tenantsControl,
  flattenNestedItems,
};
