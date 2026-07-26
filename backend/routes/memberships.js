const express = require("express");
const router = express.Router();
const membershipsController = require("./controllers/membershipsController");

/*
 * Este router es SOLO para memberships del tenant actual.
 * La vista global de superadmin (todas las membership de todos los
 * tenants) NO vive acá: se movió a su propia ruta /Hamlet/master/...
 * con getAllMemberships, protegida como master. Ver routes/master.js.
 *
 * Nota: antes había un GET "/" duplicado. El primero era
 * getAllMemberships (global, sin filtrar tenant) y ganaba sobre el
 * segundo, lo que filtraba datos entre tenants en una ruta pública.
 * Ahora "/" usa getMemberships, filtrado por el header x-tenant.
 */

router
  .route("/")
  .get(membershipsController.getMemberships)
  .post(membershipsController.createMembership);

router.route("/trash").get(membershipsController.getDeletedMemberships);

router
  .get("/user/:userId", membershipsController.getByUser)
  .delete("/user/:userId", membershipsController.getByUserAndDelete);

router.get("/tenant/:tenantId", membershipsController.getByTenant);

router.get("/:id", membershipsController.getMembershipById);
router.put("/:id", membershipsController.updateMembership);
router.delete("/:id", membershipsController.updateStatus);

router
  .delete("/trash/:id", membershipsController.updateStatus)
  .delete("/destroy/:id", membershipsController.deleteMembership);

module.exports = router;
