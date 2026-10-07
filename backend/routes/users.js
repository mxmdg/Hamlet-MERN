var express = require("express");
var router = express.Router();
const { requireRoleByMethod } = require("../middlewares/auth");

const {
  getAll,
  addUser,
  getUser,
  getDeletedUsers,
  updateUser,
  deleteUser,
  login,
  changePassword,
  updateStatus,
  forgotPassword,
  resetPassword,
  hardDeleteUser,
  sendFeedback,
} = require("./controllers/usersController");

const ALL_ROLES = ["admin", "manager", "vendedor", "operator"];
const masterOnly = (method) => requireRoleByMethod({ [method]: ["master"] });
const anyRole = (method) => requireRoleByMethod({ [method]: ALL_ROLES });

/* Rutas públicas (sin sesión) */
router.post("/login", login);
router.post("/register", addUser);
router.post("/forgot-password", forgotPassword);
router.post("/feedback", sendFeedback);
router.put("/:id/change-password", changePassword); // pendiente de proteger
router.put("/resetPassword/:token", resetPassword);

/* Solo master */
router.get("/", masterOnly("get"), getAll);
router.get("/trash", masterOnly("get"), getDeletedUsers);
router.delete("/:id", masterOnly("delete"), updateStatus);
router.delete("/trash/:id", masterOnly("delete"), updateStatus);
router.delete("/destroy/:id", masterOnly("delete"), hardDeleteUser);

/* Cualquier usuario logueado (el controlador limita a la cuenta propia) */
router.get("/:id", anyRole("get"), getUser);
router.put("/:id", anyRole("put"), updateUser);

module.exports = router;