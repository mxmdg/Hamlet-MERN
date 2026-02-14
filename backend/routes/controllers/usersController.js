const usersModel = require("../../models/usersSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const mailer = require("../../services/mail");
const Membership = require("../../models/memberships");

const Port = process.env.PORT;
const uiPort = process.env.UIPORT;
const URL = process.env.URL;
const expireTime = 24 * 60 * 60 * 1000; //horas en milisegundos

const getAll = async (req, res, next) => {
  try {
    const users = await usersModel.esquema
      .find({ status: { $ne: "inactivo" } })
      .select("-__v");
    res.json(users);
  } catch (e) {
    next(e);
    return [];
  }
};

const getDeletedUsers = async (req, res, next) => {
  try {
    const users = await usersModel.esquema
      .find({ status: { $eq: "inactivo" } })
      .select("-__v");
    res.json(users);
  } catch (e) {
    next(e);
    return [];
  }
};

const addUser = async (req, res, next) => {
  const newUser = new usersModel.esquema({ ...req.body });
  try {
    await newUser.save();
    res.json({ message: newUser.Name + " " + newUser.LastName + " Saved" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await usersModel.esquema.findById(req.params.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const newUser = await usersModel.esquema.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
    );
    res.json({ message: newUser.Name + newUser.LastName + " Saved" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await usersModel.esquema.findByIdAndUpdate(
      { status: "inactivo" },
      { new: true },
    );
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: `Usuario ${user.Name} desactivado`, user });
  } catch (error) {
    console.error("Error:" + error);
    next(error);
  }
};

const hardDeleteUser = async (req, res, next) => {
  try {
    const user = await usersModel.esquema.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: `Usuario ${user.Name} ELIMINADO`, user });
  } catch (error) {
    console.error("Error:" + error);
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const user = await usersModel.esquema.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    user.status = user.status === "activo" ? "inactivo" : "activo";
    await user.save();
    res.json({ message: `Usuario ${user.Name} actualizado`, user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const document = await usersModel.esquema.findOne({
      email: req.body.email,
    });
    if (!document) {
      res.json({ message: "El correo no existe" });
    }
    if (bcrypt.compareSync(req.body.password, document.password)) {
      try {
        // 1. JWT igual que hoy
        const token = jwt.sign(
          {
            userId: document._id,
            role: document.Role, // se mantiene
          },
          req.app.get("secretKey"),
          { expiresIn: expireTime / 1000 },
        );

        const expirationTime = Date.now() + expireTime;

        // 2. NUEVO: buscar memberships activas
        const memberships = await Membership.find({
          userId: document._id,
          status: "activo",
        }).populate("tenant", "key name status plan");

        // 3. Normalizar respuesta (no mandamos todo el modelo crudo)
        const formattedMemberships = memberships.map((m) => ({
          tenant: {
            id: m.tenant._id,
            key: m.tenant.key,
            name: m.tenant.name,
            status: m.tenant.status,
            plan: m.tenant.plan,
          },
          role: m.role,
        }));

        // 4. Respuesta extendida (compatible)
        return res.json({
          token,
          document, // lo dejamos por compatibilidad
          expirationTime,
          memberships: formattedMemberships,
        });
      } catch (e) {
        next(e);
      }
    } else {
      next(res.json({ message: "la contraseña es incorrecta" }));
    }
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  console.log("Cambiemos el pass");

  try {
    const userId = req.params.id;
    console.log("ID del user: " + userId);

    const user = await usersModel.esquema
      .findOne({ _id: userId })
      .select("+password");

    console.log(user);

    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    console.log(oldPassword, newPassword, confirmNewPassword);

    const passwordOk = bcrypt.compareSync(oldPassword, user.password);

    console.log(passwordOk);

    if (!passwordOk) {
      return res
        .status(400)
        .json({ message: "La contraseña actual es incorrecta" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: "La nueva contraseña y la confirmación no coinciden",
      });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Debe ingresar la contraseña actual y la nueva",
      });
    }

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error.message);
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await usersModel.esquema.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No se encontró un usuario con este correo electrónico",
      });
    }

    // Generar un token único
    const token = uuid.v4();

    // Guardar el token en la base de datos junto con el usuario
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + expireTime; // 1 dia de expiración
    await user.save();

    const resetPasswordLink = `www.hamlet.com.ar/users/reset-password/${token}`;
    const mailOptions = {
      from: "Seguridad Hamlet <no-reply@hamlet.com.ar>",
      to: email,
      subject: "Recuperar mi contraseña en Hamlet",
      text: `Para restablecer tu contraseña, hacé clic en el siguiente enlace: ${resetPasswordLink}`,
    };

    await mailer.sendMailByResend(mailOptions);

    res.json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    console.error("Error al solicitar recuperación de contraseña:", error);
    next(error);
  }
};

const sendFeedback = async (req, res, next) => {
  try {
    const { name, lastName, email, message, page, company } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Por favor, no olvides dejarnos tu mensaje!",
      });
    }

    const mailOptions = {
      from: "Feedback Hamlet <no-reply@hamlet.com.ar>",
      to: "maxiomaro@gmail.com", // o el mail que uses vos
      subject: `Feedback de ${name || ""} ${lastName || ""} (${email})`,
      text: `
Se recibió un nuevo feedback:

Mensaje:
${message}

Email del usuario:
${email || "No informado"}

Página:
${page || "No informada"}

Empresa:
${company || "No informado"}
      `,
    };

    await mailer.sendMailByResend(mailOptions);

    res.json({ message: "Feedback enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar feedback:", error);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Buscar el usuario por el token de restablecimiento de contraseña
    const user = await usersModel.esquema.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    console.log(user);
    console.log(token);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token inválido o expirado " + JSON.stringify(user) });
    }

    // Actualizar la contraseña
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    console.log(user);
    await user.save();

    res.json({ message: "Contraseña restablecida exitosamente" });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    next(error);
  }
};

module.exports = {
  getAll,
  addUser,
  getUser,
  updateUser,
  deleteUser,
  getDeletedUsers,
  updateStatus,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  hardDeleteUser,
  sendFeedback,
};
