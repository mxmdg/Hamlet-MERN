var express = require("express");
var router = express.Router();
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

/* GET users listing. */
router.post("/login", login);
router.post("/register", addUser);
router.post("/forgot-password", forgotPassword);
router.post("/feedback", sendFeedback);
router.get("/", getAll);
router.get("/trash", getDeletedUsers);
router.get("/:id", getUser);
router.put("/:id/change-password", changePassword);
router.put("/resetPassword/:token", resetPassword);
router.put("/:id", updateUser);
router.delete("/:id", updateStatus);
router.delete("/trash/:id", updateStatus);
router.delete("/destroy/:id", hardDeleteUser);

module.exports = router;
