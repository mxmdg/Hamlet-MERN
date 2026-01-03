const tenant = require("../../models/tenants");
const Membership = require("../../models/memberships");

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

module.exports = tenantsControl;
