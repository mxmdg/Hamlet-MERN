var express = require("express");
var router = express.Router();
const {
  getAll,
  addUser,
  getUser,
  updateUser,
  deleteUser,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("./controllers/usersController");

/* GET users listing. */
router.post("/login", login);
router.post("/register", addUser);
router.post("/forgot-password", forgotPassword);
router.get("/", getAll);
router.get("/:id", getUser);
router.put("/:id/change-password", changePassword);
router.put("/resetPassword/:token", resetPassword);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
