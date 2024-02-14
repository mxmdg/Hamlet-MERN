const usersModel = require("../../models/usersSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const uuid = require("uuid");

const getAll = async (req, res, next) => {
  try {
    const users = await usersModel.esquema.find();
    res.json(users);
  } catch (e) {
    next(e);
    return [];
  }
};

const addUser = async (req, res, next) => {
  const newUser = new usersModel.esquema(req.body);
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
      req.body
    );
    res.json({ message: newUser.Name + newUser.LastName + " Saved" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await usersModel.esquema.findByIdAndDelete(req.params.id);
    ({ message: `Usuario ${user.Name} eliminado` });
  } catch (error) {
    console.error("Error:" + error);
    next(e);
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
        const token = jwt.sign(
          { userId: document._id },
          req.app.get("secretKey"),
          { expiresIn: "1d" }
        );
        const expirationTime = Date.now() + 24 * 60 * 60000;
        return res.json({ token, document, expirationTime });
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
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    // Buscar el usuario por su ID
    const user = await usersModel.esquema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña actual
    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return res
        .status(400)
        .json({ message: "La contraseña actual es incorrecta" });
    }

    // Actualizar la contraseña
    user.password = newPassword; //bcrypt.hashSync(newPassword, 10);
    await user.save();

    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
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
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora de expiración
    await user.save();

    // Enviar correo electrónico con el enlace para restablecer la contraseña
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "maxiomaro@gmail.com", // tu dirección de correo electrónico de Gmail
        pass: "Dante1108yGaspar0406", // tu contraseña de Gmail
      },
    });

    const resetPasswordLink = `http://localhost:3000/reset-password?token=${token}`;
    const mailOptions = {
      from: "maxiomaro@gmail.com",
      to: email,
      subject: "Recuperación de Contraseña",
      text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetPasswordLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message:
            "Error al enviar el correo electrónico de recuperación de contraseña: " +
            error.message,
        });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({
          message:
            "Correo electrónico de recuperación de contraseña enviado exitosamente",
        });
      }
    });
  } catch (error) {
    console.error("Error al solicitar recuperación de contraseña:", error);
    next(error);
  }
};

module.exports = {
  getAll,
  addUser,
  getUser,
  updateUser,
  deleteUser,
  login,
  changePassword,
  forgotPassword,
};
