const express = require("express");
const router = express.Router();
const membershipsController = require("./controllers/membershipsController");

router
  .get("/", membershipsController.getMemberships)
  .post("/", membershipsController.createMembership);

router.get("/user/:userId", membershipsController.getByUser);
router.get("/tenant/:tenantId", membershipsController.getByTenant);

module.exports = router;
