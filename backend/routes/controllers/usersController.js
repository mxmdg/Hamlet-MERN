const usersModel = require("../../models/usersSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

module.exports = {
  getAll,
  addUser,
  getUser,
  updateUser,
  deleteUser,
  login,
  changePassword,
};
