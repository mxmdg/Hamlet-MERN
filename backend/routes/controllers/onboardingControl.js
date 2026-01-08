const tenant = require("../../models/tenants");
const user = require("../../models/usersSchema");
const Membership = require("../../models/memberships");

const onboardingController = {};

onboardingController.register = async (req, res, next) => {
  try {
    const {
      key,
      name,
      status = "activo",
      plan = "trial",
      userName,
      userLastname,
      email,
      password,
      passwordConfirm,
    } = req.body;

    if (!key || !name) {
      return res.status(400).json({
        message: "Datos de imprenta incompletos",
      });
    }

    const keyNormalized = key.trim().toLowerCase();

    if (password !== passwordConfirm) {
      return res.status(400).json({
        message: "Las contraseñas no coinciden",
      });
    }

    const existingUser = await user.esquema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Ya existe un usuario con ese email",
      });
    }

    const existingTenant = await tenant.esquema.findOne({ key: keyNormalized });
    if (existingTenant) {
      return res.status(400).json({
        message: "Ya existe una imprenta con ese identificador",
      });
    }

    const newUser = await user.esquema.create({
      Name: userName,
      LastName: userLastname,
      email,
      password,
      role: "admin",
      status: "activo",
    });

    const newTenant = await tenant.esquema.create({
      key: keyNormalized,
      name,
      status,
      plan,
    });

    await Membership.create({
      userId: newUser._id,
      tenant: newTenant._id,
      role: "admin",
      status: "activo",
    });

    return res.status(201).json({
      message: "Onboarding completado",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = onboardingController;
