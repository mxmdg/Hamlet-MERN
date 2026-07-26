const express = require("express");
const router = express.Router();
const membershipsController = require("./controllers/membershipsController");

/*
 * Rutas de SUPERADMIN (master global).
 *
 * Todo lo que sea una vista "cross-tenant" (ver datos de TODOS los
 * tenants a la vez) vive acá, no colgado de la ruta normal del recurso.
 * Esto mantiene las rutas por-tenant limpias y concentra las vistas
 * globales en un solo lugar, protegido como master en index.js.
 *
 * Cuando necesites otra vista global (ej: todos los jobs de todos los
 * tenants), la agregás acá.
 */

// GET /Hamlet/master/memberships -> TODAS las membership de TODOS los tenants
router.get("/memberships", membershipsController.getAllMemberships);

module.exports = router;
