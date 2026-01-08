const express = require("express");
const router = express.Router();
const membershipsController = require("./controllers/membershipsController");

router
  .get("/", membershipsController.getMemberships)
  .post("/", membershipsController.createMembership);

router.route("/trash").get(membershipsController.getDeletedMemberships);

router.get("/user/:userId", membershipsController.getByUser);
router.get("/tenant/:tenantId", membershipsController.getByTenant);
router.get("/:id", membershipsController.getMembershipById);
router.put("/:id", membershipsController.updateMembership);
router.delete("/:id", membershipsController.updateStatus);

router.delete("/trash/:id", membershipsController.updateStatus);

module.exports = router;
