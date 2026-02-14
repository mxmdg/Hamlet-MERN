const Membership = require("../../models/memberships");
const usersModel = require("../../models/usersSchema");
const tentansModel = require("../../models/tenants");

const membershipsController = {};

membershipsController.getMemberships = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const memberships = await Membership.find({
      tenant,
      status: { $ne: "inactivo" },
    })
      .populate("userId", "Name LastName email")
      .populate("tenant", "key name plan status")
      .select("role status");
    res.json(memberships);
  } catch (e) {
    next(e);
  }
};

membershipsController.getDeletedMemberships = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const memberships = await Membership.find({
      tenant,
      status: { $eq: "inactivo" },
    })
      .populate("userId", "name email")
      .populate("tenant", "key name plan status");
    res.json(memberships);
  } catch (e) {
    next(e);
  }
};

membershipsController.updateMembership = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const membership = await Membership.findOneAndUpdate(
      { _id: req.params.id, tenant },
      req.body,
      { new: true },
    )
      .populate("userId", "name email")
      .populate("tenant", "key name status plan");
    if (!membership)
      return res.status(404).json({ message: "Membership no encontrada" });
    res.json(membership);
  } catch (e) {
    next(e);
  }
};

membershipsController.getMembershipById = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const membership = await Membership.findOne({ _id: req.params.id, tenant })
      .populate("userId", "name email")
      .populate("tenant", "key name status plan");
    if (!membership)
      return res.status(404).json({ message: "Membership no encontrada" });
    res.json(membership);
  } catch (e) {
    next(e);
  }
};

membershipsController.getByUser = async (req, res, next) => {
  try {
    //const tenant = req.header("x-tenant");
    const memberships = await Membership.find({
      userId: req.params.userId,
    }).populate("tenant", "key name status plan");
    res.json(memberships);
  } catch (e) {
    next(e);
  }
};

membershipsController.getByUserAndDelete = async (req, res, next) => {
  try {
    //const tenant = req.header("x-tenant");
    const memberships = await Membership.findOneAndDelete({
      userId: req.params.userId,
    });
    res.json(`Membresia Eliminada ${memberships._id}`);
  } catch (e) {
    next(e);
  }
};

membershipsController.getByTenant = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const memberships = await Membership.find({
      tenant,
    })
      .populate("userId", "name email")
      .populate("tenant", "key name status plan");
    res.json(memberships);
  } catch (e) {
    next(e);
  }
};

membershipsController.createMembership = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const { role, status } = req.body;
    const userEmail = req.body.userEmail;

    if (!userEmail) {
      return res.status(400).json({ message: "Email de usuario no provisto" });
    }

    const user = await usersModel.esquema.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "El usuario no existe" });
    }

    const activeTenant = await tentansModel.esquema.findOne({ _id: tenant });
    if (!activeTenant) {
      return res
        .status(404)
        .json({ message: "Error al identificar la imprenta actual" });
    }

    const newMembership = new Membership({
      userId: user._id,
      tenant,
      role,
      status,
    });
    console.log(newMembership);
    const membership = await newMembership.save();
    res.status(201).json({
      message: `${user.Name} ${user.LastName} ha sido agregado como ${newMembership.role} a ${activeTenant.name}`,
    });
  } catch (e) {
    res.status(500).json({
      message:
        e.code === 11000
          ? `Este usuario ya tiene una membresia para esta imprenta.`
          : "No se pudo crear la membresía.",
      code: e.code,
    });
    next(e);
  }
};

membershipsController.deleteMembershipSoft = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const membership = await Membership.findOneAndUpdate(
      { _id: req.params.id, tenant },
      { status: "inactivo" },
      { new: true },
    ).populate("userId");
    if (!membership)
      return res.status(404).json({ message: "Membership no encontrada" });
    res.json({
      message: `${membership.userId.Name} ${membership.userId.LastName} ha sido desactivado como ${membership.role} de esta empresa.`,
      membership,
    });
  } catch (e) {
    next(e);
  }
};

membershipsController.updateStatus = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const m = await Membership.findOne({ _id: req.params.id, tenant });
    if (!m)
      return res.status(404).json({ message: "Membership no encontrada" });
    m.status = m.status === "activo" ? "inactivo" : "activo";
    await m.save();
    res.json({ message: "Estado actualizado", membership: m });
  } catch (error) {
    next(error);
  }
};

membershipsController.deleteMembership = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const membership = await Membership.findOneAndDelete({
      _id: req.params.id,
      tenant,
    });
    if (!membership)
      return res.status(404).json({ message: "Membership no encontrada" });
    res.json({ message: "Membership eliminada correctamente" });
  } catch (e) {
    next(e);
  }
};

module.exports = membershipsController;
